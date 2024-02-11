const extractUrls = require('./extracter');
const amqp = require('amqplib/callback_api');
const { sendToQueue } = require("./producer");
const fs = require('fs');
const url = require('url');
const URL = require('./db/Schema')
const connect = require('./db/conn')



let exploredSet = new Set();
let isProcessing = false;



connect("mongodb+srv://vikashjha:jhajha22@brollet.168kf.mongodb.net/testUnmiss").then(() => {
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

})
async function processURL(url, channel, primaryDomain) {

    console.log("going to process", url);

    let found = await URL.findOne({ url })
    if (found != null) return;
    //if (exploredSet.has(url)) return;
    console.log("going to extract", url);
    // exploredSet.add(url);
    try {
        await new URL({ url: url }).save();
        //saveUrls(url, primaryDomain)
        isProcessing = true;

        const urls = await extractUrls(url, primaryDomain);
        /// console.log(urls)
        const filteredUrls = urls.filter(u => u.includes(primaryDomain));
        // console.log(filteredUrls)
        for (let i = 0; i < filteredUrls.length; i++) {
            //  console.log("primaryDomain", primaryDomain);
            sendToQueue(filteredUrls[i], primaryDomain);
        }
        /// console.log('Total Unique Extracted URL:', exploredSet.size);
        // console.log('Total Unique Extracted URL:', exploredSet);
        isProcessing = false;


        //  console.log('URL saved successfully');
    } catch (error) {
        if (error.code === 11000) {
            console.error('Duplicate key error: URL already exists');
        } else {
            console.error('Error :', error.message);
        }
    }

}

function saveUrls(text, primaryDomain) {

    const url = new URL(primaryDomain);
    let filename = url.hostname;

    // File path where you want to write the text
    const filePath = "./data/" + filename + '_.txt';

    // Write the text to the file
    fs.writeFile(filePath, text + '\n', { flag: 'a+' }, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        } else {
            // console.log('Text has been written to file successfully.');
        }
    });
}
