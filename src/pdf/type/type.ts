export type RoofSurfaceModel = {
    surface_id: string
    values: number[]
    favorable: number
    total: number
    orientation?: string
    azimuth?: number
    inclinaison: number
}

export type AutocalsolData = {
    latitude: number
    longitude: number
    slope: number
    azimuth: number
    annual_consumption: number
    peak_power: number
}
  
export type AutocalsolResult = {
    prodByMonth: number[]
    consoByMonth: number[]
    prodByHour: [string, number][]
    consoByHour: [string, number][]
    consoAnnualInjected: number
    consoAnnualAutoConsumed: number
}