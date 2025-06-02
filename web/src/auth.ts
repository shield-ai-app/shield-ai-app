import { SvelteKitAuth } from '@auth/sveltekit';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from './lib/server/db.ts';
import google from '@auth/sveltekit/providers/google';
import { NODE_ENV } from '$env/static/private';

export const { handle, signIn, signOut } = SvelteKitAuth({
	adapter: DrizzleAdapter(db),
	providers: [google],
	debug: NODE_ENV === 'development',
	trustHost: true,
	callbacks: {
		async session({ session, token, user }) {
			return session;
		}
	}
});
