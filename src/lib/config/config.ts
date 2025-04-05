import { z } from 'zod';
import dotenv from 'dotenv';

export function loadConfig() {
	dotenv.config();

	const envSchema = z.object({
		COFFEE_API_URL: z
			.string()
			.url()
			.default('https://random-data-api.com/api/coffee/random_coffee'),
		IMAGE_API_URL: z.string().url().default('https://loremflickr.com/json/500/500/coffee,bean'),
		CACHE_TTL_SECONDS: z.coerce.number().int().positive().default(86400),
		IMAGE_CACHE_TTL_SECONDS: z.coerce.number().int().positive().default(604800),
		CHECK_PERIOD_SECONDS: z.coerce.number().int().positive().default(600),
		AUTO_LOAD_INTERVAL_MS: z.coerce.number().int().positive().default(30000),
		LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),
		NODE_ENV: z.enum(['development', 'production', 'test']).default('development')
	});

	const env = envSchema.safeParse(process.env);

	if (!env.success) {
		throw new Error(`Invalid environment variables: ${JSON.stringify(env.error.format())}`);
	}

	return {
		api: {
			coffee: env.data.COFFEE_API_URL,
			image: env.data.IMAGE_API_URL
		},
		cache: {
			ttl: env.data.CACHE_TTL_SECONDS * 1000,
			imageTtl: env.data.IMAGE_CACHE_TTL_SECONDS * 1000,
			checkPeriod: env.data.CHECK_PERIOD_SECONDS * 1000
		},
		autoLoad: {
			interval: env.data.AUTO_LOAD_INTERVAL_MS
		},
		log: {
			level: env.data.LOG_LEVEL
		},
		env: env.data.NODE_ENV,
		isProduction: env.data.NODE_ENV === 'production',
		isDevelopment: env.data.NODE_ENV === 'development'
	};
}

export const config = loadConfig();
export type Config = ReturnType<typeof loadConfig>;
