import { getHeader } from './PdfHeader';
import { getFooter } from './PdfFooter';
import { getSunshineInformation } from './components/SunshineInformation';
import { getConsumptionInformation } from './components/ConsumptionInformation';
import { getProductionInformationText } from './components/ProductionInformationText';
import { getImgTest } from './assets/imgtestbase64';
import {RoofSurfaceModel} from "./type/type";

export function getPage2(
    adress: string,
    selectedRoof: RoofSurfaceModel,
    annualConsumption: string,
    currentNumSolarPanel: number,
    currentPower: number, 
    currentSurface: number 
){
    const html = `
        <div class="page" style="font-family: DM Sans;">
            <!-- Header -->
            <div class="margin-x-30">
                ${getHeader(2)}
            </div>

            <!-- Content -->
            <div class="margin-x-30 flex-row gap-4" style="font-family: DM Sans; margin-top: 40px;">
                <div style="flex: 1;">
                    ${getSunshineInformation(
                        adress,
                        selectedRoof
                    )}
                    ${getConsumptionInformation(
                        annualConsumption
                    )}
                </div>
                <div style="flex: 1;">
                    ${getProductionInformationText(
                        currentNumSolarPanel,
                        currentPower,
                        currentSurface
                    )}
                </div>
            </div>

            <div
                class="flex-column box-white margin-x-30"
                style="padding: 0.75rem;  margin-top: 1.25rem; justify-content:center; align-items:center;"
            >
                <img 
                    src="${getImgTest()}" 
                    style="height: 300px; width: 500px; border-radius: 0.375rem"
                >
            </div>

            <!-- Footer -->
            ${getFooter(2)}
        </div>
    `
  return html;
}
