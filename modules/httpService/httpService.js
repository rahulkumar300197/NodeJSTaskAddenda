const Promise = require('bluebird');
const http = require('http');


const startHttpServer = () => {
    return new Promise((resolve, reject) => {
        let server = http.createServer(app).listen(app.get('port'), () => {
            console.error("###################### Express connected ##################", app.get('port'), app.get('env'));
            resolve(server);
        });
    });
}


exports.startHttpServer = startHttpServer;