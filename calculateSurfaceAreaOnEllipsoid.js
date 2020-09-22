const math = require("mathjs");
var convert = require("convert-units");

//Konversi degree, minute to degree decimal
const dmToDeg = (val) => {
  const degCoef = 1 / 60;
  const min = val - math.floor(val);
  const deg = val - min;
  return deg + min * 100 * degCoef;
};

//WGS 84
const a = 6378137; //meter
const b = 6356752.3142; //meter
const e = Math.sqrt(math.pow(a, 2) - math.pow(b, 2)) / a;

//Perhitungan
const calcMeridianRad = (lat) => {
  const pembilang = a * (1 - math.pow(e, 2));
  const penyebut = math.pow(
    1 - math.pow(e, 2) * math.pow(math.sin(math.unit(lat, "deg")), 2),
    1.5
  );
  return pembilang / penyebut;
};
const calcIrisanVerUtamaRad = (lat) => {
  const pembilang = a;
  const penyebut = math.pow(
    1 - math.pow(e, 2) * math.pow(math.sin(math.unit(lat, "deg")), 2),
    0.5
  );
  return pembilang / penyebut;
};
const calcEllipsoidSurface = (arr) => {
  let L = null;
  arr.forEach((obj) => {
    const lat1 = dmToDeg(obj.lat1);
    const lat2 = dmToDeg(obj.lat2);
    const lon1 = dmToDeg(obj.lon1);
    const lon2 = dmToDeg(obj.lon2);
    const cntrLat = (lat1 + lat2) / 2;
    const difLat = convert(lat2 - lat1)
      .from("deg")
      .to("rad");
    const difLon = convert(lon2 - lon1)
      .from("deg")
      .to("rad");

    const Mi = calcMeridianRad(cntrLat);
    const Ni = calcIrisanVerUtamaRad(cntrLat);

    L += Mi * Ni * math.cos(math.unit(cntrLat, "deg")) * difLat * difLon;
  });
  return L;
};

