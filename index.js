const puppeteer = require('puppeteer');
const express = require('express');
const app = express();
const port = 3000;

app.listen(port);
app.get('/', async function (req, res) {
    const ipCliente = req.connection.remoteAddress;

    if(!ipCliente.match(/10.*|189\.38.*|177\.12.*|187\.1.*|177\.185.*|191\.6.*/)){
        res.send('Solicitação não permitida! ' + ipCliente);
        return;
    }
    const retornoScreenshot = await takeScreenshot(req.query.url, req.query.width, req.query.height, req.query.timeout);
    res.send(retornoScreenshot);
})

console.log('Aplicação disponivel na porta ' + port);

async function takeScreenshot(url, largura = 1920, altura = 1080, timeout = 30000) {
    try {
        const path = 'example.png';

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setViewport({
            width: parseInt(largura),
            height: parseInt(altura)
        })
        await page.setDefaultTimeout(timeout)
        await page.goto(url);
        await page.screenshot({
            path
        });
        await browser.close();

        return path;
    }catch(e) {
        return 'Erro: ' + e;
    }
}