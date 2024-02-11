const { sendToQueue } = require("./producer")
const extractUrls = require('./extracter');

const URL = require('./db/Schema')
const connect = require('./db/conn')
// connect("mongodb+srv://vikashjha:jhajha22@brollet.168kf.mongodb.net/testUnmiss").then(() => {

//     URL.findOne({ url: "test.com" }).then((doc) => console.log(doc))

// })
const url = 'https://www.apple.com';
//https://supremetechnologiesindia.com/
let primaryDomain = getBaseUrl(url)
console.log(primaryDomain)
sendToQueue(url, primaryDomain);
// extractUrls(url, getBaseUrl(url))
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
function getDomainName(url) {
    // Remove protocol (http, https, ftp) and get the rest
    let domain = url.replace(/(^\w+:|^)\/\//, '');

    // Get domain name without path and query parameters
    domain = domain.split('/')[0];

    // Handle 'www' prefix if present
    domain = domain.replace(/^www\./, '');

    return domain;
}

