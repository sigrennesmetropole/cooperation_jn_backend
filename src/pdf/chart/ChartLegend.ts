export function getChartLegend () {
  return `
        <div class="flex-row font-dm-sans mb-4 mt-2" style="margin-left: 20px">
            <div class="font-normal text-sm border-amber-500 border  border-t-0 border-b-0 border-r-0 border-l-4 pl-3">
                Production
            </div>
            <div class="font-normal text-sm border-teal-700 border border-t-0 border-b-0 border-r-0 border-l-4 pl-3 ml-6">
                Consommation
            </div>
            <div class="flex-row ml-6">
                <div class="bg-emerald-500 w-6 h-6 rounded-sm"></div>
                <span class="font-normal text-sm ml-3"> Autoconsommation </span>
            </div>
            <div class="flex-row ml-6">
                <div class="bg-indigo-600 w-6 h-6 rounded-sm"></div>
                <span class="font-normal text-sm ml-3"> Revente </span>
            </div>
        </div>
    `
}
