import axios, { type Method } from "axios";
import proj4 from "proj4";

export async function getIrisCode(lat: string, lon: string) {
  const url = "https://public.sig.rennesmetropole.fr/geoserver/ows";

  proj4.defs(
    "EPSG:3948",
    "+proj=lcc +lat_0=48 +lon_0=3 +lat_1=47.25 +lat_2=48.75 +x_0=1700000 +y_0=7200000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
  );
  const cc48Coords = proj4(proj4.WGS84, "EPSG:3948", [
    parseFloat(lon),
    parseFloat(lat),
  ]);

  const config = {
    method: "get" as Method,
    url,
    params: {
      service: "wfs",
      request: "getFeature",
      typename: "dem_stats:iris",
      outputformat: "json",
      srs: "EPSG:4326",
      cql_filter:
        "INTERSECTS(shape, Point(" + cc48Coords[0] + " " + cc48Coords[1] + "))",
    },
    timeout: 20000, // 20 secondes
  };
  try {
    const response = await axios(config);
    if (
      response.data &&
      response.data.features.length > 0 &&
      response.data.features[0].properties &&
      response.data.features[0].properties.code_iris
    ) {
      return response.data.features[0].properties.code_iris;
    } else {
      return 0;
    }
  } catch (error: any) {
    throw new Error("Error get code iris: " + error.message);
  }
}
