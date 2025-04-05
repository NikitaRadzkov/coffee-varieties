import '@testing-library/jest-dom/vitest';
import { render, fireEvent } from '@testing-library/svelte';
import ErrorPage from './+error.svelte';
import { goto } from '$app/navigation';
import { describe, expect, it, vi } from 'vitest';

vi.mock('$app/navigation', () => ({
	goto: vi.fn()
}));

vi.mock('$app/state', () => ({
	page: {
		url: {
			pathname: '/some-path'
		}
	}
}));

describe('ErrorPage', () => {
	it('should display the correct title and error message', () => {
		const { getByText } = render(ErrorPage);

		expect(getByText('Page Not Found')).toBeInTheDocument();
		expect(getByText("We couldn't find the page you're looking for.")).toBeInTheDocument();
	});

	it('should display the path that was attempted', () => {
		const { getByText } = render(ErrorPage);

		expect(getByText('/some-path')).toBeInTheDocument();
	});

	it('should call `goto` when the "Return to Coffee Explorer" link is clicked', async () => {
		const { getByText } = render(ErrorPage);

		const homeLink = getByText('← Return to Coffee Explorer');
		await fireEvent.click(homeLink);

		expect(goto).toHaveBeenCalledWith('/');
	});
});
