const { toDecimal, geoToKartClosed } = require("./coordinateConverter")
const { atan, cos, unit, sin, sqrt, pow, atan2, pi, sec, abs, tan, format } = require("mathjs")
const convert = require("convert-units")
const { calcMeridianRad: M, calcIrisanVerUtamaRad: N } = require("./calculateSurfaceAreaOnEllipsoid")
const formatcoord = require("formatcoords")
const latBandung = toDecimal("-6*55*3.19")
const lonBandung = toDecimal("107*37*8.82")
const hBandung = 0
const latCianjur = toDecimal("-6*49*1.21")
const lonCianjur = toDecimal("107*8*33.29")
const hCianjur = 0

const toposentricMethod = (φ1, λ1, h1, φ2, λ2, h2) => {
    const kartesian1 = geoToKartClosed(h1, φ1, λ1)
    const kartesian2 = geoToKartClosed(h2, φ2, λ2)

    //α12
    const sinφ1 = sin(unit(φ1, "deg"));
    const cosφ1 = cos(unit(φ1, "deg"));
    const sinλ1 = sin(unit(λ1, "deg"));
    const cosλ1 = cos(unit(λ1, "deg"));
    const ΔX = kartesian2.x - kartesian1.x
    const ΔY = kartesian2.y - kartesian1.y
    const ΔZ = kartesian2.z - kartesian2.z
    let α12 = atan2(-ΔX * sinλ1 + ΔY * cosλ1, -ΔX * sinφ1 * cosλ1 - ΔY * sinφ1 * sinλ1 + ΔZ * cosφ1)
    α12 = convert(α12).from("rad").to("deg") + 360
    //d12
    const d12 = pow(ΔX ** 2 + ΔY ** 2 + ΔZ ** 2, 0.5)
    //m12
    const m12 = atan2(ΔX * cosφ1 * cosλ1 + ΔY * cosφ1 * sinλ1 + ΔZ * sinφ1, d12)
    return ({
        α12: formatcoord(α12).format(),
        d12,
        m12: formatcoord(convert(m12).from("rad").to("deg")).format(),
    })
}

// console.log(toposentricMethod(latBandung, lonBandung, hBandung, latCianjur, lonCianjur, hCianjur))

const puissantMethod = (φ1, λ1, h1, φ2, λ2, h2) => {
    //WGS84 Parameter
    const a = 6378137; //meter
    const b = 6356752.3142; //meter
    const e = sqrt(pow(a, 2) - pow(b, 2)) / a;

    //M and N Radii
    const M1 = M(φ1, a, e), N1 = N(φ1, a, e);
    const M2 = M(φ2, a, e), N2 = N(φ2, a, e);

    const Δφ = convert(φ2 - φ1).from("deg").to("rad"), Δλ = convert(λ2 - λ1).from("deg").to("rad");
    const cosφ2 = cos(unit(φ2, "deg"));
    const sinφ1 = sin(unit(φ1, "deg"));
    const cosφ1 = cos(unit(φ1, "deg"));
    const sin2φ1 = sin(unit(2 * φ1, "deg"));
    const φm = (φ1 + φ2) / 2
    const sinφm = sin(unit(φm, "deg"))

    //α12
    const A = N2 * Δλ * cosφ2 / (M1 * Δφ)
    const B = 1 - (3 * pow(e, 2) * sin2φ1 / (4 * (1 - pow(e, 2) * pow(sinφ1, 2))))
    let α12 = atan2(A, 1 / B)

    //α21
    const secHalfΔφ = sec(unit(0.5 * Δφ, "rad"))
    const C = Δλ * sinφm * secHalfΔφ
    const D = sinφm * secHalfΔφ
    const E = pow(sinφm, 3) * pow(secHalfΔφ, 2)
    const F = D - E
    const G = pow(Δλ, 3) * F / 12
    let α21 = C + G + α12 + pi

    //s12
    const cosα12 = cos(unit(α12, "rad"))
    const sinα12 = sin(unit(α12, "deg"))
    const Z = 1 - (3 * pow(e, 2) * sin2φ1 * Δφ / (4 * (1 - pow(e, 2) * pow(sinφ1, 2))))
    const s12 = Δφ / cosα12 * (M1 / Z)


    console.log({
        Δφ,
        Δλ,
        M1,
        cosα12,
        sinφ1,
        sin2φ1,
        α12: formatcoord(α12 < 0 ? convert(α12).from("rad").to("deg") + 360 : convert(α12).from("rad").to("deg")).format(),
        s12,
        α21: formatcoord(convert(α21).from("rad").to("deg")).format(),
    })
}

