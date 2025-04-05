import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './+server';
import * as cache from '$lib/server/cache';

vi.mock('$lib/server/cache');

const getCachedCoffee = vi.mocked(cache.getCachedCoffee);

describe('Coffee API endpoint', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should returns coffee data', async () => {
		const mockData = {
			blend_name: 'Test Blend',
			origin: 'Test',
			variety: 'Test',
			notes: ['test'],
			intensifier: 'test',
			imageUrl: 'test.jpg'
		};

		getCachedCoffee.mockResolvedValue(mockData);

		const response = await GET({ params: { index: '0' } });
		const data = await response.json();

		expect(response.status).toBe(200);
		expect(data).toEqual(mockData);
	});

	it('should handles invalid index', async () => {
		const response = await GET({ params: { index: 'invalid' } });
		expect(response.status).toBe(400);
	});

	it('should handles fetch errors', async () => {
		getCachedCoffee.mockResolvedValue(null);

		const response = await GET({ params: { index: '1' } });
		expect(response.status).toBe(500);
	});
});
