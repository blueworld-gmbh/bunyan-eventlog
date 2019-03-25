# Windows Event Log stream for Bunyan

A simple Windows Event Log stream for Bunyan.

## Installation

```sh
npm install bunyan-eventlog
```

## Basic Usage

```js
var bunyan = require("bunyan");
var EventLog = require("bunyan-eventlog");

var _systemLogger = {
	src: false,
	name: "systemLogger",
	serializers: bunyan.stdSerializers,
	streams: [
		{
			level: "info",
			stream: new EventLog()
		}
	]
};

var logger = bunyan.createLogger(_systemLogger);

logger.info(
	{
		id: 999
	},
	"bunyan-eventlog test successful"
);
```

## Options

By default, `bunyan-eventlog` writes to the _APPLICATION_ log, with a source of _bunyan-eventLog_.

When configuring the `bunyan-eventlog` stream, there are two options that control what data is included in your event log message: _exclude_ and _showExclude_. By default, a Bunyan message contains a fair amount of additional data, beyond your message. Using the `test.js` script, Bunyan generates a message with the following information:

```
{
  "name": "systemLogger",
  "hostname": "myHostname",
  "pid": 18848,
  "level": 30,
  "id": 999,
  "showExclude": true,
  "exclude": [
    "time",
    "v"
  ],
  "msg": "bunyan-eventLog test successful",
  "time": "2018-05-14T20:24:19.435Z",
  "v": 0
}
```

You have the option of excluding any or all of the fields from the output message by adding _exclude_ to either the logger definition, or at the time of generating the log message.

To make the change to the logger at a global level, you would do something like this (note the `new bunyanEventLog` line):

```js
var _systemLogger = {
	src: false,
	name: "systemLogger",
	serializers: bunyan.stdSerializers,
	streams: [
		{
			level: "info",
			stream: new bunyanEventLog({ exclude: "all" })
		}
	]
};
```

If you do not want to exclude all of the items, you can exclude specific items by using _exclude_ as an array, listing the fields to exclude from the final message:

```js
var _systemLogger = {
	src: false,
	name: "systemLogger",
	serializers: bunyan.stdSerializers,
	streams: [
		{
			level: "info",
			stream: new bunyanEventLog({ exclude: ["time", "v"] })
		}
	]
};
```

This can also be performed at the time of logging an event:

```js
logger.info(
	{
		id: 999,
		exclude: "all"
	},
	"bunyan-eventlog test successful"
);
```

or...

```js
logger.info(
	{
		id: 999,
		exclude: ["time", "v"]
	},
	"bunyan-eventlog test successful"
);
```

You also have the option of showing the exclusion list by passing `showExclude: true` to either the initial logger definition, or to the logged event.

Any items not excluded are combined using a semi-colon separated `join()` and appended to the log message. Again, using the `test.js` script, the resulting event log message would look like this:

`bunyan-eventLog test successful -- name: systemLogger; hostname: myHostname; pid: 18848; level: 30; id: 999; showExclude: true; exclude: time,v; msg: bunyan-eventLog test successful`

### Note

All of the usual event log message rules apply. For example, the event ID must be between 1 - 1000.
