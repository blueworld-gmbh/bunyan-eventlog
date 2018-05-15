var bunyan = require( 'bunyan' );
var bunyanEventLog = require( 'bunyan-eventlog' );
var _systemLogger = {
    'src': false,
    'name': 'systemLogger',
    'serializers': bunyan.stdSerializers,
    'streams': [ {
        'level': 'info',
        'stream': new bunyanEventLog()
    } ]
}

var logger = bunyan.createLogger( _systemLogger );

logger.info( {
    'id': 999,
    'showExclude': true,
    'exclude': [ 'time', 'v' ]
}, 'bunyan-eventLog test successful' );