const vincentyMethod = (λ1, φ1, λ2, φ2) => {
    //ellipsoid data
    const a = 6378137; //meter
    const b = 6356752.3142; //meter
    const e = sqrt(pow(a, 2) - pow(b, 2)) / a;
    const f = (a - b) / 1

    const L = λ2 - λ1;
    const tanU1 = (1 - f) * tan(φ1), cosU1 = 1 / sqrt((1 + tanU1 * tanU1)), sinU1 = tanU1 * cosU1;
    const tanU2 = (1 - f) * tan(φ2), cosU2 = 1 / sqrt((1 + tanU2 * tanU2)), sinU2 = tanU2 * cosU2;

    let λ = L, iterationLimit = 100;
    let λʹ;
    do {
        const sinλ = sin(λ), cosλ = cos(λ);
        const sinSqσ = (cosU2 * sinλ) * (cosU2 * sinλ) + (cosU1 * sinU2 - sinU1 * cosU2 * cosλ) * (cosU1 * sinU2 - sinU1 * cosU2 * cosλ);
        const sinσ = sqrt(sinSqσ);
        if (sinσ == 0) return 0;  // co-incident points
        const cosσ = sinU1 * sinU2 + cosU1 * cosU2 * cosλ;
        const σ = atan2(sinσ, cosσ);
        const sinα = cosU1 * cosU2 * sinλ / sinσ;
        const cosSqα = 1 - sinα * sinα;
        const cos2σM = cosσ - 2 * sinU1 * sinU2 / cosSqα;
        if (isNaN(cos2σM)) cos2σM = 0;  // equatorial line: cosSqα=0 (§6)
        const C = f / 16 * cosSqα * (4 + f * (4 - 3 * cosSqα));
        λʹ = λ;
        λ = L + (1 - C) * f * sinα * (σ + C * sinσ * (cos2σM + C * cosσ * (-1 + 2 * cos2σM * cos2σM)));
    } while (abs(λ - λʹ) > 1e-12 && --iterationLimit > 0);
    // if (iterationLimit == 0) throw new Error('Formula failed to converge');

    const uSq = cosSqα * (a * a - b * b) / (b * b);
    const A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
    const B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
    const Δσ = B * sinσ * (cos2σM + B / 4 * (cosσ * (-1 + 2 * cos2σM * cos2σM) -
        B / 6 * cos2σM * (-3 + 4 * sinσ * sinσ) * (-3 + 4 * cos2σM * cos2σM)));

    const s = b * A * (σ - Δσ);

    const fwdAz = atan2(cosU2 * sinλ, cosU1 * sinU2 - sinU1 * cosU2 * cosλ);
    const revAz = atan2(cosU1 * sinλ, -sinU1 * cosU2 + cosU1 * sinU2 * cosλ);

    console.log({
        s,
        fwdAz,
        revAz
    })
}

//N2 * (lat2 - lat1) * cos(unit(lat2, "deg") * (1 - (3 * (e ** 2) * sin(unit(lat1 * 2, "deg") / 4 * (1 - (e**2) * (sin(unit(lat1, "deg")) ** 2) )))) / M1 * (lon2 - lon1))

// vincentyMethod(latBandung, lonBandung, latCianjur, lonCianjur)
puissantMethod(latBandung, lonBandung, hBandung, latCianjur, lonCianjur, hBandung)