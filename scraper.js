const puppeteer = require("puppeteer")
const excel = require("./excel")

const scrape = async () => {
    let data = []

    const browser = await puppeteer.launch({
        headless: "new",
        // headless: false,
        defaultViewport: false
    })

    const page = await browser.newPage();
    await page.goto("https://quotes.toscrape.com/", {
        waitUntil: "domcontentloaded"
    })

    let stop = false;

    while (!stop) {
        const targets = await page.$$("div.quote")
        for (const target of targets) {
            try {
                // get authors
                let authors = await target.$eval("small.author", el => el.textContent)

                // get quotes
                let quotes = await target.$eval("span.text", el => el.textContent)

                // get tags
                let tags = await target.$eval("meta.keywords", el => el.getAttribute("content"))

                // get link to author detail page
                let linkAuthors = await target.$eval("div.quote > span > a", el => "https://quotes.toscrape.com" + el.getAttribute("href"))

                // open link to author detail page
                let newPage = await browser.newPage();
                await newPage.goto(linkAuthors, {
                    waitUntil: "domcontentloaded"
                })

                // get author's born date
                let authorBornDate = await newPage.$eval("span.author-born-date", el => el.textContent)

                // get author's born location
                let getAuthorBornLoc = await newPage.$eval("span.author-born-location", el => el.textContent)
                let splitAuthorBornLoc = getAuthorBornLoc.split(" ")
                let authorBornLoc = ""
                let i = 1;
                while (splitAuthorBornLoc[i]) {
                    authorBornLoc += splitAuthorBornLoc[i] + " "
                    i++
                }
                newPage.close()

                let quoteData = {
                    quotes,
                    tags,
                    authors,
                    authorBornDate,
                    authorBornLoc,
                    linkAuthors
                }

                data.push(quoteData)
            } catch (error) {
                console.log(error);
            }
        }
        // find is there next page in this page
        // if yes click it
        // if no just stop the loop
        let pagination = await page.$("li.next", el => !!el)
        if (pagination == null) {
            stop = true
        } else {
            await page.click("ul.pager > li.next > a")
        }
    }
    browser.close()
    await excel.makeExcel(data)
}

scrape()