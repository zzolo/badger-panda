/**
 * @fileoverview Main server for Badger v Panda
 */
 
// Set paths for easier requires
require.paths.unshift(
    __dirname + '/lib',
    __dirname
);

// Get local settings.
var settings = require('settings');

// Requires libraries
var io = require('socket.io');
var connect = require('connect');
var express = require('express');
var cradle = require('cradle');
var port = 8080;

// Create express-based server and configure
var app = express.createServer();
app.configure(function() {
    app.set('view engine', 'ejs');
    app.set('view options', { layout: false });
    app.use(express.static('static'));
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({'secret': 'this-is-a-non-secure-secret'}));
    app.use(app.router);
});

// Set up the database connection
var conn = new (cradle.Connection)(settings.db.host, settings.db.port, {
    auth: { username: settings.db.user, password: settings.db.pass }
});
var db = conn.database('votes');

// Socket starting
var socket = io.listen(app);
socket.on('connection', function(client) {

    // Handle messages
    client.on('message', function(message) {
        // Check action
        if (message.action) {
        
            // Count vote here
            if (message.action == 'save-vote') {
                db.save(message, function (err, res) {
                    if (err) {
                        console.error(err);
                        client.send({'error': err});
                    } else {
                        client.emit(res);
                    }
                });
            }
            
            // Get count
            if (message.action == 'get-counts') {
                var message = {};
                db.view('badger-votes/badger-votes', function (err, res) {
                    if (err) {
                        console.error(err);
                        client.send(err);
                    }
                    else {
                        message.badgers = res.length;
                        db.view('panda-votes/panda-votes', function (err, res) {
                            if (err) {
                                console.error(err);
                                client.send(err);
                            }
                            else {
                                message.pandas = res.length;
                                
                                // TODO: Send out to all clients
                                client.send(message);
                            }
                        });
                    }
                });
            }
        }
    }); 
    client.on('disconnect', function() { });
});
console.log('Server side socket started.');

// This is a one page site.
app.get('/', function(req, res) {
    var context = {};
    if (req.connection.remoteAddress) {
        context.ip = req.connection.remoteAddress;
    }
    res.render('index.ejs', context);
});

// Start server
app.listen(port);
console.log('Server started on port: ' + port);
exports.app = app;