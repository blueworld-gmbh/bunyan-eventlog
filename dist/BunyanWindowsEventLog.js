"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_windows_1 = require("node-windows");
var defaultOpts = {
    eventLog: "APPLICATION",
    source: "bunyan-windows-eventlog"
};
var WindowsEventLog = /** @class */ (function () {
    function WindowsEventLog(opts) {
        this.options = __assign({}, defaultOpts, opts);
        // init a new windows event logger
        this.eventLog = new node_windows_1.EventLogger({
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
    WindowsEventLog.prototype.write = function (item) {
        if (!item)
            return;
        if (typeof item === "string") {
            item = JSON.parse(item);
        }
        var id = item["id"] || 1000;
        var msg = item["msg"];
        var level = item["level"];
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
            delete item["src"];
            // stringify the remaining object, which contains just the object
            // values that should be logged
            msg = JSON.stringify(item, this.getCircularReplacer());
        }
        if (level <= 30) {
            this.eventLog.info(msg, id);
        }
        else if (level == 40) {
            this.eventLog.warn(msg, id);
        }
        else {
            this.eventLog.error(msg, id);
        }
    };
    /**
     * Return a new circular replacer for using within json stringify
     * this helps stringify circular json structures
     */
    WindowsEventLog.prototype.getCircularReplacer = function () {
        var seen = new WeakSet();
        return function (key, value) {
            if (typeof value === "object" && value !== null) {
                if (seen.has(value)) {
                    return;
                }
                seen.add(value);
            }
            return value;
        };
    };
    return WindowsEventLog;
}());
exports.default = WindowsEventLog;
