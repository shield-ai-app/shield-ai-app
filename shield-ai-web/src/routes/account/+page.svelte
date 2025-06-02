<script lang="ts">
	import { enhance } from '$app/forms';
	import Loading from '$lib/components/Loading.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { toast } from 'svelte-sonner';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let loading = $state(false);
	let name = $state(data.user?.name || '');
	let email = $state(data.user?.email || '');
	let tel = $state(data.user?.tel || '');
	let notifyViaEmail = $state(data.user?.notify?.split(',').includes('email'));
	let notifyViaTel = $state(data.user?.notify?.split(',').includes('tel'));
</script>

<div class="flex h-full w-full flex-col items-center justify-center gap-4">
	<form
		class="flex w-1/3 flex-col gap-4"
		method="POST"
		use:enhance={() => {
			loading = true;
			return async ({ update, result }) => {
				loading = false;
				update({ reset: false });

				if (result.type === 'success') {
					toast('Success: Account Updated');
				}
			};
		}}
	>
		<h1 class="text-xl font-bold">Account Information</h1>
		<div class="">
			<Label for="name">Name:</Label>
			<Input name="name" type="text" bind:value={name} />
		</div>

		<div class="">
			<Label for="email">Email:</Label>
			<Input
				bind:value={email}
				name="email"
				type="email"
				placeholder="Get alerts and notifications via email"
			/>
		</div>

		<div class="">
			<Label for="tel">Phone Number:</Label>
			<Input
				bind:value={tel}
				name="tel"
				type="tel"
				placeholder="Get alerts and notifications via text"
			/>
		</div>

		<div class="flex flex-col gap-2">
			<h1 class="text-lg font-bold">Notify me via:</h1>
			<div class="flex items-center space-x-2 pl-2">
				<input
					hidden
					type="checkbox"
					name="notifyViaEmail"
					value={notifyViaEmail}
					checked={notifyViaEmail}
				/>
				<Checkbox
					name="notifyViaEmail"
					bind:checked={notifyViaEmail}
					id="notify-email"
					aria-labelledby="notify-email-label"
				/>
				<Label
					id="notify-email-label"
					for="notify-email"
					class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
				>
					Email
				</Label>
			</div>

			<div class="flex items-center space-x-2 pl-2">
				<input
					hidden
					type="checkbox"
					name="notifyViaTel"
					value={notifyViaTel}
					checked={notifyViaTel}
				/>
				<Checkbox bind:checked={notifyViaTel} id="notify-tel" aria-labelledby="notify-tel-label" />
				<Label
					id="notify-tel-label"
					for="notify-tel"
					class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
				>
					Text
				</Label>
			</div>
		</div>

		<Button type="submit" disabled={loading}>
			{#if loading}
				<Loading />
			{:else}
				Update
			{/if}
		</Button>
	</form>

	<hr class="w-1/2" />

	<div class="flex w-1/3 flex-col gap-1">
		<Button>Manage My Subscription</Button>
	</div>
</div>
