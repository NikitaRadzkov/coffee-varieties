<script lang="ts">
	import CoffeeCard from '$lib/components/CoffeeCard';
	import { onMount } from 'svelte';
	import type { ProcessedCoffeeData } from '$lib/types';
	import logger from '$lib/client/logger';

	type Timer = number | undefined;

	export let data: { initialCoffee: ProcessedCoffeeData | null };

	interface CoffeeCardItem {
		id: number;
		data: ProcessedCoffeeData | null;
		loading: boolean;
		error: boolean;
	}

	let cards: CoffeeCardItem[] = data.initialCoffee
		? [{ id: 0, data: data.initialCoffee, loading: false, error: false }]
		: [];

	let loading: boolean = false;
	let lastActivity: number = Date.now();
	let autoLoadTimer: Timer;

	onMount(() => {
		setupAutoLoad();
		return () => {
			if (autoLoadTimer !== undefined) {
				clearInterval(autoLoadTimer);
			}
		};
	});

	function setupAutoLoad(): void {
		autoLoadTimer = window.setInterval(() => {
			if (Date.now() - lastActivity > 30000 && !loading) {
				addCard();
			}
		}, 1000);
	}

	function recordActivity(): void {
		lastActivity = Date.now();
	}

	async function addCard(): Promise<void> {
		if (loading) return;

		const newId = cards.length;
		cards = [
			...cards,
			{
				id: newId,
				data: null,
				loading: true,
				error: false
			}
		];
		loading = true;
		recordActivity();

		try {
			const response = await fetch(`/api/coffee/${newId}.json`);
			if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

			const coffeeData: ProcessedCoffeeData = await response.json();
			cards = cards.map((card) =>
				card.id === newId ? { ...card, data: coffeeData, loading: false } : card
			);
		} catch (err) {
			logger.error('Failed to load coffee data:', err);
			cards = cards.map((card) =>
				card.id === newId ? { ...card, loading: false, error: true } : card
			);
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Coffee Explorer - Discover Unique Coffee Blends</title>
	<meta
		name="description"
		content="Explore an infinite feed of specialty coffee varieties from around the world"
	/>
	<meta name="robots" content="index, follow" />
</svelte:head>

<div
	role="application"
	class="container"
	on:mousemove={recordActivity}
	on:touchmove={recordActivity}
>
	<h1>Coffee Explorer</h1>

	<div class="cards-container">
		{#each cards as card (card.id)}
			{#if card.error}
				<div class="error-card">Failed to load coffee data</div>
			{:else if card.loading}
				<div class="loading-card">Loading coffee...</div>
			{:else if card.data}
				<CoffeeCard data={card.data} />
			{/if}
		{/each}
	</div>

	<button class="load-more" on:click={addCard} disabled={loading}>
		{loading ? 'Loading...' : 'Load More Coffee'}
	</button>
</div>

<style lang="postcss">
	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 24px 16px;
	}

	h1 {
		text-align: center;
		color: #5d4037;
		margin-bottom: 32px;
	}

	.cards-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 24px;
		margin-bottom: 32px;
	}

	.loading-card,
	.error-card {
		width: 100%;
		max-width: 500px;
		padding: 40px;
		text-align: center;
		background: white;
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.error-card {
		color: #d32f2f;
		background: #ffebee;
	}

	.load-more {
		display: block;
		margin: 0 auto;
		padding: 12px 24px;
		background: #5d4037;
		color: white;
		border: none;
		border-radius: 24px;
		font-size: 1rem;
		cursor: pointer;
		transition: background 0.2s ease;

		&:hover {
			background: #3e2723;
		}

		&:disabled {
			background: #bcaaa4;
			cursor: not-allowed;
		}
	}
</style>
