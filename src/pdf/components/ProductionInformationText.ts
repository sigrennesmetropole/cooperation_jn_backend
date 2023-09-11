import { getInstallationImg } from '../assets/InstallationImg'
import { getSolarPanelImg } from '../assets/SolarPanelImg'

export function getProductionInformationText (
  currentNumSolarPanel: number,
  currentPower: number,
  currentSurface: number
): string {
  return `
        <div class="flex-column box-white" style="margin-top:20px;">
            <div class="flex-row items-center gap-4" style="margin-top: 10px;">
                ${getInstallationImg()}
                <span class="font-bold text-2xl" style="margin-top: 25px;">
                    Votre installation
                </span>
            </div>

            <div
                class="flex-column gap-4"
                style="padding: 16px; border-radius: 0.75rem; background-color: rgb(248,250,252); border-color: rgb(241,245,249); border-width: 1px; border-style: solid;"
            >
                <div class="flex-row p-0" style="justify-content:center; align-items:center;">
                    <span class="font-dm-sans font-bold" style="font-size: 44px; line-height: 48px; margin-right: 13px;">
                        ${currentNumSolarPanel}
                    </span>
                    ${getSolarPanelImg()}
                </div>

                <div class="flex-column p-0 gap-1"  style="justify-content:center; align-items:center;">
                    <h4 class="font-dm-sans text-lg text-center font-bold m-0 p-0" style="width: 140px;">
                        panneaux photovoltaïques
                    </h4>
                    <p class="font-dm-sans font-normal text-xs m-0 p-0" style="color: #525252;">
                        soit ${currentPower} kWc de puissance installée
                    </p>
                </div>


                <div style="width: 100%; border: 1px solid #D4D4D4;"></div>


                <div
                    class="flex-column"
                >
                    <span class="font-dm-sans font-normal text-sm">
                        Surface de l’installation photovoltaïque
                    </span>
                    <span class="font-bold text-base"> ${currentSurface.toFixed(2)}m&sup2; </span>
                </div>
            </div>
        </div>
    `
}
