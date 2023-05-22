import { getHeader } from './PdfHeader';
import { getFooter } from './PdfFooter';

export function getPage5(){
    const html = `
        <div class="page" style="font-family: DM Sans;">
            <!-- Header -->
            <div class="margin-x-30">
                ${getHeader(5)}
            </div>

            <!-- Footer -->
            ${getFooter(5)}
        </div>
    `
  return html;
}