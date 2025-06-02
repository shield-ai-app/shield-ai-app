export enum EventTypeT {
	ALERT,
	REPORT,
	INFO
}

export type EventLogT = {
	timestamp: number;
	message: string;
};

export type EventT = {
	id: string;
	lat: number;
	lon: number;
	type: EventTypeT;
	title: string;
	log: EventLogT[];
};
