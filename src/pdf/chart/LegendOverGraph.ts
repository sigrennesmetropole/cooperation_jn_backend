import { getMoonImg } from "../assets/MoonImg";
import { getSunImg } from "../assets/SunImg";

export function getLegendOverGraph() {
  return `
        
          <div class="absolute z-30" style="top: 50px; left: 230px;">
            ${getSunImg()}
          </div>
          <div
            class=" border border-l-2 border-t-0 border-b-0 border-r-0 border-dashed mx-4 absolute z-30 border-indigo-200"
            style="height: 205px; top: 95px; left: 250px;"
          ></div>


          <div class="absolute z-30"  style="top: 50px; left: 530px;">
            ${getMoonImg()}
          </div>
          <div
            class="border border-l-2 border-t-0 border-b-0 border-r-0 border-dashed mx-4 absolute z-30 border-indigo-200"
            style="height: 205px; top: 95px; left: 550px;"
          ></div>
 
    `;
}
