import { config } from '$lib/config';
import logger from '$lib/server/logger';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	logger.info(`Running in ${config.isProduction ? 'production' : 'development'} mode`);

	const start = Date.now();
	logger.info(
		{
			method: event.request.method,
			path: event.url.pathname,
			ip: event.getClientAddress()
		},
		'Incoming request'
	);

	const response = await resolve(event);

	logger.info(
		{
			method: event.request.method,
			path: event.url.pathname,
			status: response.status,
			duration: `${Date.now() - start}ms`
		},
		'Request completed'
	);

	return response;
};
