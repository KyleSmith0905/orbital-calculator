# Orbital Calculator
A light-weight calculator to approximate the values of celestial objects. NOTE: The values for Earth in planets.json don't relate to their real planetary values. The values are approximated by brute forcing different variables. Calculations default to a seperate function that calculate Earth's coordinates.

# Install
(Not yet added)

# Usage
```js
const orbCalc = require('orbital-calculator')

// Output truncated for better reading
orbCalc.orbitalCoordinates('earth') //=> {x: -0.2545, y: -0.9829, z: 0}
orbCalc.orbitalCoordinates('venus') //=> {x: -0.3704, y: 0.6149, z: 0.0296}
orbCalc.orbitalCoordinates('mars', new Date('2012/03/20')) //=>{x: -1.6386,y: 0.2646,z: 0.0458}
```

# Resources
Calculations and planetery properties by https://stjarnhimlen.se/comp/ppcomp.html by Paul Schlyter.
Inspitation and implementation by http://cosinekitty.com/solar_system.html by Cosine Kitty.
