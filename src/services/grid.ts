import type { GeoJSONFeatureCollection } from 'ol/format/GeoJSON'
import type {
    AllGeoJSON,
    BBox,
    Feature,
    Point,
    Polygon as turfPolygon,
    Properties,
} from '@turf/helpers'
import {
    bbox,
    bboxPolygon,
    booleanPointInPolygon,
    center,
    featureCollection,
    square,
    transformRotate,
    transformScale,
} from '@turf/turf'
import type { Grid } from './rectangleGrid'
import { rectangleGrid } from './rectangleGrid'
import type { Geometry } from 'geojson'

export function bboxRoof(roofShape: GeoJSONFeatureCollection): BBox {
    const bboxRoofShape = bbox(roofShape)
    return bbox(transformScale(bboxPolygon(square(bboxRoofShape)), 1.5))
}

/**
 * Generate grid on the shape of the roof
 * create grid on all the bbox of the roof, then rotate
 * exclude squares which are not entirely inside the roof shape
 */
export function generateRectangleGrid(
    roofShape: GeoJSONFeatureCollection,
    bboxOnRoof: BBox,
    roofSlope: number
  ): Grid {
    const roofAzimut = roofShape.features[0].properties?.azimuth
    const squareSize = 475
    const cellWidth = squareSize
    const cellHeight = squareSize * Math.cos(Number(roofSlope) * (Math.PI / 180))
  
    const { rows, columns, featureCollection } = rectangleGrid(
      bboxOnRoof,
      cellWidth,
      cellHeight,
      {
        units: 'millimeters',
      }
    )
    transformRotate(featureCollection, roofAzimut, { mutate: true })
    featureCollection.features.map(
      (f: Feature) => (f.properties!.center = center(f.geometry).geometry)
    )
    return { rows, columns, featureCollection: featureCollection }
}

export type Square = {
    usable: boolean
    squareCenter: Point
}
export type Matrix = Square[][]

export function filterGrid(roofShape: GeoJSONFeatureCollection, grid: Grid) {
    let x = 0,
      y = 0
    const matrix: Matrix = []
    const arrFeatures: Array<Feature<Geometry, Properties>> = []
    // @ts-ignore
    grid.featureCollection.features.forEach((f) => {
      let isInside: boolean = false
      const centerGridCase = center(f as AllGeoJSON)
      if (x == 0) {
        matrix[y] = []
      }
      for (const roofShapeFeature of roofShape.features) {
        if (
          booleanPointInPolygon(
            centerGridCase,
            roofShapeFeature.geometry as turfPolygon
          )
        ) {
          isInside = true
        }
      }
      if (isInside) {
        arrFeatures.push(f as Feature<Geometry, Properties>)
      }
  
      matrix[y][x] = {
        usable: isInside,
        squareCenter: centerGridCase.geometry,
      }
      y = (y + 1) % grid.rows
      if (y == 0) {
        x = (x + 1) % grid.columns
      }
    })
    // @ts-ignore
    grid.featureCollection = featureCollection(arrFeatures)
    return { grid, matrix }
}
  

export function getGridFormatted(
    // @ts-ignore
    roofShape, 
    // @ts-ignore
    roofSlope
) {
    let bboxOnRoof = bboxRoof(roofShape)
    let grid: Grid = generateRectangleGrid(roofShape, bboxOnRoof, roofSlope)
    let { grid: filterGeomGrid, matrix: gridMatrix } = filterGrid(
      roofShape,
      grid
    )
    return { 
        grid: filterGeomGrid, 
        matrix: gridMatrix,
        bboxOnRoof: bboxOnRoof
    }
}