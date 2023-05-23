import { getImg } from '../ImgService'
import { getButtonVisitWebsite } from './ButtonVisitWebsite'

const PHOTOVOLTAIQUE_LINK = 'https://www.photovoltaique.info/fr/'

export function getPhotoVoltaique () {
  return `
    <div class="flex-row gap-8 h-fit bg-white">
        <div
            class="flex-row flex-1 justify-center h-[fit] border border-neutral-300 rounded-lg px-5 py-8"
        >
            <img src="data:image/png;base64,${getImg('photovoltaiqueImg.png')}" >
        </div>
        <div class="flex-column flex-1 h-fit">
            <p class="font-dm-sans text-base font-normal">
                Le site de référence
                <strong class="underline"> photovoltaique.info</strong>
                regroupe l’essentiel des informations techniques et réglementaires sur
                le photovoltaïque.
            </p>

            ${getButtonVisitWebsite(PHOTOVOLTAIQUE_LINK)}
        </div>
    </div>
    `
}
