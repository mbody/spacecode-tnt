JoystickController = JoystickController.default

ORIGIN = { x: 0, y: 0 }

let requestedAngle = 0
let moveForward = false

function createJoystick() {
  const dynamicJoystick = new JoystickController(
    {
      maxRange: 70,
      level: 10,
      radius: 50,
      joystickRadius: 30,
      opacity: 0.5,
      containerClass: 'joystick-container',
      controllerClass: 'joystick-controller',
      joystickClass: 'joystick',
      distortion: true,
      dynamicPosition: true,
      dynamicPositionTarget: document.getElementById('root'),
      mouseClickButton: 'ALL',
      hideContextMenu: true
    },
    ({ x, y, leveledX, leveledY, distance, angle }) => {
      //console.log(x, y, leveledX, leveledY, distance, angle)
      requestedAngle = 90 + radToDeg(angle)
      console.log(requestedAngle)
      moveForward = distanceBetween(ORIGIN, { x: leveledX, y: leveledY }) > 25
    }
  )
}

async function startSpacecodeClient(name = 'TOTO', color = '#f00dbb') {
  Spacecode.connect(name, color)
  while (true) {
    Spacecode.setRotation(requestedAngle)
    if (moveForward) {
      Spacecode.moveForward()
    }
    Spacecode.shoot()
    await Spacecode.update()
  }
}

function start() {
  createJoystick()
  const username = document.getElementById('username').value
  const color = `hsl(${360 * Math.random()}, 100%, 50%)` //document.getElementById('colorpicker').value
  startSpacecodeClient(username, color)
}
