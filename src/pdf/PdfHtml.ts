import { generateChartImg } from './chart/PdfChart';
import { getPage1 } from './PdfPage1'
import { getPage2 } from './PdfPage2'
import { getPage3 } from './PdfPage3'
import { getPage4 } from './PdfPage4'
import { getPage5 } from './PdfPage5'
import { getPage6 } from './PdfPage6'
import { getPdfStyle } from './PdfStyle'
import { getautocalsolResultExample } from './assets/autocalsolResultExample'
import {RoofSurfaceModel} from "./type/type";

const fs = require('fs');
export const SOLAR_PANEL_SURFACE = 1.8 // 1.8 m2 per solar panel

export async function getPdfHtml(
    selectedRoof: RoofSurfaceModel,
    address: string,
    annualConsumption: string,
    currentNumSolarPanel: number,
    currentPower: number, 
){
    const currentSurface =currentNumSolarPanel * SOLAR_PANEL_SURFACE
    const districtNumberInstallations = 177
    const districtProduction = 1198

    const chartImageBase64 = await generateChartImg();

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
                ${getPage4(
                    chartImageBase64
                )}
                ${getPage5()}
                ${getPage6()}

            </body>
        </html>
    `;

    // put html into a file
    fs.writeFileSync('output.text', html);
    return html
}
