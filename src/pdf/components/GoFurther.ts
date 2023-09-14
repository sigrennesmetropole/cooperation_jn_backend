import { getPhotoVoltaique } from './PhotoVoltaique'
import { getQualiLabelsImg } from '../assets/qualiLabelsImg'
import { getProfitabilityImg } from '../assets/profitabilityImg'
import { getLinkWithIconArrow } from './LinkWithIconArrow'
import { getImg } from '../ImgService'
import { getConfigFromKey } from '../../config/configService'

export function getGoFurther() {
  const url_signe_qualite = getConfigFromKey('link.url_signe_qualite')
  const url_choisir_modele_eco = getConfigFromKey('link.choisir_modele_eco')

  return `
    ${getPhotoVoltaique()}

    <div class="flex flex-row gap-8">
        <div class="flex-column gap-6 flex-1 bg-slate-100 rounded-lg p-6 mx-auto">
            <div class="rounded-xl" style="width: 100px">
                ${getQualiLabelsImg()}
            </div>
            <h2 class="font-dm-sans text-2xl font-bold">
                3 labels de qualification pour vous guider dans le choix de votre
                installateur
            </h2>
            <div
                class="px-6 flex-row justify-between bg-white rounded-xl"
                style=" padding-top: 18px; padding-bottom: 18px;"
            >
                <img src="data:image/png;base64,${getImg(
                  'qualibat.avif'
                )}" class="h-10 w-10">
                <img src="data:image/png;base64,${getImg(
                  'qualitEnR.png'
                )}" class="h-10 w-[79px]">
                <img src="data:image/png;base64,${getImg(
                  'qualifelec.png'
                )}" class="h-10 w-[34px]">
            </div>
            ${getLinkWithIconArrow(url_signe_qualite)}
        </div>
        <div class="flex-column gap-6 flex-1 bg-slate-100 rounded-lg p-6 mx-auto">
            <div class="rounded-xl" style="width: 100px">
                ${getProfitabilityImg()}
            </div>
            <h2 class="font-dm-sans text-2xl font-bold" style="margin-bottom: 85px;" >
                Connaitre des ordres de grandeur de coûts et de rentabilité d'un
                projet photovoltaïque
            </h2>
            ${getLinkWithIconArrow(url_choisir_modele_eco)}
        </div>
    </div>

    `
}
