import { config } from '$lib/config';
import pino from 'pino';

const options = config.isDevelopment
	? {
			transport: {
				target: 'pino-pretty',
				options: {
					colorize: true
				}
			}
		}
	: {};

const logger = pino(options);

export default logger;
