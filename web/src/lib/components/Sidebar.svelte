<script lang="ts">
	import { page } from '$app/stores';
	import { store } from '$lib/stores.svelte';
	import type { EventT } from '$lib/types';
	import type { Session } from '@auth/sveltekit';
	import { Button } from './ui/button';
	import { SignIn } from '@auth/sveltekit/components';

	export let events: EventT[];
	let session: Session | null | undefined = $page.data.session;
</script>

<div class="flex h-full w-full flex-col gap-2 p-8">
	{#if !!!session}
		<div class="flex w-full items-center justify-center pb-4">
			<Button class="w-full">
				<SignIn signInPage="signin">
					<div slot="submitButton">Don't Compromise on Safety - Sign Up for Free</div>
				</SignIn>
			</Button>
		</div>
	{/if}

	{#each events as event}
		<button
			onclick={() => {
				store.activeEvent = event.id;
				store.map?.flyTo({
					center: [event.lat, event.lon],
					zoom: 13, // Adjust the zoom level as needed
					speed: 1.2 // Optional: Animation speed
				});
			}}
			class={`flex w-full rounded border ${store.activeEvent === event.id ? 'border-slate-500' : 'border-accent'} p-2 text-left hover:bg-accent hover:text-accent-foreground`}
		>
			<div class="w-full">
				<h1 class="font-bold">
					{event.title}
				</h1>
				<hr class="w-full" />
				<div class="flex flex-col gap-2">
					{#if store.activeEvent === event.id}
						{#each event.log as log}
							<div class="w-full text-wrap">
								<p class="text-balance text-sm">{log.message}</p>
								<p class="self-end text-xs text-muted-foreground">
									{new Date(log.timestamp).toLocaleString()}
								</p>
							</div>
						{/each}
					{:else if event.log.length > 0}
						<div class="w-full text-wrap">
							<p class="text-balance text-sm">{event.log.at(0)!.message}</p>
							<p class="self-end text-xs text-muted-foreground">
								{new Date(event.log.at(0)!.timestamp).toLocaleString()}
							</p>
						</div>
					{/if}
				</div>
			</div>
		</button>
	{/each}
</div>
