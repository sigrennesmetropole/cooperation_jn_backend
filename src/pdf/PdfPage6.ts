import { getHeader } from './PdfHeader'
import { getFooter } from './PdfFooter'
import { getSolarCoop } from './components/SolarCoop'
import { getEnergiesRennes } from './components/EnergiesRennes'

export function getPage6(energiesLink: string, solarCoopLink: string) {
  const html = `
        <div class="page" style="font-family: DM Sans;">
            <!-- Header -->
            <div class="margin-x-30">
                ${getHeader(6)}
            </div>

            <!-- Content -->
            <div
                class="flex-column box-white margin-x-30"
                style="margin-top: 40px;"
            >
                ${getSolarCoop(solarCoopLink)}
            </div>
            <div
                class="flex-column box-white margin-x-30"
                style="margin-top: 20px;"
            >
                ${getEnergiesRennes(energiesLink)}
            </div>



            <!-- Footer -->
            <div style="margin-top: 140px;">
                ${getFooter(6)}
            </div>
        </div>
    `
  return html
}
