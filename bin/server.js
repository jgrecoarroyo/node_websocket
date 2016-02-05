var http = require('http');

// Create simple server
var server = http.createServer(function(request, response) {});
var port = 3333;
server.listen(port, function() {
    console.log((new Date()) + ' Server is listening on port ' + port);
});

// Create web socker server
var WebSocketServer = require('websocket').server;
wsServer = new WebSocketServer({
    httpServer: server
});

// Variables to store connected clients
var count = 0;
var clients = {};

// Listen for connections
wsServer.on('request', function(r){

    // Accept connection
    var connection = r.accept('echo-protocol', r.origin);

    // Specific id for this client & increment count
    var id = count++;
    // Store the connection method so we can loop through & contact all clients
    clients[id] = connection

    // Create event listener
    connection.on('message', function(message) {

        // The string message that was sent to us
        var msgString = message.utf8Data;
        console.log("client: " + id +  " sent: " + msgString);

        // Loop through all clients
        for(var i in clients){
            // Send a message to the client with the message
            clients[i].sendUTF(msgString);
        }

    });

    // On client disconnection
    connection.on('close', function(reasonCode, description) {
        delete clients[id];
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });

});
