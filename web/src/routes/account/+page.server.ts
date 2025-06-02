import { error, type Actions } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import type { Session } from '@auth/sveltekit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const session: Session | null | undefined = await event.locals.auth();

	if (!session?.user?.id) {
		return error(401, { message: 'Unauthenticated' });
	}

	const allUsers = await db.select().from(users).where(eq(users.id, session.user.id));
	if (allUsers.length !== 1) {
		console.error(`more than one user found for id: ${session.user.id}`);
		return error(401, { message: 'More than one user found' });
	}

	return {
		user: allUsers[0]
	};
};

export const actions = {
	default: async (event) => {
		const form = await event.request.formData();
		const session = await event.locals.auth();

		if (!session?.user?.id) {
			console.error('Unauthenticated');
			return error(401, { message: 'Unauthenticated' });
		}

		await db
			.update(users)
			.set({
				name: form.get('name')?.toString() || session.user.name,
				email: form.get('email')?.toString() || session.user.email || '',
				tel: form.get('tel')?.toString() || '',
				notify: `${form.has('notifyViaEmail') ? 'email' : ''},${form.has('notifyViaTel') ? 'tel' : ''}`
			})
			.where(eq(users.id, session?.user?.id));
	}
} satisfies Actions;
