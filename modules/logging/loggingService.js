const moment = require('moment');



const log = (apiReference, log) => {
    if (apiReference && apiReference.module && apiReference.api) {
        try {
            log = JSON.stringify(log);
        } catch (exception) {
        }
        console.log("-->" + moment(new Date()).format('YYYY-MM-DD hh:mm:ss.SSS') + " :----: " +
            apiReference.module + " :=: " + apiReference.api + " :=: " + log);
    }
}


exports.log = log;