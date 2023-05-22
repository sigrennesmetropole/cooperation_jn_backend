import { getHeader } from './PdfHeader';
import { getFooter } from './PdfFooter';
import { getEconomiesImg } from './assets/EconomiesImg';
import {getAutocalsolResultGlobal} from "./components/AutocalsolResultGlobal";
import {getNeighbourhoodData} from "./components/NeighbourhoodData";
import {AutocalsolResult} from './type/type'

export function getPage3(
    autocalsolResult: AutocalsolResult,
    districtNumberInstallations: number,
    districtProduction: number
){
    const html = `
        <div class="page" style="font-family: DM Sans;">
            <!-- Header -->
            <div class="margin-x-30">
                ${getHeader(3)}
            </div>

            <!-- Content -->
            <div
                class="flex-column box-white margin-x-30"
                style="margin-top: 100px;"
            >
                <div class="flex-row items-center gap-4" style="margin-top: 10px;">
                    ${getEconomiesImg()}
                    <span class="font-bold text-2xl" style="margin-top: 20px;">
                        Votre production d'énergie
                    </span> 
                </div>
                ${getAutocalsolResultGlobal(
                    autocalsolResult
                )}
                ${
                    getNeighbourhoodData(
                        districtNumberInstallations,
                        districtProduction
                    )
                }
            </div>

            <!-- Footer -->
            <div style="margin-top: 170px;">
                ${getFooter(3)}
            </div>
        </div>
    `
  return html;
}