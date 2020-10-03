//Nama : Fadillah Azhar Deaudin Kurniawan
//NIM : 15119066

//Script to calculate length in meridian

const math = require("mathjs");
var convert = require("convert-units");

//Data Lintang pada Bujur yang sama
const L1r = 0.0625613612 * math.pi;
const L2r = 0.0264137058 * math.pi;
const L1 = math.unit(
  convert(L1r)
    .from("rad")
    .to("deg"),
  "deg"
).value; //LS
const L2 = math.unit(
  convert(L2r)
    .from("rad")
    .to("deg"),
  "deg"
).value; //LU

//WGS 84
const a = 6378137; //meter
const b = 6356752.3142; //meter
const e = Math.sqrt(math.pow(a, 2) - math.pow(b, 2)) / a;
// console.log(e);

//Bessel
const aB = 6377397.155;
const bB = 6356078.963;
const eB = Math.sqrt(math.pow(aB, 2) - math.pow(bB, 2)) / a;

//A,B, and C Constant
const A =
  1 +
  (3 * math.pow(e, 2)) / 4 +
  (45 * math.pow(e, 4)) / 64 +
  (175 * math.pow(e, 6)) / 256;
const B =
  (3 * math.pow(e, 2)) / 4 +
  (15 * math.pow(e, 4)) / 16 +
  (525 * math.pow(e, 6)) / 512;
const C =
  (15 * math.pow(e, 4)) / 64 +
  (105 * math.pow(e, 6)) / 256 +
  (2205 * math.pow(e, 8)) / 4096;
// console.log(C)

const calculateMeridianLength = (method = "wgs84") => {
  let Part1 = a * (1 - math.pow(e, 2));

  if (method === "bessel") {
    Part1 = aB * (1 - math.pow(eB, 2));
  }

  const LSPart2 =
    A * L1 - (B / 2) * math.sin(2 * L1) + (C / 4) * math.sin(4 * L1);
  const LS = Part1 * LSPart2;

  const LUPart2 =
    A * L2 - (B / 2) * math.sin(2 * L2) + (C / 4) * math.sin(4 * L2);
  const LU = Part1 * LUPart2;

  const total = LU + LS;
  return total;
};

console.log(
  `menggunakan metode bessel jarak dari titik 1 ke titik 2 adalah ${calculateMeridianLength(
    "bessel"
  )} m = ${convert(calculateMeridianLength("bessel")).from("m").to("km")} km`
);
console.log(
  `menggunakan metode wgs84 jarak dari titik 1 ke titik 2 adalah ${calculateMeridianLength()} m = ${convert(
    calculateMeridianLength()
  )
    .from("m")
    .to("km")} km`
);
console.log(
  "selisih kedua metode: " +
    (calculateMeridianLength() - calculateMeridianLength("bessel")) +
    " m"
);