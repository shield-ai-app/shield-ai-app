class Store {
	map: maplibregl.Map | undefined = $state(undefined);
	activeEvent: string | undefined = $state(undefined);
}

const store = new Store();

export { store };
