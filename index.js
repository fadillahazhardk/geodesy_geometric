const corconv = require("./coordinateConverter");
const calc = require("./calculateSurfaceAreaOnEllipsoid");
const math = require("mathjs");
const convert = require("convert-units");

// //WGS 84
const a = 6378137; //meter
// const f = 1/298.257223563
const b = 6356752.3142; //meter
const e = Math.sqrt(math.pow(a, 2) - math.pow(b, 2)) / a;

// //Geo Coordinate
// const lat = 1;
// const lon = 1;
// const h = 1;

// //Kartesian Coordinate
// const X = 1;
// const Y = 1;
// const Z = 1;

// const N = calcRad.calcIrisanVerUtamaRad(lat);
// const M = calcRad.calcMeridianRad(lat);

// console.log(corconv.kartToGeoClosed(1,1,0, "bessel"))

//Data
const lat = -6.57995799; //deg
const lon = 107.875574; //deg
const h = 734.881; //meter
const kartcoord = corconv.geoToKartClosed(h, lat, lon, "wgs84");
const X = kartcoord.x;
const Y = kartcoord.y;
const Z = kartcoord.z;

console.log(corconv.kartToGeoIteratif(X, Y, Z, "bessel"));
