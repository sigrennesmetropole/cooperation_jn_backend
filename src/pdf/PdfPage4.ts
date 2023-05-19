import { getHeader } from './PdfHeader';
import { getFooter } from './PdfFooter';

export function getPage4(){
    const html = `
        <div class="page" style="font-family: DM Sans;">
            <!-- Header -->
            <div class="margin-x-30">
                ${getHeader(4)}
            </div>

            <!-- Footer -->
            ${getFooter(4)}
        </div>
    `
  return html;
}