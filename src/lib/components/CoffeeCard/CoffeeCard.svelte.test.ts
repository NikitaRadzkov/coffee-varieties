import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/svelte';
import CoffeeCard from './CoffeeCard.svelte';
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';

vi.mock('$lib/client/logger', () => ({
	default: {
		error: vi.fn()
	}
}));

beforeEach(() => {
	global.fetch = vi.fn().mockResolvedValue({
		ok: true,
		json: async () => ({ url: 'https://proxy.image/test.jpg' })
	}) as typeof fetch;
});

afterEach(() => {
	vi.restoreAllMocks();
});

const mockData = {
	blend_name: 'Test Blend',
	origin: 'Brazil',
	variety: 'Arabica',
	notes: ['sweet', 'chocolate'],
	intensifier: 'bold',
	imageUrl: 'https://image.com/img.jpg'
};

describe('CoffeeCard', () => {
	it('renders coffee data', async () => {
		render(CoffeeCard, { props: { data: mockData } });

		expect(screen.getByText('Test Blend')).toBeInTheDocument();
		expect(screen.getByText('Origin: Brazil')).toBeInTheDocument();
		expect(screen.getByText('Variety: Arabica')).toBeInTheDocument();
		expect(screen.getByText('bold')).toBeInTheDocument();
		expect(screen.getByText('sweet')).toBeInTheDocument();
		expect(screen.getByText('chocolate')).toBeInTheDocument();

		await waitFor(() => {
			const img = screen.getByRole('img') as HTMLImageElement;
			expect(img).toBeInTheDocument();
			expect(img.src).toBe('https://proxy.image/test.jpg');
		});
	});

	it('shows fallback if image fails', async () => {
		(global.fetch as Mock).mockRejectedValueOnce(new Error('fail'));

		render(CoffeeCard, { props: { data: mockData } });

		await waitFor(() => {
			expect(screen.queryByText('Image not available')).not.toBeInTheDocument();
		});
	});
});
