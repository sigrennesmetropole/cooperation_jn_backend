import { getHeader } from './PdfHeader';
import { getFooter } from './PdfFooter';
import { getGoFurther } from './components/GoFurther';

export function getPage5(){
    const html = `
        <div class="page" style="font-family: DM Sans;">
            <!-- Header -->
            <div class="margin-x-30">
                ${getHeader(5)}
            </div>

            <!-- Content -->
            <div
                class="flex-column box-white margin-x-30"
                style="margin-top: 40px;"
            >
                ${getGoFurther()}
            </div>

            <!-- Footer -->
            <div style="margin-top: 90px;">
                ${getFooter(5)}
            </div>
        </div>
    `
  return html;
}