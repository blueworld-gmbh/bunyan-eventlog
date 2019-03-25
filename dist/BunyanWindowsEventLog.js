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
     * @param {Object} entry Raw Bunyan log data
     */
    WindowsEventLog.prototype.write = function (item) {
        if (!item)
            return;
        var id = item["id"] || 1000;
        var msg = item["msg"];
        id = id > 1000 ? 1000 : id;
        // no string or number message, log the whole object
        if (!msg || msg.length <= 0) {
            msg = JSON.stringify(item, null, 4);
        }
        if (item["level"] <= 30) {
            this.eventLog.info(msg, id);
        }
        else if (item["level"] == 40) {
            this.eventLog.warn(msg, id);
        }
        else {
            this.eventLog.error(msg, id);
        }
    };
    return WindowsEventLog;
}());
exports.default = WindowsEventLog;
