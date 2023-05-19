/*
  Autocalsol data is sorted by hour. Except that the graph starts at 3am and not midnight
  So we have to sort the hours starting with 3am
*/
export function sortedHoursWith3amStart(data: [string, number][]) {
    const after3hours: number[] = []
    const before3hours: number[] = []
    data.forEach((element) => {
      if (element[0] >= '03:00:00') {
        after3hours.push(element[1])
      } else {
        before3hours.push(element[1])
      }
    })
    return after3hours.concat(before3hours)
}
  
const STUFFING_PRECISION = 10
/**
 * By default, we have one value for one hour. When we calculate the intersection, the precision of the intersection graph is not very good
 * So we need to add dummy data to have a more accurate intersection graph
 *
 * Example: 10h we have a production of 1000W and 11h we have a production of 2000W
 * The intersection graph will be a straight line between 1000W and 2000W
 * With the stuffing, we will have 10 values between 1000W and 2000W : 1000W, 1100W, 1200W, 1300W, 1400W, 1500W, 1600W, 1700W, 1800W, 1900W, 2000W
 */
export function stuffingData(data: number[]): number[] {
    const newData = []
    for (let i = 0; i < data.length; i++) {
      newData.push(data[i])
      if (i + 1 === data.length) {
        break
      }
  
      const item1 = data[i]
      const item2 = data[i + 1]
      let step = 0
      let newItem = 0
      for (let y = 1; y < STUFFING_PRECISION; y++) {
        if (item1 < item2) {
          step = ((item2 - item1) / STUFFING_PRECISION) * y
          newItem = item1 + step
        } else {
          step = ((item1 - item2) / STUFFING_PRECISION) * y
          newItem = item1 - step
        }
        newData.push(newItem)
      }
    }
    return newData
  }
  
  export function convertDataForGraph(data: [string, number][]) {
    const newData = sortedHoursWith3amStart(data)
    return stuffingData(newData)
  }
  
  export function calculateIntersectionData(
    productionData: number[],
    consommationData: number[]
  ) {
    return productionData.map((value, index) => {
      return Math.min(value, consommationData[index])
    })
}
  
export function stuffingXAxis(xAxis: string[]) {
    const newXAxis = []
    for (let i = 0; i < xAxis.length; i++) {
      newXAxis.push(xAxis[i])
      if (i + 1 === xAxis.length) {
        break
      }
  
      for (let y = 1; y < STUFFING_PRECISION; y++) {
        newXAxis.push('') // Add empty strings for the stuffed values
      }
    }
    return newXAxis
}
  
export function generateXAxis() {
    const baseHours = [
      '3h',
      '4h',
      '5h',
      '6h',
      '7h',
      '8h',
      '9h',
      '10h',
      '11h',
      '12h',
      '13h',
      '14h',
      '15h',
      '16h',
      '17h',
      '18h',
      '19h',
      '20h',
      '21h',
      '22h',
      '23h',
      '0h',
      '1h',
      '2h',
    ]
    return stuffingXAxis(baseHours)
}
  
export function generateTickPositions(xAxis: string[]) {
    const tickPositions: number[] = []
    xAxis.forEach((element, index) => {
      if (element.match('h')) {
        tickPositions.push(index)
      }
    })
    return tickPositions
}
  
export function getProdByHour(){
    return [
        ["00:00:00", 0],
        ["01:00:00", 0],
        ["02:00:00", 0],
        ["03:00:00", 0],
        ["04:00:00", 0],
        ["05:00:00", 30],
        ["06:00:00", 116],
        ["07:00:00", 148],
        ["08:00:00", 67],
        ["09:00:00", 135],
        ["10:00:00", 374],
        ["11:00:00", 95],
        ["12:00:00", 243],
        ["13:00:00", 750],
        ["14:00:00", 900],
        ["15:00:00", 950],
        ["16:00:00", 1000],
        ["17:00:00", 700],
        ["18:00:00", 84],
        ["19:00:00", 14],
        ["20:00:00", 0],
        ["21:00:00", 0],
        ["22:00:00", 0],
        ["23:00:00", 0]
    ]
}

export function getConsoByHour(){
    return [
        ["00:00:00", 511],
        ["01:00:00", 444],
        ["02:00:00", 398],
        ["03:00:00", 375],
        ["04:00:00", 370],
        ["05:00:00", 377],
        ["06:00:00", 407],
        ["07:00:00", 479],
        ["08:00:00", 612],
        ["09:00:00", 748],
        ["10:00:00", 841],
        ["11:00:00", 907],
        ["12:00:00", 906],
        ["13:00:00", 792],
        ["14:00:00", 729],
        ["15:00:00", 672],
        ["16:00:00", 631],
        ["17:00:00", 626],
        ["18:00:00", 678],
        ["19:00:00", 778],
        ["20:00:00", 829],
        ["21:00:00", 833],
        ["22:00:00", 759],
        ["23:00:00", 618]
    ]
}