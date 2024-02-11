var amqp = require('amqplib/callback_api');

var connection; // Variable to hold the connection
var channel; // Variable to hold the channel

// Function to initialize connection if not already initialized
function initializeConnection(callback) {
    if (connection) {
        callback(connection);
    } else {
        amqp.connect('amqp://localhost', function (error0, conn) {
            if (error0) {
                throw error0;
            }
            connection = conn; // Store the connection
            callback(connection);
        });
    }
}

// Function to initialize channel if not already initialized
function initializeChannel(callback) {
    if (channel) {
        callback(channel);
    } else {
        initializeConnection(function (conn) {
            conn.createChannel(function (error1, ch) {
                if (error1) {
                    throw error1;
                }
                channel = ch; // Store the channel
                callback(channel);
            });
        });
    }
}

function sendToQueue(msg, primaryDomain) {
    var queue = 'web';
    initializeChannel(function (ch) {
        ch.assertQueue(queue, {
            durable: false
        });

        let data = JSON.stringify({ url: msg, primaryDomain });
        ch.sendToQueue(queue, Buffer.from(data));
        console.log(" [x] Sent %s", msg);
    });
}

module.exports = { sendToQueue };
