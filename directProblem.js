const convert = require("convert-units")
const formatcoords = require("formatcoords")
const { cos, unit, sin, pow, sec, abs, tan, sqrt } = require("mathjs")
const { calcMeridianRad: M, calcIrisanVerUtamaRad: N } = require("./calculateSurfaceAreaOnEllipsoid")
const { toDecimal } = require("./coordinateConverter")

const latBandung = toDecimal("-6*55*3.19")
const lonBandung = toDecimal("107*37*8.82")
const hBandung = 0
const latCianjur = toDecimal("-6*49*1.21")
const lonCianjur = toDecimal("107*8*33.29")
const hCianjur = 0

const puissantMethod = (φ1, λ1, s12, α12) => {
    //Init
    let φ2;
    let λ2;

    //WGS84 Parameter
    const a = 6378137; //meter
    const b = 6356752.3142; //meter
    const e = sqrt(pow(a, 2) - pow(b, 2)) / a;

    //M and N Radii
    const M1 = M(φ1, a, e), N1 = N(φ1, a, e);

    //Latitude φ2
    const cosα12 = cos(unit(α12, "deg"))
    const sinα12 = sin(unit(α12, "deg"))
    const tanφ1 = tan(unit(φ1, "deg"))
    const sin2φ1 = sin(unit(2 * φ1, "deg"))
    const sinφ1 = sin(unit(φ1, "deg"))

    const A = s12 * cosα12 / N1
    const B = pow(s12, 2) * tanφ1 * pow(sinα12, 2) / (2 * pow(N1, 2))
    const C = pow(s12, 3) * cosα12 * pow(sinα12, 2) * (1 + 3 * pow(tanφ1, 2)) / (6 * pow(N1, 3))
    let Δφ = A - B - C //K=0

    let Δφʹ;
    let D, E, F, G;
    do { //Iterate
        Δφʹ = Δφ
        
        D = s12 * cosα12 / M1
        E = pow(s12, 2) * tanφ1 * pow(sinα12, 2) / (2 * M1 * N1)
        F = pow(s12, 3) * cosα12 * pow(sinα12, 2) * (1 + 3 * pow(tanφ1, 2)) / (6 * M1 * pow(N1, 2))
        G = 1 - 3 * pow(e, 2) * sin2φ1 * Δφʹ / (2 * (1 - pow(e, 2) * pow(sinφ1, 2)))

        Δφ = (D - E - F) * G
        console.log(Δφʹ, Δφ)
    } while (abs(Δφ - Δφʹ) > 0)

    φ2 = φ1 + convert(Δφ).from("rad").to("deg")

    //Longitude λ2
    const secφ2 = sec(unit(φ2, "deg"))
    const N2 = N(φ2, a, e);

    Δλ = s12 * sinα12 * secφ2 / N2 * (1 - pow(s12, 2) / (6 * pow(N2, 2)) * (1 - pow(sinα12, 2) * pow(secφ2, 2)))
    λ2 = λ1 + convert(Δλ).from("rad").to("deg")

    return {
        A,
        B,
        C,
        D,
        E,
        F,
        G,
        N1,
        M1,
        cosα12,
        φ2: formatcoords(φ2).format(),
        λ2: formatcoords(λ2).format(),
        sinα12,
        tanφ1,
        sin2φ1,
        sinφ1
    }
}

console.log(puissantMethod(latBandung, lonBandung, 53897.90588535295, 281.9063727765557))
