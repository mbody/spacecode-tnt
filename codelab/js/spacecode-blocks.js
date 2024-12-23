registerFieldColour()

Blockly.defineBlocksWithJsonArray([
  {
    type: 'color_wheel_picker',
    message0: 'Color: %1',
    args0: [
      {
        type: 'field_template',
        name: 'COLOR',
        color: '#FF00FF',
        width: 150,
        options: {
          layoutDirection: 'horizontal'
        }
      }
    ]
  }
])

INPUT_COLOR = 120
ACTION_COLOR = 285
LOGIC_COLOR = 165
BLOCK_COLOR = 285
VALUE_COLOR = 60

Blockly.common.defineBlocksWithJsonArray([
  {
    type: 'spacecode_turn',
    tooltip: 'Faire tourner le vaisseau',
    message0: 'Tourner à %1 de %2 °',
    args0: [
      {
        type: 'field_dropdown',
        name: 'DIRECTION',
        options: [
          ['droite', 'right'],
          ['gauche', 'left']
        ]
      },
      {
        type: 'input_value',
        name: 'VALUE',
        check: 'Number',
        min: -20,
        max: 20
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: ACTION_COLOR
  },
  {
    type: 'spacecode_move',
    tooltip: 'Avance ou recule le vaisseau',
    message0: 'Déplacer vers %1 de %2',
    args0: [
      {
        type: 'field_dropdown',
        name: 'DIRECTION',
        options: [
          ['avant', 'forward'],
          ['arrière', 'backward']
        ]
      },
      {
        type: 'input_value',
        name: 'VALUE',
        chack: 'Number',
        min: -50,
        max: 50
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: ACTION_COLOR
  },

  {
    type: 'spacecode_init',
    tooltip: '',
    helpUrl: '',
    message0: 'Au démarrage %1',
    args0: [
      {
        type: 'input_statement',
        name: 'CONTENT'
      }
    ],
    colour: INPUT_COLOR
  },
  {
    type: 'spacecode_loop',
    tooltip: "S'exécute toutes les 100 ms environ",
    helpUrl: '',
    message0: 'Toujours %1',
    args0: [
      {
        type: 'input_statement',
        name: 'CONTENT'
      }
    ],
    colour: INPUT_COLOR
  },
  {
    type: 'spacecode_handler',
    tooltip: "S'exécute si l'évènement se produit",
    helpUrl: '',
    message0: 'Lorsque %1 %2',
    args0: [
      {
        type: 'field_dropdown',
        name: 'EVENT',
        options: [
          ['détecté', 'DETECTED'],
          ['adversaire détruit', 'PLAYER_KILLED']
        ]
      },
      {
        type: 'input_statement',
        name: 'CONTENT'
      }
    ],
    colour: INPUT_COLOR
  },

  {
    type: 'spacecode_shoot',
    tooltip: '',
    helpUrl: '',
    message0: 'Shooter %1',
    args0: [
      {
        type: 'input_dummy',
        name: 'NAME'
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: BLOCK_COLOR
  },
  {
    type: 'spacecode_screen',
    tooltip: '',
    helpUrl: '',
    message0: 'écran %1 %2',
    args0: [
      {
        type: 'field_dropdown',
        name: 'ATTRIBUTE',
        options: [
          ['largeur', 'width'],
          ['hauteur', 'height']
        ]
      },
      {
        type: 'input_dummy',
        name: 'NAME'
      }
    ],
    output: null,
    colour: VALUE_COLOR
  },
  {
    type: 'spacecode_orientTo',
    tooltip: '',
    helpUrl: '',
    message0: "S'orienter vers %1",
    args0: [
      {
        type: 'input_value',
        name: 'SPRITE',
        check: 'Sprite'
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 225
  },
  {
    type: 'spacecode_orientToNearestEnemy',
    tooltip: '',
    helpUrl: '',
    message0: "S'orienter vers l'ennemi le plus proche %1",
    args0: [
      {
        type: 'input_dummy',
        name: 'NAME'
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: BLOCK_COLOR
  },
  {
    type: 'spacecode_isKeyPressed',
    tooltip:
      'Retourne true si la touche correspondant au code est enfoncée, false sinon',
    helpUrl:
      'https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode',
    message0: 'Touche %1 enfoncée %2',
    args0: [
      {
        type: 'field_input',
        name: 'CODE',
        text: 'code'
      },
      {
        type: 'input_dummy',
        name: 'NAME'
      }
    ],
    output: 'Boolean',
    colour: INPUT_COLOR
  },
  {
    type: 'spacecode_isGamepadButtonPressed',
    tooltip: 'Retourne true si le bouton B0 à B5 est enfoncé, false sinon',
    helpUrl:
      'https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode',
    message0: 'Bouton gamepad %1 enfoncé %2',
    args0: [
      {
        type: 'field_dropdown',
        name: 'CODE',
        options: [
          ['B0', GAMEPAD_BUTTON.B0],
          ['B1', GAMEPAD_BUTTON.B1],
          ['B2', GAMEPAD_BUTTON.B2],
          ['B3', GAMEPAD_BUTTON.B3],
          ['B4', GAMEPAD_BUTTON.B4],
          ['B5', GAMEPAD_BUTTON.B5]
        ]
      },
      {
        type: 'input_dummy',
        name: 'NAME'
      }
    ],
    output: 'Boolean',
    colour: INPUT_COLOR
  },
  {
    type: 'spacecode_isGamepadJoystickPointing',
    tooltip:
      'Retourne true si la touche correspondant au code est enfoncée, false sinon',
    helpUrl:
      'https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode',
    message0: 'Joystick vers %1 %2',
    args0: [
      {
        type: 'field_dropdown',
        name: 'CODE',
        options: [
          ['Haut', JOYSTICK_DIRECTION.UP],
          ['Bas', JOYSTICK_DIRECTION.DOWN],
          ['Gauche', JOYSTICK_DIRECTION.LEFT],
          ['Droite', JOYSTICK_DIRECTION.RIGHT]
        ]
      },
      {
        type: 'input_dummy',
        name: 'NAME'
      }
    ],
    output: 'Boolean',
    colour: INPUT_COLOR
  },
  {
    type: 'spacecode_getAttribute',
    tooltip: "Valeur d'un attribut du vaisseau ",
    helpUrl: '',
    message0: '%1 %2',
    args0: [
      {
        type: 'field_dropdown',
        name: 'ATTRIBUTE',
        options: [
          ['x', 'x'],
          ['y', 'y'],
          ['rotation', 'rotation']
        ]
      },
      {
        type: 'input_dummy',
        name: 'NAME'
      }
    ],
    output: 'Number',
    colour: VALUE_COLOR
  },
  {
    type: 'spacecode_setAttribute',
    tooltip: "Définir l'attribut du vasseau",
    helpUrl: '',
    message0: 'Définir %1 à %2',
    args0: [
      {
        type: 'field_dropdown',
        name: 'ATTRIBUTE',
        options: [
          ['x', 'x'],
          ['y', 'y'],
          ['rotation', 'rotation']
        ]
      },
      {
        type: 'input_value',
        name: 'VALUE',
        check: 'Number'
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: BLOCK_COLOR,
    inputsInline: true
  },
  {
    type: 'spacecode_getNearestEnemy',
    tooltip: '',
    helpUrl: '',
    message0: 'Enemi le plus proche %1',
    args0: [
      {
        type: 'input_dummy',
        name: 'NAME'
      }
    ],
    output: 'Sprite',
    colour: 225
  },
  {
    type: 'spacecode_scan',
    tooltip: '',
    helpUrl: '',
    message0: '%1 %2 détecté',
    args0: [
      {
        type: 'field_dropdown',
        name: 'TYPE',
        options: [
          ['adversaire', 'PLAYER'],
          ['bonus', 'BONUS']
        ]
      },
      {
        type: 'input_dummy',
        name: 'NAME'
      }
    ],
    output: 'Boolean',
    colour: ACTION_COLOR
  }
])

javascript.javascriptGenerator.forBlock['spacecode_turn'] = (block) => {
  const number_angle = javascript.javascriptGenerator.valueToCode(
    block,
    'VALUE',
    javascript.Order.ATOMIC
  )
  const dropdown_direction = block.getFieldValue('DIRECTION')
  const method = dropdown_direction === 'left' ? 'turnLeft' : 'turnRight'
  const code = `this.${method}(${number_angle}); `
  return code
}

javascript.javascriptGenerator.forBlock['spacecode_move'] = (block) => {
  const number_distance = javascript.javascriptGenerator.valueToCode(
    block,
    'VALUE',
    javascript.Order.ATOMIC
  )
  const dropdown_direction = block.getFieldValue('DIRECTION')
  const method =
    dropdown_direction === 'forward' ? 'moveForward' : 'moveBackward'
  const code = `this.${method}(${number_distance}); `
  return code
}

javascript.javascriptGenerator.forBlock['spacecode_init'] = function (block) {
  const statement_content = javascript.javascriptGenerator.statementToCode(
    block,
    'CONTENT'
  )
  const code = `<INIT>() => {try{${statement_content}} catch(e){console.error(e)}};</INIT>`
  return code
}

javascript.javascriptGenerator.forBlock['spacecode_loop'] = function (block) {
  const statement_content = javascript.javascriptGenerator.statementToCode(
    block,
    'CONTENT'
  )
  const code = `<LOOP>() => {try{${statement_content}} catch(e){console.error(e)}};</LOOP>`
  return code
}

javascript.javascriptGenerator.forBlock['spacecode_handler'] = function (
  block
) {
  const dropdown_event = block.getFieldValue('EVENT')
  const statement_content = javascript.javascriptGenerator.statementToCode(
    block,
    'CONTENT'
  )
  const code = `<${dropdown_event}>() => {try{${statement_content}} catch(e){console.error(e)}};</${dropdown_event}>`
  return code
}

javascript.javascriptGenerator.forBlock['spacecode_shoot'] = function (block) {
  const code = `this.shoot() ;`
  return code
}

javascript.javascriptGenerator.forBlock['spacecode_scan'] = function (block) {
  const dropdown_object = block.getFieldValue('TYPE')
  let type = ''
  switch (dropdown_object) {
    case '':
  }
  const code = `this.scan(${type})`
  return [code, javascript.Order.NONE]
}

javascript.javascriptGenerator.forBlock['spacecode_turnToward'] = function (
  block
) {
  const value_sprite = javascript.javascriptGenerator.valueToCode(
    block,
    'SPRITE',
    javascript.Order.ATOMIC
  )

  const code = `this.turnToward(${value_sprite});`
  return code
}
javascript.javascriptGenerator.forBlock['spacecode_getNearestEnemy'] =
  function () {
    const code = `Spacecode.getNearestEnemy()\n`
    return [code, javascript.Order.NONE]
  }

javascript.javascriptGenerator.forBlock['spacecode_orientToNearestEnemy'] =
  function (block) {
    const code = `Spacecode.orientToNearestEnemy()\n`
    return code
  }

javascript.javascriptGenerator.forBlock['spacecode_getAttribute'] = function (
  block
) {
  const dropdown_attribute = block.getFieldValue('ATTRIBUTE')

  const code = `this.${dropdown_attribute}`
  return [code, javascript.Order.NONE]
}

javascript.javascriptGenerator.forBlock['spacecode_setAttribute'] = function (
  block
) {
  const attribute = block.getFieldValue('ATTRIBUTE')
  const value = javascript.javascriptGenerator.valueToCode(
    block,
    'VALUE',
    javascript.Order.ATOMIC
  )

  const code = `this.${attribute}=${value}; `
  return code
}

javascript.javascriptGenerator.forBlock['spacecode_screen'] = function (block) {
  const dropdown_attribute = block.getFieldValue('ATTRIBUTE')
  let code = ''
  switch (dropdown_attribute) {
    case 'width':
      code = SCREEN.width
      break
    case 'height':
      code = SCREEN.height
      break
  }
  return [code, javascript.Order.NONE]
}
