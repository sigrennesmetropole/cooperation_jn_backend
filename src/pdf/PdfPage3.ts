import { getHeader } from './PdfHeader';
import { getFooter } from './PdfFooter';

export function getPage3(){
    const html = `
        <div class="page" style="font-family: DM Sans;">
            <!-- Header -->
            <div class="margin-x-30">
                ${getHeader(3)}
            </div>

            <!-- Footer -->
            ${getFooter(3)}
        </div>
    `
  return html;
}