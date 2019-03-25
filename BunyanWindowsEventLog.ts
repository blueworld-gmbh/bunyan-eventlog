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
	 * @param {Object} item Raw Bunyan log data
	 */
	public write(item: any): void {
		if (!item) return;

		if (typeof item === "string") {
			item = JSON.parse(item);
		}

		let id: number = item["id"] || 1000;
		let msg: string = item["msg"];
		let level: number = item["level"];

		id = id > 1000 ? 1000 : id;

		// no string or number message, log the whole object
		if (!msg || msg.length <= 0) {
			// remove unused bunyan log entries
			// e.g. {"name":"systemLogger","hostname":"Thomas-PC","pid":10612,"level":40,"hi":"ho","foo":["bar"],"msg":"","time":"2019-03-25T17:15:01.994Z","v":0}\

			delete item["name"];
			delete item["hostname"];
			delete item["pid"];
			delete item["level"];
			delete item["msg"];
			delete item["time"];
			delete item["v"];

			console.log(typeof item);

			// stringify the remaining object, which contains just the object
			// values that should be logged
			msg = JSON.stringify(item, this.getCircularReplacer());
		}

		if (level <= 30) {
			this.eventLog.info(msg, id);
		} else if (level == 40) {
			this.eventLog.warn(msg, id);
		} else {
			this.eventLog.error(msg, id);
		}
	}

	/**
	 * Return a new circular replacer for using within json stringify
	 * this helps stringify circular json structures
	 */
	private getCircularReplacer() {
		const seen = new WeakSet();
		return (key, value) => {
			if (typeof value === "object" && value !== null) {
				if (seen.has(value)) {
					return;
				}
				seen.add(value);
			}
			return value;
		};
	}
}
