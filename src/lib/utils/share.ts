export interface ShareData {
	projectName: string;
	progress: number;
	completedCount: number;
	totalCount: number;
	url: string;
}

export function getTweetText(data: ShareData): string {
	const { projectName, progress, completedCount, totalCount } = data;

	if (progress === 100) {
		return `Just shipped ${projectName}! All ${totalCount} milestones complete.`;
	}

	if (progress >= 75) {
		return `Almost there! ${projectName} is ${progress}% complete. Final stretch!`;
	}

	if (progress >= 50) {
		return `Halfway milestone reached! ${projectName} is ${progress}% done.`;
	}

	return `Building ${projectName} in public: ${progress}% complete (${completedCount}/${totalCount} milestones)`;
}

export function buildTwitterShareUrl(options: {
	text: string;
	url: string;
	hashtags?: string[];
}): string {
	const params = new URLSearchParams();
	params.set('text', options.text);
	params.set('url', options.url);

	if (options.hashtags?.length) {
		params.set('hashtags', options.hashtags.join(','));
	}

	return `https://twitter.com/intent/tweet?${params.toString()}`;
}

export function getShareUrl(data: ShareData): string {
	const text = getTweetText(data);
	return buildTwitterShareUrl({
		text,
		url: data.url,
		hashtags: ['buildinpublic', 'indiehacker']
	});
}
