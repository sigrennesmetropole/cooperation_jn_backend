import { generateChartImg } from './chart/PdfChart';
import { getPage1 } from './PdfPage1'
import { getPage2 } from './PdfPage2'
import { getPage3 } from './PdfPage3'
import { getPage4 } from './PdfPage4'
import { getPage5 } from './PdfPage5'
import { getPage6 } from './PdfPage6'
import { getPdfStyle } from './PdfStyle'
import {RoofSurfaceModel, AutocalsolResult as AutocalsolResultType} from "./type/type";

const fs = require('fs');
export const SOLAR_PANEL_SURFACE = 1.8 // 1.8 m2 per solar panel

export async function getPdfHtml(
    data_autocalsol: AutocalsolResultType,
    selectedRoof: RoofSurfaceModel,
    address: string,
    annualConsumption: string,
    currentNumSolarPanel: number,
    currentPower: number, 
    districtNumberInstallations: number,
    districtProduction: number,
    imgRoofBase64: string
){
    const currentSurface =currentNumSolarPanel * SOLAR_PANEL_SURFACE

    const chartImageBase64 = await generateChartImg(data_autocalsol);

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
                    currentSurface,
                    imgRoofBase64
                )}
                ${getPage3(
                    data_autocalsol,
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
