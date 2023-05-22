import {getPotentialImg} from "../assets/PotentialImg";
import {RoofSurfaceModel} from "../type/type";

export function getSunshineInformation(
    adress: string,
    roofSurface: RoofSurfaceModel
){
    const html = `
        <div class="flex-column box-white">
            <div class="flex-row items-center gap-4" style="margin-top: 10px;">
                ${getPotentialImg()}
                <span class="font-bold text-2xl" style="margin-top: 25px;">
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

                    <div style="width: 100%; border: 1px solid #D4D4D4;"></div>

                    <div 
                        class="flex-row" 
                        style="gap: 1.5rem;"
                    >
                        <div class="flex-row gap-2 flex-3"  style="margin:0; padding: 0;">
                            <p class="font-dm-sans text-sm font-normal">
                                Orientation
                            </p>
                            <p class="font-dm-sans font-bold text-base" style="margin-left: 8px;">
                                ${roofSurface.orientation}
                            </p>
                        </div>
                        <div class="flex-row gap-2 flex-2" >
                            <p class="font-dm-sans text-sm font-normal">Inclinaison</p>
                            <p class="font-dm-sans font-bold text-base" style="margin-left: 8px;">
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