import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';

let getCachedImageUrl: typeof import('./cache').getCachedImageUrl;
let getCachedCoffee: typeof import('./cache').getCachedCoffee;

const mockGet = vi.fn();
const mockSet = vi.fn();
const mockLoggerError = vi.fn();

vi.mock('node-cache', () => {
	return {
		default: vi.fn().mockImplementation(() => ({
			get: mockGet,
			set: mockSet
		}))
	};
});

vi.mock('$lib/config', () => ({
	config: {
		cache: {
			ttl: 100,
			checkPeriod: 120,
			imageTtl: 300
		},
		api: {
			coffee: 'https://example.com/api/coffee',
			image: 'https://example.com/api/image'
		}
	}
}));

vi.mock('./logger', () => ({
	default: {
		error: mockLoggerError
	}
}));

describe('Cache', () => {
	beforeEach(async () => {
		mockGet.mockReset();
		mockSet.mockReset();
		mockLoggerError.mockReset();
		vi.resetModules();

		const cacheModule = await import('./cache');
		getCachedImageUrl = cacheModule.getCachedImageUrl;
		getCachedCoffee = cacheModule.getCachedCoffee;
	});

	describe('getCachedImageUrl', () => {
		it('should return cached image URL if exists', async () => {
			mockGet.mockReturnValueOnce('https://cached-image.com/test.jpg');

			const result = await getCachedImageUrl('https://test.com/img.jpg');
			expect(result).toBe('https://cached-image.com/test.jpg');
			expect(mockGet).toHaveBeenCalledWith('https://test.com/img.jpg');
		});

		it('should set and return new image URL if not cached', async () => {
			mockGet.mockReturnValueOnce(undefined);

			const result = await getCachedImageUrl('https://test.com/img.jpg');
			expect(result).toBe('https://test.com/img.jpg');
			expect(mockSet).toHaveBeenCalledWith('https://test.com/img.jpg', 'https://test.com/img.jpg');
		});

		it('should log error and return URL if caching fails', async () => {
			mockGet.mockReturnValueOnce(undefined);
			mockSet.mockImplementationOnce(() => {
				throw new Error('fail to set');
			});

			const result = await getCachedImageUrl('https://fail.com/img.jpg');
			expect(result).toBe('https://fail.com/img.jpg');
			expect(mockLoggerError).toHaveBeenCalled();
		});
	});

	describe('getCachedCoffee', () => {
		beforeEach(() => {
			vi.stubGlobal('fetch', vi.fn());
		});

		afterEach(() => {
			vi.unstubAllGlobals();
		});

		it('should return cached coffee data if exists', async () => {
			const cachedData = {
				blend_name: 'Test Blend',
				origin: 'Brazil',
				variety: 'Arabica',
				notes: ['sweet', 'fruity'],
				intensifier: 'smooth',
				imageUrl: 'https://img.jpg'
			};

			mockGet.mockReturnValueOnce(cachedData);

			const result = await getCachedCoffee(1);
			expect(result).toEqual(cachedData);
		});

		it('should fetch, process and cache coffee data', async () => {
			mockGet.mockReturnValueOnce(undefined);

			(fetch as Mock).mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					blend_name: 'Espresso Deluxe',
					origin: 'Colombia',
					variety: 'Typica',
					notes: 'rich, chocolate, nutty',
					intensifier: 'bold'
				})
			});

			(fetch as Mock).mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					file: 'https://cdn.example.com/image.jpg'
				})
			});

			const result = await getCachedCoffee(3);

			expect(result).toEqual({
				blend_name: 'Espresso Deluxe',
				origin: 'Colombia',
				variety: 'Typica',
				notes: ['rich', 'chocolate', 'nutty'],
				intensifier: 'bold',
				imageUrl: 'https://cdn.example.com/image.jpg'
			});

			expect(mockSet).toHaveBeenCalledWith(
				'3',
				expect.objectContaining({
					blend_name: 'Espresso Deluxe'
				})
			);
		});

		it('should log and return null if fetch fails', async () => {
			mockGet.mockReturnValueOnce(undefined);

			(fetch as Mock).mockResolvedValueOnce({
				ok: false,
				status: 500
			});

			const result = await getCachedCoffee(2);
			expect(result).toBeNull();
			expect(mockLoggerError).toHaveBeenCalled();
		});
	});
});
