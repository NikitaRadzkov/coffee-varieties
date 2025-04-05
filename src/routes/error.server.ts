import { error } from '@sveltejs/kit';
import type { Load } from '@sveltejs/kit';

export const load: Load = ({ params }) => {
	throw error(404, {
		message: `Route not found: ${params.rest ? `/${params.rest}` : ''}`
	});
};
