/**
 * @fileOverview Bunyan stream for Windows Event Logs
 * @author Kurt Kincaid
 * @version 1.0.1
 */

const cp = require( 'child_process' );

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
    this.exclude = opts.exclude || [];
    this.showExclude = opts.showExclude || false;
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
    var lvl = item[ 'level' ];
    var msg = item[ 'msg' ];
    var showExclude = item[ 'showExclude' ] || this.showExclude;
    if ( this.exclude ) {
        if ( this.exclude === 'all' || item[ 'exclude' ] === 'all' ) {
            item = {};
        }
        else {
            for ( var i in this.exclude ) {
                delete item[ this.exclude[ i ] ];
            }
            for ( var i in item[ 'exclude' ] ) {
                delete item[ item[ 'exclude' ][ i ] ];
            }
        }
    }
    if ( ! showExclude ) {
        delete item[ 'exclude' ];
    }
    console.log( JSON.stringify( item, null, 2 ) );
    var arr = [];
    if ( item ) {
        for ( var i in item ) {
            arr.push( `${i}: ${item[i]}` );
        }
    }
    var msg2 = arr.join( '; ' );
    if ( msg2 ) {
        msg += ` -- ${msg2}`;
    }
    id = id > 1000 ? 1000 : id;
    var level;
    if ( lvl <= 30 ) {
        level = 'INFORMATION';
    }
    else if ( lvl == 40 ) {
        level = 'WARNING';
    }
    else {
        level = 'ERROR';
    }
    var cmdString = `eventcreate /so "${this.source}" /t ${level} /id ${id} /l ${this.eventLog} /d "${msg}"`;
//    console.log( cmdString );
//    return null;
    cp.exec( cmdString, ( error, stdout, stderr ) => {
        if ( error ) {
            console.error( `Error executing eventcreate command: ${error}` );
            return;
        }
    } );
};

module.exports = bunyanEventLog;
