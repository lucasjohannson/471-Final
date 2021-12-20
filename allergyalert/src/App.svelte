<script lang="ts">
	import GroceryStore from "./GroceryStore.svelte";
import LogIn from "./LogIn.svelte";
	import Profile from "./Profile.svelte";
	import { viewName } from "./stores";

</script>

<main>
{#if $viewName == "login"}
	<LogIn></LogIn>
{:else if $viewName == "profile"}
	<Profile></Profile>
{:else if $viewName == "grocery"}
	<GroceryStore></GroceryStore>
{/if}



</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>



