const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    await page.goto('');
    const imgList = await page.evaluate( () => {
        // toda essa funcao será executada no browser
        // vamos pegar todas as imagens que estao na parte de posts
        const nodeList = document.querySelectorAll('article img')
        // transformar em nodelist em array
        const imgArray = [...nodeList]
        // transformar os nodes ( elementos html ) em objetos JS
        const imgList = imgArray.map( ({src}) => ({src}))

        return imgList
    })
    console.log(imgList);
    // await browser.close();
})();