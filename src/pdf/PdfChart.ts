import {
    getChartOptions
} from './chart/graphOptions'

const fs = require('fs');
const puppeteer = require('puppeteer');

export async function generateChartImg(){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const { staticOptions, dynamicOptions } = getChartOptions();

    const staticOptionsJson = JSON.stringify(staticOptions);
    const dynamicOptionsJson = JSON.stringify(dynamicOptions);

    const html = `
        <html>
        <head>
            <script src="https://code.highcharts.com/highcharts.js"></script>
        </head>
        <body>
            <div id="container"></div>
            <script>
            const staticOptions = ${staticOptionsJson};
            const dynamicOptions = ${dynamicOptionsJson};

            // Combine static and dynamic options
            const options = Object.assign({}, staticOptions, dynamicOptions);

            Highcharts.chart('container', options);
            </script>
        </body>
        </html>
    `;

    // Set the HTML content of the page
    await page.setContent(html);

    // Wait for the chart to be created
    // await page.waitForSelector('#container svg');
    await page.waitForTimeout(2000);

    // Take a screenshot of the chart
    const chartImage = await page.screenshot({
        clip: {
            x: 0,
            y: 0,
            width: 800,
            height: 400
        },
        encoding: 'base64' // this will return base64 string
    });
 
    fs.writeFileSync('chart.png', chartImage);

    // Clean up: close the browser
    await browser.close();

    return chartImage;
}