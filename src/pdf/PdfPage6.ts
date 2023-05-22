import { getHeader } from './PdfHeader';
import { getFooter } from './PdfFooter';
import { getSolarCoop } from './components/SolarCoop';

export function getPage6(){
    const html = `
        <div class="page" style="font-family: DM Sans;">
            <!-- Header -->
            <div class="margin-x-30">
                ${getHeader(6)}
            </div>

            <!-- Content -->
            <div
                class="flex-column box-white margin-x-30"
                style="margin-top: 10px;"
            >
                ${getSolarCoop()}
            </div>


            <!-- Footer -->
            ${getFooter(6)}
        </div>
    `
  return html;
}