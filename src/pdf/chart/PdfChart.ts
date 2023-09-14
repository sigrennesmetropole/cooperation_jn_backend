import { getChartOptions } from './graphOptions'
import { type AutocalsolResult as AutocalsolResultType } from '../type/type'

import puppeteer from 'puppeteer'

export async function generateChartImg(data_autocalsol: AutocalsolResultType) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox'],
  })
  const page = await browser.newPage()

  const { staticOptions, dynamicOptions } = getChartOptions(data_autocalsol)

  const staticOptionsJson = JSON.stringify(staticOptions)
  const dynamicOptionsJson = JSON.stringify(dynamicOptions)

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
    `
  // Set the HTML content of the page
  await page.setContent(html)

  // Wait for the chart to be created
  // await page.waitForSelector('#container svg');
  await page.waitForTimeout(2000)

  // Take a screenshot of the chart
  const chartImage = await page.screenshot({
    clip: {
      x: 0,
      y: 0,
      width: 800,
      height: 400,
    },
    encoding: 'base64', // this will return base64 string
  })

  // Clean up: close the browser
  await browser.close()

  return chartImage
}
