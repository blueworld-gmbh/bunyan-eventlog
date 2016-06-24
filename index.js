/**
 * @fileOverview Bunyan stream for Windows Event Logs
 * @author Kurt Kincaid
 * @version 0.1.0
 */

var evt = require( 'node-windows' ).EventLogger;

/**
 * Main module constructor
 * 
 * Without specifying any options, the event log 
 * defaults to 'APPLICATION' and the source defaults
 * to 'bunyan-eventLog'
 */
function bunyanEventLog( opts ) {
    opts = opts || {};
    this.eventLog = opts.eventLog || 'APPLICATION';
    this.source = opts.source || 'bunyan-eventLog';
    this._log = new evt( {
        'source': this.source,
        'eventLog': this.eventLog
    } );
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
bunyanEventLog.prototype.write = function( entry ) {
    var item = JSON.parse( entry );
    var id = item[ 'id' ] || 1000;
    var del = [ 'id', 'level', 'msg', 'eventLog' ];
    var lvl = item[ 'level' ];
    var msg = item[ 'msg' ];
    for ( var i in del ) {
        delete item[ del[ i ] ];
    }
    var arr = [];
    for ( var i in item ) {
        arr.push( `${i}: ${item[i]}` );
    }
    msg += ' -- ' + arr.join( ', ' );
    id = id > 1000 ? 1000 : id;
    if ( lvl <= 30 ) {
        this._log.info( msg, id );
    }
    else if ( lvl == 40 ) {
        this._log.warn( msg, id );
    }
    else {
        this._log.error( msg, id );
    }
};

module.exports = bunyanEventLog;
