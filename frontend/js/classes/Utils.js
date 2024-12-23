const SCREEN = {
  width: 3556, //(2000 * 16) / 9,
  height: 2000
}

class Utils {
  static degToRad(deg) {
    return deg * (Math.PI / 180)
  }
  static getRandomInt(max) {
    return Math.floor(Math.random() * max)
  }

  static getRandomColor() {
    return `hsl(${360 * Math.random()}, 100%, 50%)`
  }

  static constrainMinMax(value, min, max) {
    if (value < min) {
      value = min
    } else if (value > max) {
      value = max
    }

    return value
  }
}

// hack for back
if (typeof window === 'undefined') {
  module.exports = { SCREEN, Utils }
} else {
  module = {}
}
