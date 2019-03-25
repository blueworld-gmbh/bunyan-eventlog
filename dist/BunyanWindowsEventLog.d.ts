export interface WindowsEventLogOptions {
    eventLog?: string;
    source?: string;
}
export default class WindowsEventLog {
    private options;
    private eventLog;
    constructor(opts?: WindowsEventLogOptions);
    /**
     * Function for parsing and storing raw log data in
     * Windows Event Log.
     *
     * The event ID defaults to 1000. A custom event
     * ID must be in the range of 1 - 1000.
     *
     * @param {Object} entry Raw Bunyan log data
     */
    write(entry: any): void;
}
