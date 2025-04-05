import { getCachedCoffee } from '$lib/server/cache';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const initialCoffee = await getCachedCoffee(0);

	return {
		initialCoffee: initialCoffee || null
	};
};
