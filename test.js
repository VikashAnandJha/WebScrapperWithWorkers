const { sendToQueue } = require("./producer")
const extractUrls = require('./extracter');


const url = 'https://supremetechnologiesindia.com';
//https://supremetechnologiesindia.com/

sendToQueue(url, getBaseUrl(url));
// extractUrls(url)
//     .then(urls => {
//         console.log('Extracted URLs:', urls);
//         console.log('total Extracted URLs:', urls.length);
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });

function getBaseUrl(url) {
    const baseUrlRegex = /^(https?:\/\/[^/]+)/i;
    const matches = url.match(baseUrlRegex);
    if (matches && matches.length > 0) {
        return matches[0];
    }
    return null; // Unable to extract base URL
}
