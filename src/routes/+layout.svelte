<script lang="ts">
	import { page } from '$app/state';
</script>

{#if page.status === 404 && page.url.pathname !== '/'}
	<slot />
{:else}
	<div class="app-container">
		<slot />
	</div>
{/if}
