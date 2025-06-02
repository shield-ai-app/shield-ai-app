<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { SignIn, SignOut } from '@auth/sveltekit/components';
	import * as Avatar from '$lib/components/ui/avatar';

	import type { Session } from '@auth/sveltekit';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { BellDotIcon, BellIcon } from 'lucide-svelte';

	export let session: Session | null | undefined;
	let hasNotifications = false;
</script>

<nav class="flex w-full flex-row items-center justify-between border-b border-b-accent px-4 py-4">
	<a class="flex h-full flex-row items-center justify-center gap-2" href="/">
		<img src="/assets/logos/logo.png" alt="logo" class="h-12 w-12 rounded" />
		<p class="text-center text-3xl text-foreground">Shield AI</p>
	</a>

	<div class="flex flex-row items-center gap-2">
		{#if !session}
			<Button>
				<SignIn signInPage="signin">
					<div slot="submitButton">Sign in</div>
				</SignIn>
			</Button>
		{:else}
			<div class="flex flex-row items-center justify-center gap-4">
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#if hasNotifications}
							<BellIcon size={16} />
						{:else}
							<BellDotIcon size={16} />
						{/if}
					</DropdownMenu.Trigger>

					<DropdownMenu.Content>
						{#if hasNotifications}{:else}
							<DropdownMenu.Label class="text-muted-foreground">
								You have no notifications at this time
							</DropdownMenu.Label>
						{/if}
					</DropdownMenu.Content>
				</DropdownMenu.Root>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						<Avatar.Root class="border-[1px] border-primary">
							<Avatar.Image src={session!.user!.image} alt="pfp"></Avatar.Image>
							<Avatar.Fallback>
								{session!.user!.name!.split(" ").reduce((prev, current) => prev + current.charAt(0), "").toUpperCase()}
							</Avatar.Fallback>
						</Avatar.Root>
					</DropdownMenu.Trigger>

					<DropdownMenu.Content>
						<DropdownMenu.Item href="/account">Account</DropdownMenu.Item>
						<DropdownMenu.Separator />
						<DropdownMenu.Item>
							<SignOut signoutPage="signout">Sign Out</SignOut>
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
		{/if}
	</div>
</nav>
