import { getHeader } from './PdfHeader'
import { getFooter } from './PdfFooter'
import { getEconomiesImg } from './assets/EconomiesImg'
import { getChartLegend } from './chart/ChartLegend'
import { getLegendOverGraph } from './chart/LegendOverGraph'

export function getPage4 (
  // @ts-ignore
  chartImageBase64
) {
  const html = `
        <div class="page" style="font-family: DM Sans;">
            <!-- Header -->
            <div class="margin-x-30">
                ${getHeader(4)}
            </div>

            <!-- Content -->
            <div
                class="flex-column box-white margin-x-30"
                style="margin-top: 40px;"
            >
                <div class="flex-row items-center gap-4" style="margin-top: 10px;">
                    ${getEconomiesImg()}
                    <span class="font-bold text-2xl" style="margin-top: 20px;">
                        Votre production d'énergie
                    </span>
                </div>

                <span class="font-bold text-xl" style="margin-top: 40px">
                    Comment réduire au maximum sa facture d'électricité ?
                </span>
                <p class="font-normal text-sm">
                    Votre production solaire varie selon la course du soleil. La nuit, votre
                    consommation est intégralement soutirée au réseau. Pour réduire au
                    maximum votre facture d'électricité, il vous faut adapter vos habitudes
                    de consommation, par exemple mettre en route vos appareils électriques
                    en journée au moment de la production photovoltaïque.
                </p>

                <div style="position: relative;">
                    <img
                        src="data:image/png;base64,${chartImageBase64}"
                        alt="Chart image"
                        style="width: 100%; height: auto;"
                    >
                    ${getChartLegend()}
                    ${getLegendOverGraph()}
                </div>
            </div>


            <!-- Footer -->
            <div style="margin-top: 170px;">
                ${getFooter(4)}
            </div>
        </div>
    `

  return html
}
