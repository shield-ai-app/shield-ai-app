import type { LayoutServerData } from './$types';

export const load: LayoutServerData = async (event) => {
	const session = await event.locals.auth();

	return {
		session
	};
};
