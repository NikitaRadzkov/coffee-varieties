<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	function handleHomeClick(event: MouseEvent) {
		event.preventDefault();
		goto('/');
	}
</script>

<svelte:head>
	<title>Page Not Found | Coffee Explorer</title>
	<meta
		name="description"
		content="The page you're looking for doesn't exist. Return to explore our coffee varieties."
	/>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<div class="error-container">
	<div class="error-content">
		<h1>Page Not Found</h1>
		<p>We couldn't find the page you're looking for.</p>
		<div class="path-container">
			<p>You tried to access: <code class="truncated-path">{page.url.pathname}</code></p>
		</div>

		<a href="/" class="home-link" on:click|preventDefault={handleHomeClick}>
			← Return to Coffee Explorer
		</a>
	</div>
</div>

<style lang="postcss">
	.error-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		background-color: #f8f9fa;
		padding: 1rem;
	}

	.error-content {
		width: 100%;
		max-width: 600px;
		text-align: center;
		background: white;
		padding: 2rem;
		border-radius: 12px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		margin: 0 auto;
	}

	h1 {
		color: #dc3545;
		font-size: 2rem;
		margin-bottom: 1rem;
		line-height: 1.2;
	}

	p {
		color: #6c757d;
		font-size: 1rem;
		margin-bottom: 1rem;
		line-height: 1.5;
	}

	.path-container {
		min-height: 2.5rem;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 1rem;
	}

	.truncated-path {
		background: #f1f1f1;
		padding: 0.2rem 0.4rem;
		border-radius: 4px;
		font-family: monospace;
		display: inline-block;
		max-width: 20rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		vertical-align: middle;
	}

	.home-link {
		display: inline-block;
		margin-top: 1.5rem;
		padding: 0.75rem 1.5rem;
		background-color: #5d4037;
		color: white;
		text-decoration: none;
		border-radius: 24px;
		transition: background-color 0.2s ease;
		font-weight: 500;
		cursor: pointer;
		font-size: 1rem;

		&:hover {
			background-color: #3e2723;
		}
	}

	@media (max-width: 640px) {
		.error-content {
			padding: 1.5rem;
		}

		h1 {
			font-size: 1.75rem;
		}

		.path-container {
			min-height: 2.2rem;
		}

		.truncated-path {
			max-width: 90vw;
		}
	}

	@media (max-width: 400px) {
		.error-content {
			padding: 1rem;
		}

		h1 {
			font-size: 1.5rem;
		}

		.truncated-path {
			max-width: 85vw;
		}
	}
</style>
