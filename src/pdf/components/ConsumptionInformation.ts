export function getConsumptionInformation(annualConsumption: string) {
  return `
    <div
        class="flex-column box-white"
        style="margin-top: 15px; "
    >
        <p class="font-dm-sans font-bold text-base" style="margin: 0; padding: 0;">Votre consommation actuelle</p>
        <p class="font-dm-sans font-medium text-sm" style="margin: 0; padding: 0;">
            ${annualConsumption} kWh/an
        </p>
    </div>
    `
}
