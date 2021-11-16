'use strict';

const puppeteer = require('puppeteer');
const fetch = require('node-fetch');
var fs = require('fs'),
    request = require('request');

// Browser and page instance
async function instance() {
    const browser = await puppeteer.launch({
        headless: true
    })

    const page = await browser.newPage()
    return { page, browser }
}

// Extract all imageLinks from the page
async function extractImageLinks() {
    const { page, browser } = await instance()

    // Get the page url from the user
    let baseURL = process.argv[2] ? process.argv[2] : "https"

    try {
        await page.setDefaultNavigationTimeout(0)
        // await page.goto(baseURL, { waitUntil: 'networkidle0' })
        await page.goto(baseURL, { waitUntil: 'networkidle0', timeout: 0 })
        await page.goto(baseURL);
        await page.waitForSelector('body')

        let imageLinks = await page.evaluate(() => {
            let imgTags = Array.from(document.querySelectorAll('img'))

            let imageArray = []

            imgTags.map((image) => {
                let src = image.src

                let srcArray = src.split('/')
                let pos = srcArray.length - 1
                let filename = srcArray[pos]

                imageArray.push({
                    src,
                    filename
                })
            })

            return imageArray
        })

        await browser.close()
        return imageLinks

    } catch (err) {
        console.log(err)
    }
}

(async function () {
    console.log("Downloading images...")

    let imageLinks = await extractImageLinks()

    imageLinks.map((image) => {
        let filename = `./img/${image.filename}`
        saveImageToDisk(image.src,filename, function () {
            console.log(image.src);
        });
    })

    console.log("Download complete, check the images folder")
})()

function saveImageToDisk(uri, filename, callback) {
    try {
        
        request.head(uri, function (err, res, body) {
            request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
        });
    } catch (error) {
        console.log('error pra salvar =)');
    }
}
