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
	public write(item: any): void {
		if (!item) return;

		let id = item["id"] || 1000;
		let msg = item["msg"];

		id = id > 1000 ? 1000 : id;

		// no string or number message, log the whole object
		if (!msg || msg.length <= 0) {
			msg = JSON.stringify(item, null, 4);
		}

		if (item["level"] <= 30) {
			this.eventLog.info(msg, id);
		} else if (item["level"] == 40) {
			this.eventLog.warn(msg, id);
		} else {
			this.eventLog.error(msg, id);
		}
	}
}
