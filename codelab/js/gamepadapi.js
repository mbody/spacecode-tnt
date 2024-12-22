const JOYSTICK_DIRECTION = {
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right'
}

const GAMEPAD_BUTTON = {
  B0: 'B0',
  B1: 'B1',
  B2: 'B2',
  B3: 'B3',
  B4: 'B4',
  B5: 'B5'
}

const GamepadAPI = {
  controller: {},
  turbo: false,
  connect(evt) {
    GamepadAPI.controller = evt.gamepad
    GamepadAPI.turbo = true
    console.log('Gamepad connected.')
  },
  disconnect() {
    GamepadAPI.turbo = false
    delete GamepadAPI.controller
    console.log('Gamepad disconnected.')
  },
  update() {
    // Clear the buttons cache
    GamepadAPI.buttonsCache = []

    // Move the buttons status from the previous frame to the cache
    for (let k = 0; k < GamepadAPI.buttonsStatus.length; k++) {
      GamepadAPI.buttonsCache[k] = GamepadAPI.buttonsStatus[k]
    }

    // Clear the buttons status
    GamepadAPI.buttonsStatus = []

    // Get the gamepad object
    const c = navigator.getGamepads()[0] || {}

    // Loop through buttons and push the pressed ones to the array
    const pressed = []
    if (c.buttons) {
      for (let b = 0; b < c.buttons.length; b++) {
        if (c.buttons[b].pressed) {
          pressed.push(GamepadAPI.buttons[b])
          console.log('Btn ' + GamepadAPI.buttons[b] + ' pressed ! ')
        }
      }
    }

    // Loop through axes and push their values to the array
    const axes = []
    if (c.axes) {
      for (let a = 0; a < c.axes.length; a++) {
        axes.push(c.axes[a].toFixed(2))
        /*
        if (Math.abs(c.axes[a].toFixed(2)) > 0.5) {
          console.log('Axes ' + a + ' =  ' + c.axes[a].toFixed(2))
        }
          */
      }
    }

    // Assign received values
    GamepadAPI.axesStatus = axes
    GamepadAPI.buttonsStatus = pressed

    // Return buttons for debugging purposes
    return pressed
  },
  buttonPressed(button, hold) {
    let newPress = false

    // Loop through pressed buttons
    for (let i = 0; i < GamepadAPI.buttonsStatus.length; i++) {
      // If we found the button we're looking for
      if (GamepadAPI.buttonsStatus[i] === button) {
        // Set the boolean variable to true
        newPress = true

        // If we want to check the single press
        if (!hold) {
          // Loop through the cached states from the previous frame
          for (let j = 0; j < GamepadAPI.buttonsCache.length; j++) {
            // If the button was already pressed, ignore new press
            newPress = GamepadAPI.buttonsCache[j] !== button
          }
        }
      }
    }
    return newPress
  },
  joystickPointing(direction) {
    if (GamepadAPI.axesStatus.length === 0) return false

    switch (direction) {
      case JOYSTICK_DIRECTION.UP:
        return GamepadAPI.axesStatus[1] < -0.5
      case JOYSTICK_DIRECTION.DOWN:
        return GamepadAPI.axesStatus[1] > 0.5
      case JOYSTICK_DIRECTION.LEFT:
        return GamepadAPI.axesStatus[0] < -0.5
      case JOYSTICK_DIRECTION.RIGHT:
        return GamepadAPI.axesStatus[0] > 0.5
      default:
        return false
    }
  },
  /// fields
  buttons: Object.values(GAMEPAD_BUTTON),
  buttonsCache: [],
  buttonsStatus: [],
  axesStatus: []
}
