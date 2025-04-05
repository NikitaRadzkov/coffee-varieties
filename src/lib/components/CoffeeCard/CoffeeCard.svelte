<script lang="ts">
	import logger from '$lib/client/logger';
	import { getTagColor, getTextColor } from '$lib/client/utils';
	import type { ProcessedCoffeeData } from '$lib/types';
	import { onMount } from 'svelte';

	export let data: ProcessedCoffeeData;

	let imageLoaded = false;
	let imageError = false;
	let finalImageUrl = '';

	onMount(async () => {
		try {
			if (typeof window !== 'undefined' && data.imageUrl) {
				const encoded = encodeURIComponent(data.imageUrl);
				const res = await fetch(`/api/image/${encoded}`);
				const json = await res.json();
				finalImageUrl = json.url || data.imageUrl;
			} else {
				finalImageUrl = data.imageUrl;
			}
		} catch (err) {
			logger.error('Failed to proxy image:', err);
			finalImageUrl = data.imageUrl;
		}
	});
</script>

<div class="card">
	<div class="image-container">
		{#if data.intensifier}
			<span class="intensifier-badge">{data.intensifier}</span>
		{/if}
		{#if !imageLoaded && !imageError}
			<div class="image-placeholder">Loading image...</div>
		{/if}
		{#if imageError}
			<div class="image-placeholder error">Image not available</div>
		{/if}
		{#if finalImageUrl}
			<img
				src={finalImageUrl}
				alt="{data.blend_name} coffee"
				class={imageLoaded ? 'visible' : ''}
				on:load={() => (imageLoaded = true)}
				on:error={() => (imageError = true)}
			/>
		{/if}
	</div>

	<div class="content">
		<h2>{data.blend_name}</h2>
		<div class="meta">
			<span class="origin">Origin: {data.origin}</span>
			<span class="variety">Variety: {data.variety}</span>
		</div>

		<div class="notes-container">
			<div class="notes-scroller">
				{#each data.notes as note (note)}
					<span
						class="note-tag"
						style="background-color: {getTagColor(note)}; color: {getTextColor(getTagColor(note))}"
					>
						{note}
					</span>
				{/each}
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
	.card {
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		background: white;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
		margin-bottom: 24px;
		max-width: 500px;
		width: 100%;

		&:hover {
			transform: translateY(-4px);
			box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
		}
	}

	.image-container {
		position: relative;
		width: 100%;
		aspect-ratio: 1 / 1;
		background: #f5f5f5;
		overflow: hidden;
	}

	.image-placeholder {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #666;
		font-size: 14px;

		&.error {
			color: #d32f2f;
		}
	}

	.intensifier-badge {
		position: absolute;
		top: 12px;
		right: 12px;
		background-color: rgba(0, 0, 0, 0.7);
		color: white;
		padding: 4px 8px;
		border-radius: 16px;
		font-size: 1.2rem;
		z-index: 2;
		backdrop-filter: blur(2px);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
	}

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		opacity: 0;
		transition: opacity 0.3s ease;

		&.visible {
			opacity: 1;
		}
	}

	.content {
		padding: 16px;
	}

	h2 {
		margin: 0 0 8px 0;
		font-size: 1.5rem;
		color: #2c3e50;
	}

	.meta {
		display: flex;
		flex-direction: column;
		gap: 4px;
		margin-bottom: 12px;
		font-size: 0.9rem;
		color: #666;

		span {
			display: inline-block;
		}
	}

	.notes-container {
		width: 100%;
		overflow-x: auto;
		padding-bottom: 8px;
	}

	.notes-scroller {
		display: flex;
		gap: 8px;
		padding: 4px 0;
	}

	.note-tag {
		padding: 4px 8px;
		border-radius: 16px;
		font-size: 0.8rem;
		white-space: nowrap;
		flex-shrink: 0;
		margin-right: 6px;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;

		&:hover {
			transform: translateY(-2px);
			box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		}

		&:last-child {
			margin-right: 0;
		}
	}
</style>
