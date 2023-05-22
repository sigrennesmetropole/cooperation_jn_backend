import { generateChartImg } from './PdfChart';

import { getPage1 } from './PdfPage1'
import { getPage2 } from './PdfPage2'
import { getPage3 } from './PdfPage3'
import { getPage4 } from './PdfPage4'
import { getPage5 } from './PdfPage5'
import { getPage6 } from './PdfPage6'
import { getPdfStyle } from './PdfStyle'
import { getautocalsolResultExample } from './assets/autocalsolResultExample'

const fs = require('fs');

export async function getPdfHtml(){
    const selectedRoof = {
      surface_id: '53123',
      values: [13.832112, 74.012886, 12.155002, 0],
      favorable: 10,
      total: 87,
      orientation: 'EST',
      azimuth: 80,
      inclinaison: 1,
    }
    const address= '1 rue de la paix, 75000 Paris'
    const annualConsumption = '7000'
    const currentNumSolarPanel = 5
    const currentPower = 7000
    const currentSurface = 40
    const districtNumberInstallations = 177
    const districtProduction = 1198

    // const chartImageBase64 = await generateChartImg();

    const html =  `           
        <html>
            <style>
                ${getPdfStyle()}
            </style>
            <body style="background-color: rgb(241,245,249);">
                ${getPage1()}
                ${getPage2(
                    address, 
                    selectedRoof, 
                    annualConsumption,
                    currentNumSolarPanel,
                    currentPower,
                    currentSurface
                )}
                ${getPage3(
                    // @ts-ignore
                    getautocalsolResultExample(),
                    districtNumberInstallations,
                    districtProduction
                )}
                ${getPage4()}
                ${getPage5()}
                ${getPage6()}

            </body>
        </html>
    `;

    // <!-- <img src="data:image/png;base64,${chartImageBase64}" alt="Chart image"> --!>

    // put html into a file
    fs.writeFileSync('output.text', html);
    return html
}
