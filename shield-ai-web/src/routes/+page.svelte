<script lang="ts">
	import ShieldMap from '$lib/components/map/ShieldMap.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { type EventT, EventTypeT } from '$lib/types';

	const events: EventT[] = [
		{
			id: '0',
			lat: -122.09532,
			lon: 47.98401,
			type: EventTypeT.ALERT,
			title: 'Shooting',
			log: [
				{
					timestamp: 0,
					message: 'Shooting reported at 10117 13th st'
				},
				{
					timestamp: 0,
					message: 'Shooting reported at 10117 13th st'
				},
				{
					timestamp: 0,
					message: 'Shooting reported at 10117 13th st'
				}
			]
		},
		{
			id: '1',
			lat: -122.19532,
			lon: 47.98401,
			type: EventTypeT.REPORT,
			title: 'Vehicle Accident',
			log: [
				{
					timestamp: 0,
					message: 'Firefighters on scene'
				},
				{
					timestamp: 0,
					message: 'Vehicle crash reported'
				}
			]
		},
		{
			id: '2',
			lat: -121.98532,
			lon: 47.98401,
			type: EventTypeT.INFO,
			title: 'Suspicious Activity',
			log: [
				{
					timestamp: 0,
					message: 'Suspicious activity called in'
				}
			]
		}
	];
</script>

<div class="flex h-screen w-full flex-row">
	<div class="h-full w-2/3">
		<ShieldMap {events} />
	</div>

	<div class="w-1/3 border-l border-l-accent">
		<Sidebar {events} />
	</div>
</div>
