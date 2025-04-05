import { getCachedImageUrl } from '$lib/server/cache';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	try {
		const decodedUrl = decodeURIComponent(params.url);
		const imageUrl = await getCachedImageUrl(decodedUrl);
		return json({ url: imageUrl });
	} catch (err) {
		throw error(500, `Failed to process image URL: ${err}`);
	}
};
