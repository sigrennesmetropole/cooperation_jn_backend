import { getWarningImg } from '../assets/WarningImg';

function keepDecimals(float: number, numberOfDecimals: number) {
    const roundFloat = float.toFixed(numberOfDecimals)
    return roundFloat
}

export function getNeighbourhoodData(
    districtNumberInstallations: number,
    districtProduction: number
){
    return `
    <div
        class="flex-row px-4 py-[19px] gap-3 bg-amber-50 border border-amber-200 font-dm-sans text-amber-900 rounded-lg font-normal text-sm"
        style="margin-top: 30px;"
    >
        <div 
            class="w-5 h-5 my-auto"
            style="margin-top: auto; margin-bottom: auto;"
        > 
            ${getWarningImg()}
        </div>
        <p>
        Cette installation contribuerait à la transition énergétique de votre
        quartier/commune qui dispose de
        <span class="font-bold" id="number-panel">
            ${districtNumberInstallations}
        </span>
        sites de production photovoltaïque représentant annuellement
        <span class="font-bold" id="district-production">
            ${keepDecimals(districtProduction,1)} MWh.
        </span>
        </p>
    </div>
    `
}