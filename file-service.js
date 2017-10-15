/*
* Module dependencies.
*/
let express = require('express'),
    bodyParser = require('body-parser'),
    yaml = require('yamljs'),
    config = yaml.load('./config.yaml'),
    routes = require('./routes/index'),
    fs = require('fs'),
    http = require('http'),
    util = require('util')
    , path = require('path');
let app = express();

/*
 * connect middleware - please note not all the following are needed for the specifics of this example but are generally used.
 */
// app.use(bodyParser({keepExtensions: true, uploadDir: __dirname + '/public/uploads'}));
// app.use(express.static(path.join(__dirname, '/public')));
// app.use(express.static(__dirname + '/static'));
// app.use(express.errorHandler());
app.disable('x-powered-by');

switch (process.env.ENV) {
    case 'development':
        break;
    case 'production':
        console.error('Wait, no production yet');
        process.exit();
        break;
    default:
        console.error('[ERROR] No ENV Specified: development or production')
        process.exit();
        break
}

app.use((req, res, next) => {
    req.env = process.env;
    next()
});


app.use(config.middleurl, routes);
app.set('port', process.env.PORT || config.port);
const server = http.createServer(app);
//app.io.attach(server);
server.listen(app.get('port'), () => {
    const env = process.env.NODE_ENV || "development";
    const dburl = 'mariadb://' + config[env].username + '@' + config[env].host + '/' + config[env].database
    console.log('[DB] connected', dburl);
    console.log('[NODE] service listening on port', app.get('port'))
})