// DATA GRID
const data = [
  { lat1: 6.51, lat2: 6.52, lon1: 107.35, lon2: 107.36 },
  { lat1: 6.52, lat2: 6.53, lon1: 107.35, lon2: 107.36 },
  { lat1: 6.52, lat2: 6.53, lon1: 107.36, lon2: 107.37 },
  { lat1: 6.52, lat2: 6.53, lon1: 107.37, lon2: 107.38 },
  { lat1: 6.53, lat2: 6.54, lon1: 107.35, lon2: 107.36 },
  { lat1: 6.53, lat2: 6.54, lon1: 107.36, lon2: 107.37 },
  { lat1: 6.53, lat2: 6.54, lon1: 107.37, lon2: 107.38 },
  { lat1: 6.54, lat2: 6.55, lon1: 107.34, lon2: 107.35 },
  { lat1: 6.54, lat2: 6.55, lon1: 107.35, lon2: 107.36 },
  { lat1: 6.54, lat2: 6.55, lon1: 107.36, lon2: 107.37 },
  { lat1: 6.54, lat2: 6.55, lon1: 107.37, lon2: 107.38 },
  { lat1: 6.54, lat2: 6.55, lon1: 107.38, lon2: 107.39 },
  { lat1: 6.54, lat2: 6.55, lon1: 107.39, lon2: 107.4 },
  { lat1: 6.54, lat2: 6.55, lon1: 107.4, lon2: 107.41 },
  { lat1: 6.54, lat2: 6.55, lon1: 107.41, lon2: 107.42 },
  { lat1: 6.54, lat2: 6.55, lon1: 107.42, lon2: 107.43 },
  { lat1: 6.54, lat2: 6.55, lon1: 107.43, lon2: 107.44 },
  { lat1: 6.55, lat2: 6.56, lon1: 107.34, lon2: 107.35 },
  { lat1: 6.55, lat2: 6.56, lon1: 107.35, lon2: 107.36 },
  { lat1: 6.55, lat2: 6.56, lon1: 107.37, lon2: 107.38 },
  { lat1: 6.55, lat2: 6.56, lon1: 107.38, lon2: 107.39 },
  { lat1: 6.55, lat2: 6.56, lon1: 107.39, lon2: 107.4 },
  { lat1: 6.55, lat2: 6.56, lon1: 107.4, lon2: 107.41 },
  { lat1: 6.55, lat2: 6.56, lon1: 107.41, lon2: 107.42 },
  { lat1: 6.55, lat2: 6.56, lon1: 107.42, lon2: 107.43 },
  { lat1: 6.56, lat2: 6.57, lon1: 107.34, lon2: 107.35 },
  { lat1: 6.56, lat2: 6.57, lon1: 107.35, lon2: 107.36 },
  { lat1: 6.56, lat2: 6.57, lon1: 107.36, lon2: 107.37 },
  { lat1: 6.56, lat2: 6.57, lon1: 107.37, lon2: 107.38 },
  { lat1: 6.56, lat2: 6.57, lon1: 107.38, lon2: 107.39 },
  { lat1: 6.56, lat2: 6.57, lon1: 107.39, lon2: 107.4 },
  { lat1: 6.56, lat2: 6.57, lon1: 107.4, lon2: 107.41 },
  { lat1: 6.57, lat2: 6.58, lon1: 107.38, lon2: 107.39 },
  { lat1: 6.57, lat2: 6.58, lon1: 107.39, lon2: 107.4 },
  { lat1: 6.57, lat2: 6.58, lon1: 107.4, lon2: 107.41 },
  { lat1: 6.57, lat2: 6.58, lon1: 107.35, lon2: 107.36 },
  { lat1: 6.57, lat2: 6.58, lon1: 107.36, lon2: 107.37 },
  { lat1: 6.57, lat2: 6.58, lon1: 107.37, lon2: 107.38 },
  { lat1: 6.53, lat2: 6.54, lon1: 107.34, lon2: 107.35 },
  { lat1: 6.56, lat2: 6.57, lon1: 107.41, lon2: 107.42 },
  { lat1: 6.56, lat2: 6.57, lon1: 107.42, lon2: 107.43 },
];
const dataSetengah = [
  { lat1: 6.52, lat2: 6.53, lon1: 107.34, lon2: 107.35 },
  { lat1: 6.53, lat2: 6.54, lon1: 107.38, lon2: 107.39 },
  { lat1: 6.53, lat2: 6.54, lon1: 107.39, lon2: 107.4 },
  { lat1: 6.53, lat2: 6.54, lon1: 107.4, lon2: 107.41 },
  { lat1: 6.54, lat2: 6.55, lon1: 107.34, lon2: 107.35 },
  { lat1: 6.55, lat2: 6.56, lon1: 107.43, lon2: 107.44 },
  { lat1: 6.56, lat2: 6.57, lon1: 107.33, lon2: 107.34 },
  { lat1: 6.57, lat2: 6.58, lon1: 107.41, lon2: 107.42 },
  { lat1: 6.5, lat2: 6.51, lon1: 107.35, lon2: 107.36 },
  { lat1: 6.51, lat2: 6.52, lon1: 107.34, lon2: 107.35 },
  { lat1: 6.53, lat2: 6.54, lon1: 107.33, lon2: 107.34 },
  { lat1: 6.53, lat2: 6.54, lon1: 107.41, lon2: 107.42 },
  { lat1: 6.53, lat2: 6.54, lon1: 107.42, lon2: 107.43 },
  { lat1: 6.53, lat2: 6.54, lon1: 107.43, lon2: 107.44 },
  { lat1: 6.53, lat2: 6.54, lon1: 107.44, lon2: 107.45 },
  { lat1: 6.54, lat2: 6.55, lon1: 107.33, lon2: 107.34 },
  { lat1: 6.54, lat2: 6.55, lon1: 107.44, lon2: 107.45 },
  { lat1: 6.55, lat2: 6.56, lon1: 107.33, lon2: 107.34 },
  { lat1: 6.56, lat2: 6.57, lon1: 107.43, lon2: 107.44 },
  { lat1: 6.57, lat2: 6.58, lon1: 107.33, lon2: 107.34 },
  { lat1: 6.57, lat2: 6.58, lon1: 107.34, lon2: 107.35 },
];
const fullArea = calcEllipsoidSurface(data);
const halfArea = calcEllipsoidSurface(dataSetengah) * 0.5;
const totalArea = fullArea + halfArea;

//PrintOut
console.log("luas wilayah bandung adalah: " + totalArea + " m2");
console.log(
  "jika dinyatakan dalam kilometer: " +
    convert(totalArea).from("m2").to("km2") +
    " km2"
);
