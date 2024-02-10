var amqp = require('amqplib/callback_api');

var connection; // Variable to hold the connection

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

function sendToQueue(msg) {
    var queue = 'hello';
    initializeConnection(function (conn) {
        conn.createChannel(function (error1, channel) {
            if (error1) {
                throw error1;
            }
            channel.assertQueue(queue, {
                durable: false
            });
            channel.sendToQueue(queue, Buffer.from(msg));
            console.log(" [x] Sent %s", msg);
        });
    });
}

module.exports = { sendToQueue };
