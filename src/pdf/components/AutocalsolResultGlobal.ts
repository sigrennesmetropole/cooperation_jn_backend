import {AutocalsolResult} from '../type/type'
import { getElectricityProductionImg } from '../assets/electricityProductionImg';
import { getEqualCircle } from '../assets/equalCircleImg';
import { getPlusCircle } from '../assets/plusCircleImg';

export function getAutocalsolResultGlobal(
    autocalsolResult: AutocalsolResult
){

    const production = Math.round(
        autocalsolResult.consoAnnualInjected +
        autocalsolResult.consoAnnualAutoConsumed
    )
    const autoConsumed = Math.round(autocalsolResult.consoAnnualAutoConsumed)
    const injected = Math.round(autocalsolResult.consoAnnualInjected)

    const html = `
    <div class="flex-column items-center" style="margin-top: 20px;">
        ${getElectricityProductionImg()}

        <div class="flex-row" style="position: relative; margin-bottom: 1.25rem;">
            <div style="position: absolute; left: 203px;  top: 80px;  z-index: 30;">
                ${getEqualCircle()}
            </div>

            <div style="position: absolute; left: 425px;  top: 80px;  z-index: 30;">
                ${getPlusCircle()}
            </div>

         

            <div class="mt-8 font-dm-sans relative mr-12">
                <div
                    class="bg-amber-500 px-6 py-1 rounded-full w-fit absolute  -top-3" style="left: 21%;"
                >
                    <span class="text-white text-base font-bold"> Production </span>
                </div>
                <div
                    class="flex-column justify-center items-center rounded-lg bg-orange-50 border border-orange-300 px-6 py-4"
                    style="height: 200px; max-width: 250px; margin-right: 30px;"
                >
                    <span class="font-bold text-3xl mt-4">
                        ${production}
                    </span>
                    <span class="font-bold text-base"> kWh/an </span>
                    <span class="text-sm font-medium text-center" style="width: 160px;  height: 60px;" >
                        d’électricité produite par votre installation photovoltaïque
                    </span>
                    <span
                        class="mt-4 text-xs font-bold text-amber-600 text-center"
                        style="  width: 160px;   height: 48px;"
                    >
                        Un panneau réalise encore 80% de sa production au bout de 30 ans
                    </span>
                </div>
            </div>
    
            <div class="mt-8 font-dm-sans relative">
                <div
                    class="bg-emerald-500 px-6 py-1 rounded-full w-fit absolute -top-3 "
                    style="left: 12%;"
                >
                    <span class="text-white text-base font-bold"> Autoconsommation </span>
                </div>
                <div
                    class="flex-column justify-center items-center rounded-l-lg bg-green-50 border border-r-0 border-green-400 px-6 py-4"
                    style="height: 200px; max-width: 250px;"
                >
                    <span class="font-bold text-3xl mt-4">
                        ${autoConsumed}
                    </span>
                    <span class="font-bold text-base"> kWh/an </span>
                    <span class="text-sm font-medium text-center" style=" width: 160px; height: 60px;">
                        d’électricité produite et consommée sur place
                        <br />
                    </span>
                    <span
                        class="mt-4 text-xs font-bold text-emerald-600 text-center"
                        style="width: 160px; height: 48px;"
                    >
                        Part à déduire de votre facture fournisseur
                        <br />
                    </span>
                </div>
            </div>
    
            <div class="mt-8 font-dm-sans relative">
                <div
                    class="bg-indigo-600 px-6 py-1 rounded-full w-fit absolute -top-3"
                    style="left: 26%;"
                >
                    <span class="text-white text-base font-bold"> Revente </span>
                </div>
                <div
                    style="height: 200px; max-width: 250px;" 
                    class="flex-column justify-center items-center rounded-r-lg bg-violet-50 border border-l-0 border-indigo-300 px-6 py-4"
                >
                    <span class="font-bold text-3xl mt-4">
                        ${injected}
                    </span>
                    <span class="font-bold text-base"> kWh/an </span>
                    <span class="text-sm font-medium text-center" style="width: 160px; height: 60px;">
                        d’électricité vendue et injectée sur le réseau
                    </span>
                    <span
                        style="width: 160px;  height: 48px;"
                        class="mt-4 text-xs font-bold text-indigo-600 text-center"
                    >
                        Revente selon un tarif garanti sur 20 ans
                    </span>
                </div>
            </div>
    
          <div
            style="top: 250px;  width: 418px; right: 0px;" 
            class="bg-black px-3 py-1 text-center rounded-full absolute"
          >
            <span class="text-white text-base font-bold"> Vos économies </span>
          </div>
        </div>
    </div>
    `;
    return html;
}