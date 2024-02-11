const extractUrls = require('./extracter');
const amqp = require('amqplib/callback_api');
const { sendToQueue } = require("./producer");

let exploredSet = new Set();
let isProcessing = false;

amqp.connect('amqp://localhost', function (error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }
        var queue = 'web';

        channel.assertQueue(queue, {
            durable: false
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);


        channel.consume(queue, function (msg) {
            // console.log(" [x] Received %s", msg.content.toString());
            let data = JSON.parse(msg.content.toString());
            let url = data.url;
            let primaryDomain = data.primaryDomain;
            processURL(url, channel, primaryDomain);
            console.log(" [x] Received %s", url);



        }, {
            noAck: true
        });





    });
});

async function processURL(url, channel, primaryDomain) {


    if (exploredSet.has(url)) return;

    // console.log("going to extract", url);
    exploredSet.add(url);
    isProcessing = true;

    const urls = await extractUrls(url, primaryDomain);
    const filteredUrls = urls.filter(u => u.includes(primaryDomain)); // Filter URLs
    // console.log(filteredUrls)
    for (let i = 0; i < filteredUrls.length; i++) {
        //  console.log("primaryDomain", primaryDomain);
        sendToQueue(filteredUrls[i], primaryDomain);
    }
    console.log('Total Unique Extracted URL:', exploredSet.size);
    // console.log('Total Unique Extracted URL:', exploredSet);
    isProcessing = false;
}
