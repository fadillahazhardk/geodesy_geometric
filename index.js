const corconv = require("./coordinateConverter");

//Soal Nomor 1
//Koordinat Titik Q di sistem koordinat geodetik dengan referensi WGS84
// const lat = -6.57995799; //deg
// const lon = 107.875574; //deg
// const h = 734.881; //meter

// //Koordinat titik Q di kartesian3D
// const kartcoord = corconv.geoToKartClosed(h, lat, lon, "wgs84");
// const X = kartcoord.x;
// const Y = kartcoord.y;
// const Z = kartcoord.z;

// //Koordinat Titik Q di sistem koordinat geodetik dengan referensi Bessel 1841
// const coordOnBessel = corconv.kartToGeoClosed(X, Y, Z, "bessel");
// const latBessel = coordOnBessel.lat;
// const lonBessel = coordOnBessel.lon;
// const hBessel = coordOnBessel.h;

// const coordOnBessel2 = corconv.kartToGeoIteratif(X, Y, Z, "bessel");
// const latBessel2 = coordOnBessel2.lat;
// const lonBessel2 = coordOnBessel2.lon;
// const hBessel2 = coordOnBessel2.h;

// console.log(`
//     SOAL NOMOR SATU
//     Koordinat titik Q di WGS84: lat = ${lat}; lon = ${lon}; h = ${h}.

//     1. Pendekatan dengan formula tertutup
//     Koodinat titik Q di Bessel1841: lat = ${latBessel}; lon = ${lonBessel}; h = ${hBessel}.

//     2. Pendekatan dengan formula iteratif
//     Koodinat titik Q di Bessel1841: lat = ${latBessel2}; lon = ${lonBessel2}; h = ${hBessel2}.
// `);

// Soal Nomor 2
// Koordinat Titik Q di sistem koordinat geodetik dengan referensi GRS80
const lat = -6.579958; //deg
const lon = 107.8756; //deg
const h = 734.881; //meter

const kartcoord = corconv.geoToKartClosed(h, lat, lon, "grs80");
const X = kartcoord.x + 1;
const Y = kartcoord.y - 2;
const Z = kartcoord.z + 2;

const coordOnGRS80 = corconv.kartToGeoClosed(X, Y, Z, "grs80");
const lat1 = coordOnGRS80.lat;
const lon1 = coordOnGRS80.lon;
const h1 = coordOnGRS80.h;

const coordOnGRS802 = corconv.kartToGeoIteratif(X, Y, Z, "grs80");
const lat2 = coordOnGRS802.lat;
const lon2 = coordOnGRS802.lon;
const h2 = coordOnGRS802.h;

console.log(`
    SOAL NOMOR DUA

    Koordinat titik Q di GRS80: lat = ${lat}; lon = ${lon}; h = ${h}.
    Koordinat titik Q di Kartesian3D pertama: X = ${X - 1}; Y = ${Y + 2}; Z = ${
  Z - 2
}.  
    Koordinat titik Q di Kartesian3D kedua: X = ${X}; Y = ${Y}; Z = ${Z}.

    1. Pendekatan dengan cara formula tertutup
    Koodinat titik Q di GRS80: lat = ${lat1}; lon = ${lon1}; h = ${h1}.

    2. Pendekatan dengan cara formula iteratif
    Koodinat titik Q di GRS80: lat = ${lat2}; lon = ${lon2}; h = ${h2}.
`);

// Soal Nomor 3
// Koordinat Titik P di sistem koordinat geodetik dengan referensi WGS84
// const lat = -6.579958;
// const lon = 107.8756;
// const h = 734.881;

// const kartcoord = corconv.geoToKartClosed(h, lat, lon, "wgs84");
// const X = kartcoord.x - 1577.302;
// const Y = kartcoord.y + 32.484;
// const Z = kartcoord.z + 53.056;

// const coordOnWGS = corconv.kartToGeoClosed(X, Y, Z, "wgs84");
// const latQ = coordOnWGS.lat;
// const lonQ = coordOnWGS.lon;
// const hQ = coordOnWGS.h;

// const coordOnWGS2 = corconv.kartToGeoIteratif(X, Y, Z, "wgs84");
// const latQ2 = coordOnWGS2.lat;
// const lonQ2 = coordOnWGS2.lon;
// const hQ2 = coordOnWGS2.h;

// console.log(`
//     SOAL NOMOR TIGA
//     Koordinat titik P di GWS84: lat = ${lat}; lon = ${lon}; h = ${h}.

//     1. Pendekatan Closed
//     Koodinat titik P di WGS84: lat = ${latQ}; lon = ${lonQ}; h = ${hQ}.
//     Koordinat titik P di Kartesian3D: X = ${X - 1577.302}; Y = ${Y + 32.484}; Z = ${Z - 53.056}.

//     2. Pendekatan Iteratif
//     Koodinat titik Q di WGS84: lat = ${latQ2}; lon = ${lonQ2}; h = ${hQ2}.
//     Koordinat titik Q di Kartesian3D kedua: X = ${X}; Y = ${Y}; Z = ${Z}.
// `);
