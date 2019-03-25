# Windows Event Log stream for Bunyan

A simple Windows Event Log stream for Bunyan.

## Installation

```sh
npm install @blueworld/bunyan-windows-eventlog
```

## Basic Usage

```js
var bunyan = require("bunyan");
var EventLog = require("@blueworld/bunyan-windows-eventlog");

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

### Note

All of the usual event log message rules apply. For example, the event ID must be between 1 - 1000.
