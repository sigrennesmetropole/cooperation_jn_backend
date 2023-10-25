import { getImg } from '../ImgService'
import { getButtonVisitWebsite } from './ButtonVisitWebsite'
import { getInformationGreyImg } from '../assets/informationGreyImg'

export function getEnergiesRennes(energiesLink: string) {
  return `
    <div class="flex-column h-fit bg-white">
        <h2 class="font-dm-sans font-bold text-2xl">
            Contacter des associations locales
        </h2>

        <div class="flex-row gap-8">
            <div
                class="
                flex-row flex-1 h-[fit] border border-neutral-300 rounded-lg px-5 py-8"
            >
                <img src="data:image/png;base64,${getImg(
                  'energiesRennes.png'
                )}" style="margin-left: 80px" >
            </div>
            <div class="flex-column flex-1 h-fit">
                <p class="font-dm-sans text-base font-normal">
                    <strong class="underline"> Énergies du Pays de Rennes</strong>
                      est une association citoyenne pour le développement du solaire photovoltaïque sur Rennes et sa région.
                </p>

                ${getButtonVisitWebsite(energiesLink)}
            </div>
        </div>

        <div
            class="flex-row gap-3 border border-neutral-300 rounded-lg px-2 "
            style="padding-top: 20px; padding-bottom: 20px; margin-top: 20px"
        >
            <div style="margin-left: 15px; padding-top: 13px;">
                ${getInformationGreyImg()}
            </div>
            <p class="font-dm-sans text-sm font-medium text-slate-900">
                Pour Acigné et Brécé, il existe aussi
                <span
                    class="inline-flex items-center cursor-pointer font-medium"
                >
                <strong class="underline">l'association Soleil sur Vilaine</strong>
                </span>
            </p>
        </div>
    </div>
    `
}
