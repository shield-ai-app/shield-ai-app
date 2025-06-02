<script lang="ts">
	import { CircleLayer, MapLibre, Marker, GeoJSON } from 'svelte-maplibre';
	import Geolocation from 'svelte-geolocation';
	import type {
		GeolocationCoords,
		GeolocationError
	} from 'svelte-geolocation/types/Geolocation.svelte';
	import { mapStyle } from './map_style';
	import { EventTypeT, type EventT } from '$lib/types';
	import { store } from '$lib/stores.svelte';
	import Loading from '../Loading.svelte';

	export let events: EventT[] = [];
	let coords: GeolocationCoords = [100, 100];
	let loading = false;
	let error: GeolocationError = false;
	let notSupported = false;

	if (error) {
		let positionError = error as GeolocationPositionError;
		console.error(positionError);
	}

	function eventTypeToRingColor(e: EventTypeT): string {
		switch (e) {
			case EventTypeT.REPORT:
				return 'rgb(239 68 68)';
			case EventTypeT.ALERT:
				return 'rgb(234 179 8)';
			case EventTypeT.INFO:
				return 'rgb(239 231 235)';
		}
	}

	function eventTypeToMarkerColor(e: EventTypeT): string {
		switch (e) {
			case EventTypeT.REPORT:
				return 'bg-red-500';
			case EventTypeT.ALERT:
				return 'bg-yellow-500';
			case EventTypeT.INFO:
				return 'bg-grey-200';
		}
	}
</script>

<Geolocation
	options={{
		enableHighAccuracy: false,
		timeout: 5000,
		maximumAge: 300000 // 5 mins
	}}
	getPosition
	bind:coords
	bind:loading
	bind:error
	bind:notSupported
/>

{#if loading}
	<Loading />
{:else if error}
	<h1>{JSON.stringify(error)}</h1>
{:else if notSupported}
	<h1>Not supported</h1>
{:else}
	<MapLibre
		bind:map={store.map}
		center={coords}
		zoom={9}
		class="h-full"
		style={mapStyle}
		standardControls
	>
		<GeoJSON
			id="user-location-ring"
			data={{
				type: 'FeatureCollection',
				features: [
					{
						properties: {},
						type: 'Feature',
						geometry: {
							type: 'Point',
							coordinates: coords
						}
					}
				]
			}}
		/>
		<CircleLayer
			source="user-location-ring"
			paint={{
				'circle-color': 'rgb(59 130 246)',
				'circle-radius': [
					'interpolate',
					['exponential', 2],
					['zoom'],
					0,
					0,
					20,
					30000 // two miles ish
				],
				'circle-stroke-width': 2,
				'circle-stroke-color': '#fff',
				'circle-opacity': 0.5
			}}
		>
			<Marker
				lngLat={coords}
				class="grid h-4 w-4 place-items-center rounded-full border border-gray-200 bg-blue-500 text-black shadow-2xl focus:outline-2 focus:outline-black"
			/>
		</CircleLayer>

		{#each events as event}
			<GeoJSON
				id={`${event.id}-location-ring`}
				data={{
					type: 'FeatureCollection',
					features: [
						{
							properties: {},
							type: 'Feature',
							geometry: {
								type: 'Point',
								coordinates: [event.lat, event.lon]
							}
						}
					]
				}}
			/>
			<CircleLayer
				on:click={() => {
					store.activeEvent = event.id;
					store.map?.flyTo({
						center: [event.lat, event.lon],
						zoom: 13, // Adjust the zoom level as needed
						speed: 1.2 // Optional: Animation speed
					});
				}}
				source={`${event.id}-location-ring`}
				paint={{
					'circle-color': eventTypeToRingColor(event.type),
					'circle-radius': [
						'interpolate',
						['exponential', 2],
						['zoom'],
						0,
						0,
						20,
						30000 // two miles ish
					],
					'circle-stroke-width': 2,
					'circle-stroke-color': '#fff',
					'circle-opacity': 0.2
				}}
			>
				<Marker
					lngLat={[event.lat, event.lon]}
					class={`grid h-4 w-4 place-items-center rounded-full border border-gray-200 ${eventTypeToMarkerColor(event.type)} text-black shadow-2xl focus:outline-2 focus:outline-black`}
				/>
			</CircleLayer>
		{/each}
	</MapLibre>
{/if}
