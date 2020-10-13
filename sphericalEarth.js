const math = require("mathjs");
const convert = require("convert-units");
const { atan, tan, cos, sin, acos, asin } = require("mathjs");

exports.calcArcLength = (theta, R = 6371) => {
  return theta * R;
};

//Segitiga Bola
exports.calcArea = (eksesferis, R = 6371) => {
  return eksesferis * R ** 2;
};

exports.calcEksesferis = (a, b, c) => {
  const s = (a + b + c) / 2;
  const L =
    (tan(s / 2) * tan((s - a) / 2) * tan((s - b) / 2) * tan((s - c) / 2)) **
    0.5;
  const e = 4 * atan(20);
  return e;
};

exports.calcCosRule = (b, c, alpha) => {
  b = convert(b).from("deg").to("rad");
  c = convert(c).from("deg").to("rad");
  alpha = convert(alpha).from("deg").to("rad");

  const cosa = cos(b) * cos(c) + sin(b) * sin(c) * cos(alpha);

  const a = convert(acos(cosa)).from("rad").to("deg");
  const arad = acos(cosa);

  const aInM = arad * 6371;

  return {
    a,
    arad,
    aInM,
    cosa,
    b,
    c,
    alpha,
  };
};

exports.calcSinRule = (b, c, gama) => {
  b = convert(b).from("deg").to("rad");
  c = convert(c).from("deg").to("rad");
  gama = convert(gama).from("deg").to("rad");
  
  const sinBeta = (sin(b) * sin(c)) / sin(gama);

  const beta = convert(asin(sinBeta)).from("rad").to("deg");
  const betaRad = asin(sinBeta);

  return {
    beta,
    betaRad,
    sinBeta,
  };
};
