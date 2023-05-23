import {
  convertDataForGraph,
  calculateIntersectionData,
  generateXAxis,
  generateTickPositions
} from './graphService'
import { type AutocalsolResult as AutocalsolResultType } from '../type/type'

export function getChartOptions (
  data_autocalsol: AutocalsolResultType
) {
  const xAxis = generateXAxis()
  const tickPositions = generateTickPositions(xAxis)
  // @ts-expect-error
  const productionData = convertDataForGraph(data_autocalsol.prodByHour)
  // @ts-expect-error
  const consommationData = convertDataForGraph(data_autocalsol.consoByHour)
  const intersectionData = calculateIntersectionData(
    productionData,
    consommationData
  )

  const staticOptions = {
    chart: {
      type: 'areaspline',
      width: 730, // set the width of the chart
      height: 400,
      marginLeft: 30
    },
    title: {
      text: 'Production et consommation journalière'
    },
    legend: {
      enabled: false
    },
    yAxis: {
      title: {
        text: 'Energie (kWh)',
        align: 'high',
        rotation: 0,
        offset: 0,
        y: -20,
        x: 70,
        style: {
          fontSize: '11px',
          fontWeight: 'bold'
        }
      },
      labels: {
        enabled: false
      },
      lineWidth: 1,
      gridLineWidth: 0
    },
    tooltip: {
      enabled: false
    },
    plotOptions: {
      areaspline: {
        marker: {
          enabled: false // Disable data points
        },
        states: {
          inactive: {
            opacity: 1
          },
          hover: {
            enabled: false
          }
        }
      }
    },
    series: [
      {
        name: 'Consommation',
        data: consommationData,
        color: '#D1FAE5',
        lineColor: '#0F766E',
        fillOpacity: 0.6
      },
      {
        name: 'Production',
        lineColor: '#F59E0B',
        color: '#4F46E5',
        data: productionData,
        fillOpacity: 0.7,
        lineWidth: 4
      },
      {
        name: 'Intersection',
        data: intersectionData,
        color: '#10B981',
        lineWidth: 0,
        fillOpacity: 1
      }
    ],
    credits: {
      position: {
        y: -50 // Add a margin above the credits by moving it 20 pixels up from the bottom
      }
    }
  }

  const dynamicOptions = {
    xAxis: {
      categories: xAxis,
      labels: {
        useHTML: true,
        // @ts-expect-error
        formatter: function () {
          // @ts-expect-error
          if (this.value === '') return ''
          // @ts-expect-error
          return this.value === '12h' || this.value === '0h'
            ? '<div style="width: 2px; height: 15px; background-color: black;" />'
            : // @ts-expect-error
                    `<span style="font-size: 9px;">${this.value}</span>`
        }
      },
      rotation: 0,
      tickPositions,
      tickInterval: 1
    }
  }

  return { staticOptions, dynamicOptions }
}
