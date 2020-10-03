//Nama : Fadillah Azhar Deaudin Kurniawan
//NIM : 15119066

const math = require("mathjs");
const convert = require("convert-units");
const calcRad = require("./calculateSurfaceAreaOnEllipsoid");
const { atan, cos } = require("mathjs");

//Metode tertutup dari geodetik ke kartesia3D
exports.geoToKartClosed = (h, lat, lon, ellipsoid) => {
  let a = null,
    b = null,
    N = null,
    e = null;

  if (ellipsoid === "wgs84") {
    a = 6378137; //meter
    b = 6356752.3142; //meter
    e = Math.sqrt(math.pow(a, 2) - math.pow(b, 2)) / a;
    N = calcRad.calcIrisanVerUtamaRad(lat, a, e);
  } else if (ellipsoid === "bessel") {
    a = 6377397.155;
    b = 6356078.963;
    e = Math.sqrt(math.pow(a, 2) - math.pow(b, 2)) / a;
    N = calcRad.calcIrisanVerUtamaRad(lat, a, e);
  }

  const x =
      (N + h) *
      math.cos(math.unit(lat, "deg")) *
      math.cos(math.unit(lon, "deg")),
    y =
      (N + h) *
      math.cos(math.unit(lat, "deg")) *
      math.sin(math.unit(lon, "deg")),
    z = (N * (1 - math.pow(e, 2)) + h) * math.sin(math.unit(lat, "deg"));
  return {
    message: `koordinatnya: ${x}, ${y}, ${z}`,
    x,
    y,
    z,
    e,
    N,
  };
};

//Metode tertutup/bowring dari kartesia3D ke geodetik
exports.kartToGeoClosed = (X, Y, Z, ellipsoid) => {
  //Data
  let a = null,
    b = null,
    e1 = null,
    e2 = null,
    theta = null;
  const p = math.sqrt(X ** 2 + Y ** 2);

  if (ellipsoid === "wgs84") {
    a = 6378137; //meter
    b = 6356752.3142; //meter
    e1 = Math.sqrt(math.pow(a, 2) - math.pow(b, 2)) / a;
    e2 = Math.sqrt(math.pow(a, 2) - math.pow(b, 2)) / b;
    theta = convert(math.atan2(Z * a, p * b))
      .from("rad")
      .to("deg");
  } else if (ellipsoid === "bessel") {
    a = 6377397.155;
    b = 6356078.963;
    e1 = Math.sqrt(math.pow(a, 2) - math.pow(b, 2)) / a;
    e2 = Math.sqrt(math.pow(a, 2) - math.pow(b, 2)) / b;
    theta = convert(math.atan2(Z * a, p * b))
      .from("rad")
      .to("deg");
  }

  //Calculate
  const lon = convert(math.atan2(Y, X)).from("rad").to("deg"); //we got radian unit

  const pembilangLat =
    Z + math.pow(e2, 2) * b * math.pow(math.sin(math.unit(theta, "deg")), 3);
  const penyebutLat =
    p - math.pow(e1, 2) * a * math.pow(math.cos(math.unit(theta, "deg")), 3);
  const lat = convert(math.atan2(pembilangLat, penyebutLat))
    .from("rad")
    .to("deg");

  const N = calcRad.calcIrisanVerUtamaRad(lat, a, e1);

  const h = p / math.cos(math.unit(lat, "deg")) - N;

  return {
    message: `koordinatnya: ${lat}, ${lon}, ${h}`,
    lat,
    lon,
    h,
    N,
    e1,
    e2,
    theta,
    p,
  };
};

//Metode iteratif dari kartesian3D ke geodetik
exports.kartToGeoIteratif = (X, Y, Z, ellipsoid) => {
  let a = null,
    b = null,
    e = null;

  if (ellipsoid === "wgs84") {
    a = 6378137; //meter
    b = 6356752.3142; //meter
    e = Math.sqrt(math.pow(a, 2) - math.pow(b, 2)) / a;
  } else if (ellipsoid === "bessel") {
    a = 6377397.155;
    b = 6356078.963;
    e = Math.sqrt(math.pow(a, 2) - math.pow(b, 2)) / a;
  }

  const p = math.sqrt(X ** 2 + Y ** 2);

  let h = 0,
    N = 1,
    lat = 0,
    latSebelum = 0;

  while (true) {
    let part = (math.pow(e, 2) * N) / (N + h),
      lat = convert(atan((Z / p) * math.pow(1 - part, -1)))
        .from("rad")
        .to("deg");
    N = calcRad.calcIrisanVerUtamaRad(lat, a, e);
    h = p / math.cos(math.unit(lat, "deg")) - N;
    if (latSebelum === lat) break
    latSebelum = lat
  }
  const lon = convert(math.atan2(Y, X)).from("rad").to("deg");
  
  return {
    message: `koordinatnya: ${latSebelum}, ${lon}, ${h}`,
    lat = latSebelum,
    lon,
    h,
  };
};
