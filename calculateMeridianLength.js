//Script to calculate length in meridian

const math = require("mathjs");
const convert = require("convert-units");

exports.calcMeridianLength = (lat1, lat2, ellipsoid) => {
  let a = null,
    b = null;

  if (ellipsoid === "wgs84") {
    a = 6378137; //meter
    b = 6356752.3142; //meter
  } else if (ellipsoid === "bessel") {
    a = 6377397.155;
    b = 6356078.963;
  } else if (ellipsoid === "grs80") {
    a = 6378137;
    b = 6356752.314140347;
  }

  const e = Math.sqrt(math.pow(a, 2) - math.pow(b, 2)) / a;

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

  //Calc
  const Part1 = a * (1 - math.pow(e, 2));

  const LSPart2 =
    A * convert(lat1).from("deg").to("rad") -
    (B / 2) * math.sin(2 * math.unit(lat1, "deg").value) +
    (C / 4) * math.sin(4 * math.unit(lat1, "deg").value);
  const LS = Part1 * LSPart2;

  const LUPart2 =
    A * convert(lat2).from("deg").to("rad") -
    (B / 2) * math.sin(2 * math.unit(lat2, "deg").value) +
    (C / 4) * math.sin(4 * math.unit(lat2, "deg").value);
  const LU = Part1 * LUPart2;

  const total = LU + LS;

  return {
    total,
    LUTOEQ: LU,
    LSTOEQ: LS,
    A,
    B,
    C,
    e
  };
};
