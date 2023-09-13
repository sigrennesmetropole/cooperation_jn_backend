import { getComputeData } from "./../services/api-autocalsol";
import { getIrisCode } from "./../services/api-iris";
import { getTotalDistrictDatas } from "./../services/api-enedis-district";
import { getPdfHtml } from "./PdfHtml";
import { Request } from "express";

export async function generateHTMLPdf(req: Request) {
  /* Get data autocalsol */
  let data_autocalsol;
  if (
    req.body.autocalsolResult === undefined ||
    req.body.autocalsolResult === null
  ) {
    try {
      data_autocalsol = await getComputeData(
        req.body.latitude,
        req.body.longitude,
        req.body.slope,
        req.body.azimuth,
        req.body.annual_consumption,
        req.body.peak_power,
      );
    } catch (error) {
      return null;
    }
  } else {
    data_autocalsol = req.body.autocalsolResult;
  }

  /* Get data district */
  let irisCode = await getIrisCode(
    req.body.latitude.toString(),
    req.body.longitude.toString(),
  );
  let districtDatas = null;
  if (irisCode !== null && irisCode != 0) {
    districtDatas = await getTotalDistrictDatas(irisCode);
  } else {
    irisCode = 0;
  }

  /* CREATE PDF */
  if (data_autocalsol === undefined || data_autocalsol === null) {
    return null;
  }

  // Your HTML content
  const html = await getPdfHtml(
    data_autocalsol,
    req.body.selectedRoof,
    req.body.address,
    req.body.annual_consumption,
    req.body.currentNumSolarPanel,
    req.body.peak_power,
    districtDatas === null ? 0 : districtDatas?.totalPhotovoltaicSites,
    districtDatas === null ? 0 : districtDatas?.totalProduction,
    req.body.roofImageBase64,
  );
  return html;
}
