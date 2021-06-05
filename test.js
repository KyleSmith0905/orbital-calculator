const calculator = require('./calculator')
const planets = require('./planets.json')

// https://stjarnhimlen.se/comp/tutorial.html

// Match tabulated information
const planetNames = Object.keys(planets)
const planetCoordinateArray = []
for (let i = 0; i < planetNames.length; i++) {
  planetCoordinateArray.push(calculator.orbitalCoordinates(planetNames[i]))
}
console.table(planetCoordinateArray)
console.log('Compare with http://cosinekitty.com/astronomy.js')

// Should all output True (If algorithms become more precise, values may slightly change)
console.log(calculator.orbitalCoordinates('eart') == null)
console.log(calculator.orbitalCoordinates('earth', new Date('2010/06/15')).x.toFixed(3) === '-0.107')
console.log(calculator.orbitalCoordinates([[], [], []]) == null)
console.log(calculator.orbitalCoordinates(['Hello', 'World']) == null)
console.log(calculator.orbitalCoordinates(['jupiter', 'eaRth', 'SATURN', 'earth', 'jupiter', 'earth', 'earTH', 'earth', 'EARth', 'earth', 'JUPITEr', 'earth']).length === 12)
console.log(calculator.orbitalCalculator(25, 0, 0, 0, 30, 0, 1, 0, 0, 0, 100, 0, new Date('2015/02/25')).y.toFixed(3) === '0.423')
console.log(calculator.orbitalCoordinates('earth', new Date('2005/12/1'), { extend: 4, distance: true }).d.toFixed(3) === '5.001')
console.log(calculator.orbitalCoordinates('earth', new Date()) !== calculator.orbitalCoordinates('earth', new Date(), { earthCalculator: false }))
