const axios = require('axios');
const cheerio = require('cheerio');
const urlModule = require('url');

async function extractUrls(targetUrl, primaryDomain) {
    let baseURL = primaryDomain;
    try {
        // Axios configuration with Chrome user agent
        const axiosConfig = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36'
            }
        };

        // Fetch the webpage content with axios configuration
        const response = await axios.get(targetUrl, axiosConfig);
        const html = response.data;

        // Load the HTML content into Cheerio
        const $ = cheerio.load(html, { normalizeWhitespace: true });

        // Extract URLs from anchor tags
        const urls = [];
        $('a').each((index, element) => {
            const href = $(element).attr('href');
            if (href && href.trim() !== '') {
                let absoluteUrl;
                if (href.startsWith('http')) {
                    // If it's an absolute URL, use it as is
                    absoluteUrl = href;
                } else if (href.startsWith('/')) {
                    // If it's a root-relative URL, append it to the primary domain
                    absoluteUrl = urlModule.resolve(baseURL, href);
                } else {
                    // Otherwise, it's a relative URL, resolve it against the base URL
                    const currentPath = urlModule.parse(targetUrl).pathname;
                    const currentDir = currentPath.substring(0, currentPath.lastIndexOf('/'));
                    const relativeUrl = urlModule.resolve(currentDir, href);
                    absoluteUrl = urlModule.resolve(baseURL, relativeUrl);
                }

                // Check if the URL is not a media URL
                if (!isMediaUrl(absoluteUrl)) {
                    urls.push(absoluteUrl);
                }
            }
        });

        // Remove duplicates from the URLs
        const uniqueUrls = removeDuplicates(urls);
        return uniqueUrls;
    } catch (error) {
        console.error('Error extracting URLs:', error);
        return [];
    }
}

function removeDuplicates(urls) {
    return [...new Set(urls)];
}

function isMediaUrl(urlPath) {
    if (!urlPath) {
        return false;
    }
    const parts = urlPath.split('.');
    if (parts.length === 1) {
        return false;
    }
    const extension = parts.pop();
    return ['.pdf', '.jpg', '.jpeg', '.png', '.gif', '.mp4', '.avi', '.mov'].includes(`.${extension}`);
}

module.exports = extractUrls;
