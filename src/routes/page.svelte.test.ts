import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import CoffeeExplorer from './+page.svelte';

vi.mock('$lib/client/logger', () => ({
	default: {
		error: vi.fn()
	}
}));

beforeEach(() => {
	global.fetch = vi.fn().mockResolvedValue({
		ok: true,
		json: async () => ({
			blend_name: 'Test Blend',
			origin: 'Brazil',
			variety: 'Arabica',
			notes: ['sweet', 'chocolate'],
			intensifier: 'bold',
			imageUrl: 'https://image.com/img.jpg'
		})
	}) as typeof fetch;
});

afterEach(() => {
	vi.restoreAllMocks();
});

describe('CoffeeExplorer', () => {
	it('renders initial coffee data', async () => {
		const mockData = { initialCoffee: null };

		render(CoffeeExplorer, { props: { data: mockData } });

		expect(screen.getByText('Coffee Explorer')).toBeInTheDocument();
		expect(screen.getByText('Load More Coffee')).toBeInTheDocument();
		expect(screen.getByRole('button')).not.toBeDisabled();
	});

	it('loads more coffee data when "Load More Coffee" button is clicked', async () => {
		const mockData = { initialCoffee: null };

		render(CoffeeExplorer, { props: { data: mockData } });

		const button = screen.getByRole('button');
		expect(button).toHaveTextContent('Load More Coffee');

		fireEvent.click(button);

		await waitFor(() => {
			expect(button).toHaveTextContent('Loading...');
		});

		await waitFor(() => {
			expect(screen.getByText('Test Blend')).toBeInTheDocument();
		});
	});

	it('shows error card when fetching fails', async () => {
		global.fetch = vi.fn().mockRejectedValueOnce(new Error('Failed to fetch data'));

		const mockData = { initialCoffee: null };

		render(CoffeeExplorer, { props: { data: mockData } });

		fireEvent.click(screen.getByRole('button'));

		await waitFor(() => {
			expect(screen.getByText('Failed to load coffee data')).toBeInTheDocument();
		});
	});
});
