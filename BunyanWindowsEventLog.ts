import { EventLogger } from "node-windows";

export interface WindowsEventLogOptions {
	eventLog?: string;
	source?: string;
}

const defaultOpts: WindowsEventLogOptions = {
	eventLog: "APPLICATION",
	source: "bunyan-windows-eventlog"
};

export default class WindowsEventLog {
	private options: WindowsEventLogOptions;
	private eventLog: EventLogger;

	public constructor(opts?: WindowsEventLogOptions) {
		this.options = { ...defaultOpts, ...opts };

		// init a new windows event logger
		this.eventLog = new EventLogger({
			source: this.options.source,
			eventLog: this.options.eventLog
		});
	}

	/**
	 * Function for parsing and storing raw log data in
	 * Windows Event Log.
	 *
	 * The event ID defaults to 1000. A custom event
	 * ID must be in the range of 1 - 1000.
	 *
	 * @param {Object} entry Raw Bunyan log data
	 */
	public write(entry: any): void {
		const item = JSON.parse(entry);

		let id = item["id"] || 1000;
		const msg = item["msg"];

		id = id > 1000 ? 1000 : id;

		if (item["level"] <= 30) {
			this.eventLog.info(msg, id);
		} else if (item["level"] == 40) {
			this.eventLog.warn(msg, id);
		} else {
			this.eventLog.error(msg, id);
		}
	}
}
