import type { Config } from 'drizzle-kit';

export default {
	dialect: 'postgresql',
	schema: './src/lib/server/schema.ts',
	out: './drizzle',
	dbCredentials: {
		url: process.env.DATABASE_URL!
	}
} satisfies Config;
