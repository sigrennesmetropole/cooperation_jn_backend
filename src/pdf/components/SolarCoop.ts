import { getImg } from '../ImgService'
import { getButtonVisitWebsite } from './ButtonVisitWebsite'

const SOLAR_COOP_LINK = 'https://www.solarcoop.fr/'

export function getSolarCoop () {
  return `
    <div class="flex-column h-fit bg-white">
        <h2 class="font-dm-sans font-bold text-2xl">
            Être accompagné dans mon projet
        </h2>

        <div class="flex-row gap-8"> 
            <div
                class="flex-row flex-1 justify-center h-[fit] border border-neutral-300 rounded-lg px-5 py-8"
            >
                <img src="data:image/png;base64,${getImg('solarCoop.png')}" >
            </div>
            <div class="flex-column flex-1 h-fit">
                <p class="font-dm-sans text-base font-normal">
                    Vous pouvez vous faire accompagner par la structure citoyenne Solarcoop qui vous aidera à trouver la meilleure installation.
                </p>

                ${getButtonVisitWebsite(SOLAR_COOP_LINK)}
            </div>
        </div>
    </div>
    `
}
