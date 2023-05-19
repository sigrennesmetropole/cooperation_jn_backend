import {getPotentialImg} from "../assets/PotentialImg";
import {RoofSurfaceModel} from "../type/type";

export function getSunshineInformation(
    adress: string,
    roofSurface: RoofSurfaceModel
){
    const html = `
        <div class="flex-column box-white">
            <div class="flex-row items-center gap-2;" style="margin-top: 20px;">
                ${getPotentialImg()}
                <span class="font-bold text-2xl">
                    Votre ensoleillement
                </span> 
            </div>
            <div class="px-2 mt-2">
                <span class="font-normal text-xs" style="margin-bottom: 1rem;" >
                    ${adress}
                </span>

                <div class="flex-column gap-4" style="margin-top: 15px;">
                    <div class="flex-row" style="align-items: padding: 0px;">
                        <div class="flex-column p-0" style="align-items: flex-start;  padding: 0px;  flex-grow: 1; font-family: DM Sans;">
                            <h3 class="font-bold" style=" font-size: 28px; line-height: 1.75rem; margin: 0; padding:0;" >
                                ${ roofSurface.favorable } m&sup2;
                            </h3>
                            <p class="text-sm font-medium" style="color: rgb(23,23,23); margin: 0; padding:0;">
                                de surface favorable 
                            </p>
                            <p class="text-sm font-normal" style="color: rgb(82,82,82); margin: 0; padding:0;">
                                sur ${roofSurface.total} m&sup2;
                            </p>
                        </div>
                    </div>
                    <div style="border-bottom-width: 1px; border-color: rgb(212,212,212)"></div>
                    <div 
                        class="flex-row" 
                        style="padding-top: 0px;
                        padding-bottom: 0px; padding-left: 0.375rem/* 6px */;
                        padding-right: 0.375rem gap: 1.5rem"
                    >
                        <div class="flex-row justify-between items-center p-0 gap-2 grow">
                            <p class="font-dm-sans text-sm font-normal">Orientation</p>
                            <p class="font-dm-sans font-bold text-base">
                                ${roofSurface.orientation}
                            </p>
                        </div>
                        <div class="flex-row justify-between items-center p-0 gap-2 grow">
                            <p class="font-dm-sans text-sm font-normal">Inclinaison</p>
                            <p class="font-dm-sans font-bold text-base">
                                ${roofSurface.inclinaison}°
                            </p>
                        </div>
                    </div>
                </div>
            </div>
          
        </div>
    `;
    return html;
}