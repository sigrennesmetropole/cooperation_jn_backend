import { generateChartImg } from './chart/PdfChart'
import { getPage1 } from './PdfPage1'
import { getPage2 } from './PdfPage2'
import { getPage3 } from './PdfPage3'
import { getPage4 } from './PdfPage4'
import { getPage5 } from './PdfPage5'
import { getPage6 } from './PdfPage6'
import { getPdfStyle } from './PdfStyle'
import { type RoofSurfaceModel, type AutocalsolResult as AutocalsolResultType } from './type/type'
import { getConfigFromKey } from '../config/configService'

const fs = require('fs')

export async function getPdfHtml (
  data_autocalsol: AutocalsolResultType,
  selectedRoof: RoofSurfaceModel,
  address: string,
  annualConsumption: string,
  currentNumSolarPanel: number,
  currentPower: number,
  districtNumberInstallations: number,
  districtProduction: number,
  imgRoofBase64: string
) {
  // @ts-ignore
  const currentSurface = currentNumSolarPanel *  getConfigFromKey('solar_panel.solar_panel_surface')

  const chartImageBase64 = await generateChartImg(data_autocalsol)

  const html = `           
        <html>
            <style>
                ${getPdfStyle()}
            </style>
            <body>
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
    `
  return html
}
