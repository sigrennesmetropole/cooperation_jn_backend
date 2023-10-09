import { getHeader } from './PdfHeader'
import { getFooter } from './PdfFooter'
import { getGoFurther } from './components/GoFurther'

export function getPage5(
  urlSigneQualite: string,
  photovoltaiqueLink: string,
  choisirModeleEco: string
) {
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
                ${getGoFurther(
                  urlSigneQualite,
                  photovoltaiqueLink,
                  choisirModeleEco
                )}
            </div>

            <!-- Footer -->
            <div style="margin-top: 80px;">
                ${getFooter(5)}
            </div>
        </div>
    `
  return html
}
