import { describe, it, expect, vi, beforeAll } from 'vitest';
import { loadConfig } from './config';

describe('Configuration', () => {
	let config: ReturnType<typeof loadConfig>;

	describe('with mocked env', () => {
		beforeAll(() => {
			vi.stubEnv('COFFEE_API_URL', 'https://test-api.com');
			vi.stubEnv('CACHE_TTL_SECONDS', '3600');
			vi.stubEnv('NODE_ENV', 'production');
			config = loadConfig();
		});

		it('loads mocked values', () => {
			expect(config.api.coffee).toBe('https://test-api.com');
			expect(config.cache.ttl).toBe(3600 * 1000);
		});

		it('has correct production flags', () => {
			expect(config.isProduction).toBe(true);
			expect(config.isDevelopment).toBe(false);
		});
	});

	describe('with empty env', () => {
		beforeAll(() => {
			vi.unstubAllEnvs();
			config = loadConfig();
		});

		it('uses default API URL', () => {
			expect(config.api.coffee).toBe('https://random-data-api.com/api/coffee/random_coffee');
		});

		it('uses default cache TTL', () => {
			expect(config.cache.ttl).toBe(86400 * 1000);
		});
	});

	describe('with invalid env', () => {
		it('throws error for invalid URL', () => {
			vi.stubEnv('COFFEE_API_URL', 'invalid-url');
			expect(() => loadConfig()).toThrowError(/Invalid environment variables/);
		});

		it('throws error for negative TTL', () => {
			vi.stubEnv('CACHE_TTL_SECONDS', '-100');
			expect(() => loadConfig()).toThrowError(/Invalid environment variables/);
		});
	});
});
