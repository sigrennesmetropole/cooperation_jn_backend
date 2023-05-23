export interface RoofSurfaceModel {
  surface_id: string
  values: number[]
  favorable: number
  total: number
  orientation?: string
  azimuth?: number
  inclinaison: number
}

export interface AutocalsolData {
  latitude: number
  longitude: number
  slope: number
  azimuth: number
  annual_consumption: number
  peak_power: number
}

export interface AutocalsolResult {
  prodByMonth: number[]
  consoByMonth: number[]
  prodByHour: Array<[string, number]>
  consoByHour: Array<[string, number]>
  consoAnnualInjected: number
  consoAnnualAutoConsumed: number
}
