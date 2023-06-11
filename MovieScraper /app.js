const express = require('express');
const app = express();
const path = require('path');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

let browser;

app.set('views',path.join(__dirname, 'views'));
app.set('view engine','ejs');
app.use(express.static('public'));

async function scrapeData(url, page){
    try{

        await page.goto(url, {waitUntil: 'load', timeout: 0});
        const html = await page.evaluate(()=>document.body.innerHTML);
        const $ = await cheerio.load(html);

        let title = $("h2").text()
        let releaseDate = $(".release_date").text()
        let overview = $(".overwiev > p").text
        let userScore = $(".user_score_chart").attr("data-percent")
        let imgUrl = $("#main > section > div.header.large.border.first.lazyloaded > div > div > section > div.poster > div.image_content > a > img").attr("src")

        imgUrl = imgUrl.replace('_filter(blur)', '');

        let crewLength = $("div.header_info > ol > li").length;

        let crew = []

        for(i=1;i<=crewLength;i++){
            let name = $("div.header_info > ol > li:nth-child("+i+") > p:nth-child(1)").text();
            let role = $("div.header_info > ol > li:nth-child("+i+") > p.character").text();

            crew.push({
                "name" : name,
                "role" : role
            })
        }

        browser.close()

        return{
            title,
            releaseDate,
            overwiw,
            userScore,
            imUrl,
            crew
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

app.get('/results', async (req,res)=>{
    let url = req.query.search
    browser = await puppeteer.launch({headless: true});
    const page = await browser.newpage();
    let data = await scrapeData(url,page);
    res.render('results', {data: data})
})

app.get('/search',(req,res)=>{
    res.render('search')
})

app.listen(3000,()=>{
    console.log('server started')
});


