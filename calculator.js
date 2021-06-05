const planets = require('./planets.json')

/**
 * NOTE: The values for Earth in planets.json don't relate to their real planetary values.
 * The values are approximated by brute forcing varibles.
 * The values found are 2% different from years 0-25 and 2.5% different from years 0-50.
 */

/**
 * Interpolate the coordinates of a planet or planets in the solar system.
 * @param {string|string[]|number|number[]} planet - The name or index of planet or planets in the solar system.
 * @param {date} [date] - The date of the planet locations.
 * @param {object} [properties] - Additional parameters.
 * @param {number} [properties.extend] - Added distance outwards from center.
 * @param {boolean} [properties.distance] - Whether to also return the distance of the satellite to the center.
 * @param {boolean} [properties.earthCalculator] - Use a higher precision calculator for Earth.
 * @returns {object} The coordinates of the planet.
 */
function orbitalCoordinates (planet, date = new Date(), properties) {
  const day = toEpoch(date)
  if (Array.isArray(planet)) {
    const planetCoordinates = []
    for (let i = 0; i < planet.length; i++) {
      const planetObj = planets[typeof (planet[i]) === 'string' ? planet[i].toLowerCase() : planet[i]]
      if (!planetObj) return null
      if (planetObj.special === 'earth' && (properties?.earthCalculator === undefined || properties?.earthCalculator === true)) planetCoordinates.push(earthCoordinates(day, properties))
      else planetCoordinates.push(orbitalCalculator(planetObj.n1, planetObj.n2, planetObj.i1, planetObj.i2, planetObj.w1, planetObj.w2, planetObj.a1, planetObj.a2, planetObj.e1, planetObj.e2, planetObj.m1, planetObj.m2, day, properties))
    }
    return planetCoordinates
  } else {
    const planetObj = planets[typeof (planet) === 'string' ? planet.toLowerCase() : planet]
    if (!planetObj) return null
    let planetCoordinates;
    console.log (planetObj.special === 'earth', properties?.earthCalculator === undefined, properties?.earthCalculator === true)
    if (planetObj.special === 'earth' && (properties?.earthCalculator === undefined || properties?.earthCalculator === true)) planetCoordinates = earthCoordinates(day, properties)
    else planetCoordinates = orbitalCalculator(planetObj.n1, planetObj.n2, planetObj.i1, planetObj.i2, planetObj.w1, planetObj.w2, planetObj.a1, planetObj.a2, planetObj.e1, planetObj.e2, planetObj.m1, planetObj.m2, day, properties)
    return planetCoordinates
  }
}

/**
 * Returns the coordinates of a satellite object by their orbital properties.
 * @param {number} n1 - Initial longitude of the ascending node.
 * @param {number} n2 - Change in longitude of the ascending node.
 * @param {number} i1 - Initial inclination to the ecliptic.
 * @param {number} i2 - Change in inclination to the ecliptic.
 * @param {number} w1 - Initial argument of perihelion.
 * @param {number} w2 - Change in argument of perihelion.
 * @param {number} a1 - Initial semi-major axis.
 * @param {number} a2 - Change in semi-major axis.
 * @param {number} e1 - Initial eccentricity.
 * @param {number} e2 - Change in eccentricity.
 * @param {number} m1 - Initial mean anomaly.
 * @param {number} m2 - Change in mean anomaly.
 * @param {date} [date] - The date of the planet locations.
 * @param {object} [properties] - Additional parameters.
 * @param {number} [properties.extend] - Added distance outwards from center.
 * @param {boolean} [properties.distance] - Whether to also return the distance of the satellite to the center.
 * @returns {object} The coordinates of the satellite.
 */
function orbitalCalculator (n1, n2, i1, i2, w1, w2, a1, a2, e1, e2, m1, m2, date, properties) {
  const conversionR2D = 180 / Math.PI
  const conversionD2R = Math.PI / 180
  const longitude = n1 + (n2 * date)
  const inclination = i1 + (i2 * date)
  const perihelion = w1 + (w2 * date)
  const distance = a1 + (a2 * date)
  let eccentricity = e1 + (e2 * date)
  if (eccentricity < 0) eccentricity = 0
  const anomaly = m1 + (m2 * date)
  const eccentricA = anomaly + (eccentricity * (conversionR2D)) * Math.sin((conversionD2R) * anomaly) * (1 + eccentricity * Math.cos((conversionD2R) * anomaly))
  const distanceX = distance * (Math.cos((conversionD2R) * eccentricA) - eccentricity)
  const distanceY = distance * (Math.sqrt(1 - (eccentricity ** 2)) * Math.sin((conversionD2R) * eccentricA))
  const trueAnomaly = Math.atan2(distanceY, distanceX) * (conversionR2D)
  let distanceInAU = Math.sqrt((distanceX ** 2) + (distanceY ** 2))
  if (properties?.extend) distanceInAU += properties.extend
  const coordinateX = distanceInAU * ((Math.cos((conversionD2R) * longitude) * Math.cos((conversionD2R) * (trueAnomaly + perihelion))) - (Math.sin((conversionD2R) * longitude) * Math.sin((conversionD2R) * (trueAnomaly + perihelion)) * Math.cos((conversionD2R) * inclination)))
  const coordinateY = distanceInAU * ((Math.sin((conversionD2R) * longitude) * Math.cos((conversionD2R) * (trueAnomaly + perihelion))) + (Math.cos((conversionD2R) * longitude) * Math.sin((conversionD2R) * (trueAnomaly + perihelion)) * Math.cos((conversionD2R) * inclination)))
  const coordinateZ = distanceInAU * (Math.sin((conversionD2R) * (trueAnomaly + perihelion)) * Math.sin((conversionD2R) * inclination))
  const coordinates = { x: coordinateX, y: coordinateY, z: coordinateZ }
  if (properties?.distance === true) coordinates.d = distanceInAU
  return coordinates
}

function earthCoordinates (d, properties) {
  d = d - 1.5
  const date = d / 36525.0
  const anomaly = 357.52910 + (35999.05030 * date) - (0.0001559 * date * date) - (0.00000048 * date * date * date)
  const center = (1.914600 - 0.004817 * date - 0.000014 * date * date) * Math.sin((Math.PI / 180) * anomaly) + (0.01993 - 0.000101 * date) * Math.sin((Math.PI / 180) * 2 * anomaly) + 0.000290 * Math.sin((Math.PI / 180) * 3 * anomaly)
  const ecliptical = (280.46645 + (36000.76983 * date) + (0.0003032 * date * date)) + center
  const eccentricity = 0.016708617 - date * (0.000042037 + (0.0000001236 * date))
  let distanceInAU = (1.000001018 * (1 - eccentricity * eccentricity)) / (1 + eccentricity * Math.cos((Math.PI / 180) * anomaly + center))
  if (properties?.extend) distanceInAU = distanceInAU + properties.extend
  const coordinateX = -distanceInAU * Math.cos((Math.PI / 180) * ecliptical)
  const coordinateY = -distanceInAU * Math.sin((Math.PI / 180) * ecliptical)
  const coordinateZ = 0
  const coordinates = { x: coordinateX, y: coordinateY, z: coordinateZ }
  if (properties?.distance === true) coordinates.d = distanceInAU
  return coordinates
}

function toEpoch (date) {
  return 1 + (date - Date.UTC(2000, 0, 1)) / (3600 * 24 * 1000)
}

module.exports = {
  orbitalCoordinates,
  orbitalCalculator
}
