const logger = require('../log');
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function findAcceptLanguage(page) {
    await page.setBypassCSP(true)
    return await page.evaluate(async () => {
        const result = await fetch('https://httpbin.org/get')
            .then(res => res.json())
            .then(res => (res.headers['Accept-Language'] || res.headers['accept-language']))
            .catch(() => null)
        return result
    })
}

function getSource({url, proxy}) {
    return new Promise(async (resolve, reject) => {

        if (!url) return reject('Missing url parameter')
        const context = await global.browser.createBrowserContext().catch(() => null);
        if (!context) return reject('Failed to create browser context')

        let isResolved = false

        const {proxyRequest} = await import('puppeteer-proxy')

        var cl = setTimeout(async () => {
            if (!isResolved) {
                await context.close()
                reject("Timeout Error")
            }
        }, (global.timeOut || 60000))

        try {
            const page = await context.newPage();
            logger.info(">>>>>>>>>")
            await page.setRequestInterception(true);
            page.on('request', async (request) => {
                try {
                    if (proxy) {
                        logger.info(proxy)
                        await proxyRequest({
                            page,
                            proxyUrl: `http://${proxy.username ? `${proxy.username}:${proxy.password}@` : ""}${proxy.host}:${proxy.port}`,
                            request,
                        });
                    } else {
                        request.continue()
                    }
                } catch (e) {
                    logger.error(`>>>>>>>>>>>>>>> ${e}`)
                }
            });
            page.on('response', async (res) => {
                try {
                    logger.info(`${res.url()} :------> ${res.status()}`);
                    if ([200, 302].includes(res.status()) && [url, url + '/'].includes(res.url())) {
                        logger.info("===========>")
                        await page.waitForNavigation({waitUntil: 'load', timeout: 5000}).catch(() => {
                        });
                        const cookies = await page.cookies()
                        let headers = await res.request().headers()
                        delete headers['content-type']
                        delete headers['accept-encoding']
                        delete headers['accept']
                        delete headers['content-length']
                        headers["accept-language"] = await findAcceptLanguage(page)
                        await context.close()
                        isResolved = true
                        clearInterval(cl)
                        resolve({cookies, headers})
                    }
                } catch (e) {
                    logger.error(e)
                }
            })


            await page.goto(url, {
                waitUntil: 'domcontentloaded',
            })

        } catch (e) {
            logger.error(e)
            if (!isResolved) {
                await context.close()
                clearInterval(cl)
                reject(e.message)
            }
        }

    })
}

module.exports = getSource