const math = require("mathjs");
var convert = require("convert-units");

//Data
// max val = 60
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
  console.log(L);
  return L;
};

console.log(
  convert(
    calcEllipsoidSurface([
      {
        lat1: 6.54,
        lat2: 6.55,
        lon1: 107.38,
        lon2: 107.39,
      },
    ])
  )
    .from("m2")
    .to("km2")
);
