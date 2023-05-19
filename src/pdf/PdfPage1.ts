import { getFooter } from './PdfFooter';
import { getDivider } from './PdfDivider';
import { getHomePageImg }   from './assets/PdfHomePageImg';

function getIconSun(){
    return `
        <svg width="113" height="106" viewBox="0 0 113 106" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <rect x="0.188965" y="0.0273438" width="112.568" height="105.946" fill="url(#pattern0)"/>
            <defs>
            <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
            <use xlink:href="#image0_2857_8779" transform="matrix(0.00534759 0 0 0.00568182 0 -0.0028409)"/>
            </pattern>
            <image id="image0_2857_8779" width="187" height="177" xlink:href="data:image/png;base64,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"/>
            </defs>
        </svg>
    `
}

export function getPage1(){
    const html = `
        <div class="page" style="font-family: DM Sans;">
            <!-- Header -->
            <div 
                class="flex-row justify-between"
                style="
                    margin-top: 45px; 
                    margin-left: 30px;
                    margin-right: 30px;
                "
            >
                <div style="display: flex; flex-direction: column;">
                    ${getDivider()}
                    <span class="font-bold text-2xl" style="margin-top: 20px;">Cadastre solaire</span>
                    <span style="margin-top: 8px; font-weight: 500; font-size: 0.875rem; line-height: 1.25rem;"> 
                        Projetez-vous en tant que producteur d’électricité <br>
                        grâce à l’énergie solaire photovoltaïque
                    </span>
                </div>
                <div>
                    ${getIconSun()}
                </div>
            </div>

            <!-- Content -->
            <div 
                style="
                    display: flex; flex-direction: column; 
                    text-align: center;
                    margin-top: 150px;
                    margin-left: 30px;
                    margin-right: 30px;
                "
            >
                <span class="font-bold" style="font-size: 2.25rem; line-height: 2.5rem;">
                    Votre simulation
                    <br />d’installation photovoltaïque
                </span>
                <div style="margin-top: 44px">
                    ${getHomePageImg()}
                </div>
            </div> 

            <!-- Footer -->
            ${getFooter(1)}
        </div>
    `
  return html;
}