import NodeCache from 'node-cache';
import type { CoffeeData, ProcessedCoffeeData } from '$lib/types';
import logger from './logger';
import { config } from '$lib/config';

const coffeeCache = new NodeCache({
	stdTTL: config.cache.ttl,
	checkperiod: config.cache.checkPeriod,
	useClones: false
});

const imageCache = new NodeCache({
	stdTTL: config.cache.imageTtl,
	checkperiod: config.cache.checkPeriod
});

export async function getCachedImageUrl(url: string): Promise<string> {
	const cached = imageCache.get<string>(url);
	if (cached) return cached;

	try {
		imageCache.set(url, url);
		return url;
	} catch (err) {
		logger.error('Failed to cache image:', err);
		return url;
	}
}

export async function getCachedCoffee(index: number): Promise<ProcessedCoffeeData | null> {
	const cached = coffeeCache.get<ProcessedCoffeeData>(index.toString());

	if (cached) return cached;

	try {
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 5000);

		const coffeeRes = await fetch(config.api.coffee, {
			signal: controller.signal
		});
		clearTimeout(timeout);

		if (!coffeeRes.ok) {
			throw new Error(`Coffee API responded with status ${coffeeRes.status}`);
		}

		const coffeeData: CoffeeData = await coffeeRes.json();

		const imageController = new AbortController();
		const imageTimeout = setTimeout(() => imageController.abort(), 5000);

		const imageRes = await fetch(config.api.image, {
			signal: imageController.signal
		});
		clearTimeout(imageTimeout);

		if (!imageRes.ok) {
			throw new Error(`Image API responded with status ${imageRes.status}`);
		}

		const imageData = await imageRes.json();

		const data: ProcessedCoffeeData = {
			blend_name: coffeeData.blend_name,
			origin: coffeeData.origin,
			variety: coffeeData.variety,
			notes: coffeeData.notes.split(', '),
			intensifier: coffeeData.intensifier,
			imageUrl: imageData.file
		};

		coffeeCache.set(index.toString(), data);
		return data;
	} catch (err) {
		logger.error(`Failed to fetch coffee data for index ${index}:`, err);
		return null;
	}
}
