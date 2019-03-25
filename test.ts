import bunyan from "bunyan";
import WindowsEventLog from "./BunyanWindowsEventLog";

const systemLogger = {
	src: false,
	name: "systemLogger",
	serializers: bunyan.stdSerializers,
	streams: [
		{
			stream: new WindowsEventLog()
		}
	]
};

const logger = bunyan.createLogger(systemLogger);

logger.info(
	{
		id: 999
	},
	"bunyan-eventLog test successful"
);

const test = {
	hi: "ho",
	foo: ["bar"]
};

logger.warn(test);
