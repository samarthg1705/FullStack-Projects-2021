const express = require('express');
const app = express();
const path = require('path');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

app.set('view',path.join(__dirname,'views'));
app.set('view engine','ejs');

async function scrapeData(url, page){
    try{
        await page.goto(url, {waitUntil: 'load', timeout: 0});
        const html = await page.evaluate(()=>document.body.innerHTML);
        const $ = cheerio.load(html);

        let title = $("#firstHeading").text();
        let description = $("#mw-content-text > div > p:nth-child(4)");
        return{
            title,
            description
        }

    }catch(error){
        console.log(error);
    }
}
async function getResults(){
    browser = await puppeteer.launch({headless: true});
    const page = await browser.newpage();

    let data = await scrapeData('https://en.wikipedia.org/wiki/Web_scraping',page);
    console.log(data.title);
    console.log(data.description);
    browser.close();
}
getResults()