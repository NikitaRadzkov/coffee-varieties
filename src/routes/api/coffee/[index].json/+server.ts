import { getCachedCoffee } from '$lib/server/cache';
import { json } from '@sveltejs/kit';

export async function GET({ params }: { params: { index: string } }) {
	const index = parseInt(params.index);
	if (isNaN(index)) {
		return json({ error: 'Invalid index' }, { status: 400 });
	}

	const coffeeData = await getCachedCoffee(index);
	if (!coffeeData) {
		return json({ error: 'Failed to load coffee data' }, { status: 500 });
	}

	return json(coffeeData);
}
