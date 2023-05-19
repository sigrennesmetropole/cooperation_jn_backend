import { getHeader } from './PdfHeader';
import { getFooter } from './PdfFooter';
import { getSunshineInformation } from './components/SunshineInformation';
import {RoofSurfaceModel} from "./type/type";

export function getPage2(
    adress: string,
    selectedRoof: RoofSurfaceModel
){
    const html = `
        <div class="page" style="font-family: DM Sans;">
            <!-- Header -->
            <div class="margin-x-30">
                ${getHeader(2)}
            </div>

            <!-- Content -->
            <div class="flex-row items-center" style="font-weight: 500; gap: 1.5rem; margin-top: 5rem;">
                <div class="flex-column" style="flex: 1;">
                    ${getSunshineInformation(
                        adress,
                        selectedRoof
                    )}
                </div>
                <div class="flex-column" style="flex: 1;">
                    test
                </div>
            </div>

            <!-- Footer -->
            ${getFooter(2)}
        </div>
    `
  return html;
}
