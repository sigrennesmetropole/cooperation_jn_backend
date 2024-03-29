export interface AutocalsolType {
  idStudy: number
  puissanceCreteTotale: number
  resultBatiments: null
  resultConso: {
    tabProdMonth: number[]
    tabConsoMonth: number[]
    prodTotale: Array<[number, string]>
    consoPetit: Array<[number, string]>
    energieInjectee: number
    energieAutoconsommee: number
    energieSoutiree: number
  }
  resultAutoConso: {
    tabProdJournaliere: Record<string, number>
    tabConsoJournaliere: Record<string, number>
    tabInjectionJournaliere: Record<string, number>
  }
}
