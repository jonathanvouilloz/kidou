import { ImageResponse } from '@ethercorps/sveltekit-og';
import { GoogleFont, resolveFonts } from '@ethercorps/sveltekit-og/fonts';
import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users, projects, milestones } from '$lib/server/db/schema';
import { eq, and, asc } from 'drizzle-orm';

export const GET: RequestHandler = async ({ params, url }) => {
	// Parse query params
	const format = url.searchParams.get('format') || 'og';

	// Dimensions based on format
	const dimensions =
		format === 'hd' ? { width: 1920, height: 1080 } : { width: 1200, height: 630 };

	// Fetch user
	const user = await db
		.select({
			id: users.id,
			username: users.username,
			name: users.name
		})
		.from(users)
		.where(eq(users.username, params.user!))
		.limit(1);

	if (user.length === 0) {
		return new Response('User not found', { status: 404 });
	}

	// Fetch project
	const project = await db
		.select()
		.from(projects)
		.where(
			and(
				eq(projects.userId, user[0].id),
				eq(projects.slug, params.project!),
				eq(projects.isPublic, true)
			)
		)
		.limit(1);

	if (project.length === 0) {
		return new Response('Project not found', { status: 404 });
	}

	// Fetch milestones
	const projectMilestones = await db
		.select({
			id: milestones.id,
			title: milestones.title,
			isCompleted: milestones.isCompleted
		})
		.from(milestones)
		.where(eq(milestones.projectId, project[0].id))
		.orderBy(asc(milestones.position));

	// Calculate stats
	const totalCount = projectMilestones.length;
	const completedCount = projectMilestones.filter((m) => m.isCompleted).length;
	const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
	const daysSinceCreation = Math.floor(
		(Date.now() - new Date(project[0].createdAt).getTime()) / (1000 * 60 * 60 * 24)
	);

	// Load fonts
	const jetBrainsMono = new GoogleFont('JetBrains Mono', { weight: 400 });
	const jetBrainsMonoBold = new GoogleFont('JetBrains Mono', { weight: 700 });

	// Generate progress bar
	const progressBarFilled = Math.round(progress / 2.5); // 40 chars max
	const progressBarEmpty = 40 - progressBarFilled;
	const progressBar = '\u2588'.repeat(progressBarFilled) + '\u2591'.repeat(progressBarEmpty);

	// Stack badges (limit to 4)
	const stackBadges = (project[0].stack || []).slice(0, 4);

	// Build HTML template - Terminal style
	const html = `
		<div tw="flex flex-col w-full h-full bg-[#0d0d0d] p-0">
			<!-- Terminal window -->
			<div tw="flex flex-col w-full h-full">
				<!-- Title bar -->
				<div tw="flex items-center justify-between px-6 py-4 bg-[#1a1a1a] border-b border-[#333333]">
					<div tw="flex items-center">
						<div tw="flex">
							<div tw="w-4 h-4 rounded-full bg-[#ff5f56] mr-2"></div>
							<div tw="w-4 h-4 rounded-full bg-[#ffbd2e] mr-2"></div>
							<div tw="w-4 h-4 rounded-full bg-[#27c93f]"></div>
						</div>
					</div>
					<div tw="flex text-[#666666] text-xl" style="font-family: 'JetBrains Mono'">
						kidou.app
					</div>
				</div>

				<!-- Content -->
				<div tw="flex flex-col flex-1 p-12">
					<!-- Project name -->
					<div tw="flex text-5xl text-white font-bold mb-2" style="font-family: 'JetBrains Mono'">
						PROJECT_${project[0].name.replace(/\s+/g, '_').toUpperCase()}
					</div>

					<!-- Username -->
					<div tw="flex text-2xl text-[#666666] mb-12" style="font-family: 'JetBrains Mono'">
						@${user[0].username}
					</div>

					<!-- Progress bar -->
					<div tw="flex flex-col mb-8">
						<div tw="flex items-center">
							<div tw="flex text-3xl text-[#00ff41] mr-4" style="font-family: 'JetBrains Mono'">
								${progressBar}
							</div>
							<div tw="flex text-4xl text-white font-bold" style="font-family: 'JetBrains Mono'">
								${progress}%
							</div>
						</div>
					</div>

					<!-- Stats -->
					<div tw="flex flex-col text-2xl text-[#a0a0a0]" style="font-family: 'JetBrains Mono'">
						<div tw="flex mb-2">
							<span tw="text-[#00ff41] mr-2">&gt;</span>
							${completedCount}/${totalCount} MILESTONES COMPLETE
						</div>
						<div tw="flex">
							<span tw="text-[#00ff41] mr-2">&gt;</span>
							${daysSinceCreation} DAY${daysSinceCreation !== 1 ? 'S' : ''} IN PROGRESS
						</div>
					</div>

					<!-- Stack badges -->
					${
						stackBadges.length > 0
							? `
					<div tw="flex mt-auto">
						${stackBadges
							.map(
								(tech) => `
							<div tw="flex px-4 py-2 mr-3 bg-[#1a1a1a] border border-[#333333] rounded text-lg text-[#a0a0a0]" style="font-family: 'JetBrains Mono'">
								${tech}
							</div>
						`
							)
							.join('')}
					</div>
					`
							: ''
					}
				</div>
			</div>
		</div>
	`;

	return new ImageResponse(html, {
		...dimensions,
		fonts: await resolveFonts([jetBrainsMono, jetBrainsMonoBold]),
		headers: {
			'Cache-Control': 'public, max-age=3600, s-maxage=86400'
		}
	});
};
