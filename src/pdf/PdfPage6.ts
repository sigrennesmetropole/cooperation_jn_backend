import { getHeader } from './PdfHeader';
import { getFooter } from './PdfFooter';

export function getPage6(){
    const html = `
        <div class="page" style="font-family: DM Sans;">
            <!-- Header -->
            <div class="margin-x-30">
                ${getHeader(6)}
            </div>

            <!-- Footer -->
            ${getFooter(6)}
        </div>
    `
  return html;
}