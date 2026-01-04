import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users } from '../src/lib/server/db/schema';
import { eq } from 'drizzle-orm';

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

const email = process.argv[2];
const plan = process.argv[3] as 'free' | 'pro';

if (!email || !plan) {
	console.log('Usage: npx tsx scripts/toggle-plan.ts <email> <free|pro>');
	console.log('Example: npx tsx scripts/toggle-plan.ts john@example.com pro');
	process.exit(1);
}

if (plan !== 'free' && plan !== 'pro') {
	console.log('Plan must be "free" or "pro"');
	process.exit(1);
}

async function main() {
	const [user] = await db
		.select({ id: users.id, email: users.email, plan: users.plan })
		.from(users)
		.where(eq(users.email, email));

	if (!user) {
		console.log(`User not found: ${email}`);
		await client.end();
		process.exit(1);
	}

	console.log(`Current plan: ${user.plan}`);

	await db.update(users).set({ plan, updatedAt: new Date() }).where(eq(users.id, user.id));

	console.log(`Updated to: ${plan}`);
	await client.end();
}

main().catch((err) => {
	console.error(err);
	client.end();
});
