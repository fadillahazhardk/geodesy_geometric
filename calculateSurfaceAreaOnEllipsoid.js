const math = require("mathjs");
var convert = require("convert-units");

//WGS 84
const a = 6378137; //meter
const b = 6356752.3142; //meter
const e = Math.sqrt(math.pow(a, 2) - math.pow(b, 2)) / a;

const calcMeridianRad = (lat) => {
    latInRad = convert(lat).from("deg")
  const pembilang = a * (1 - math.pow(e, 2));
  const penyebut = math.pow(
    1 - math.pow(e, 2) * math.pow(math.sin(lat), 2),
    1.5
  );
  return pembilang / penyebut;
};
const calcIrisanVerUtamaRad = (lat) => {
  const pembilang = a;
  const penyebut = math.pow(
    1 - math.pow(e, 2) * math.pow(math.sin(lat), 2),
    0.5
  );
  return pembilang / penyebut;
};
// console.log(calcMeridianRad());
const calcEllipsoidSurface = (obj) => {
  const cntrLat = (obj.lat1 + obj.lat2) / 2;
  const difLat = obj.lat2 - obj.lat1;
  const difLon = obj.lon2 - obj.lon1;

  const Mi = calcMeridianRad(cntrLat);
  const Ni = calcIrisanVerUtamaRad(cntrLat);

  const L = Mi * Ni * math.cos(cntrLat) * difLat * difLon;
  return L;
};

console.log(
  convert(
    calcEllipsoidSurface({
      lat1: 0.0362777778 * math.pi,
      lat2: 0.0363333333 * math.pi,
      lon1: 0.5965 * math.pi,
      lon2: 0.596555556 * math.pi,
    })
  )
    .from("m2")
    .to("km2")
);
