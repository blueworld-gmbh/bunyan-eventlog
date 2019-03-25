const bunyan = require("bunyan");
const bunyanEventLog = require("bunyan-eventlog");

const _systemLogger = {
	src: false,
	name: "systemLogger",
	serializers: bunyan.stdSerializers,
	streams: [
		{
			level: "info",
			stream: new bunyanEventLog()
		}
	]
};

const logger = bunyan.createLogger(_systemLogger);

logger.info(
	{
		id: 999,
		showExclude: true,
		exclude: ["time", "v"]
	},
	"bunyan-eventLog test successful"
);
