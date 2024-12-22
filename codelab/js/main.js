/// Theme

Blockly.Themes.Spacecode = Blockly.Theme.defineTheme('spacecode', {
  base: Blockly.Themes.Classic,
  categoryStyles: {
    basic_category: {
      colour: COLORS.basicCategory
    },
    spacecode_category: {
      colour: COLORS.spacecodeCategory
    },
    input_category: {
      colour: COLORS.inputCategory
    },
    action_category: {
      colour: COLORS.actionCategory
    }
  }
})

/// Toolbox

var toolbox = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: 'Entrée',
      categorystyle: 'input_category',
      contents: [
        { kind: 'block', type: 'spacecode_init' },
        { kind: 'block', type: 'spacecode_loop' }
      ]
    },
    {
      kind: 'category',
      name: 'Actions',
      categorystyle: 'action_category',
      contents: [
        { kind: 'block', type: 'spacecode_move' },
        { kind: 'block', type: 'spacecode_turn' },
        { kind: 'block', type: 'spacecode_shoot' }
      ]
    },
    {
      kind: 'category',
      name: 'Logique',
      categorystyle: 'logic_category',
      contents: [
        {
          kind: 'block',
          type: 'controls_if'
        },
        {
          kind: 'block',
          type: 'logic_compare'
        },
        {
          kind: 'block',
          type: 'logic_operation'
        },
        {
          kind: 'block',
          type: 'logic_negate'
        },
        {
          kind: 'block',
          type: 'logic_boolean'
        }
      ]
    },
    {
      kind: 'category',
      name: 'Boucles',
      categorystyle: 'loop_category',
      contents: [
        {
          kind: 'block',
          type: 'controls_repeat_ext',
          inputs: {
            TIMES: {
              block: {
                type: 'math_number',
                fields: {
                  NUM: 10
                }
              }
            }
          }
        },
        {
          kind: 'block',
          type: 'controls_whileUntil'
        }
      ]
    },
    {
      kind: 'category',
      name: 'Math',
      categorystyle: 'math_category',
      contents: [
        {
          kind: 'block',
          type: 'math_number',
          fields: {
            NUM: 123
          }
        },
        {
          kind: 'block',
          type: 'math_arithmetic'
        },
        {
          kind: 'block',
          type: 'math_single'
        }
      ]
    },
    {
      kind: 'category',
      name: 'Text',
      categorystyle: 'text_category',
      contents: [
        {
          kind: 'block',
          type: 'text'
        },
        {
          kind: 'block',
          type: 'text_length'
        },
        {
          kind: 'block',
          type: 'text_print'
        }
      ]
    },
    {
      kind: 'sep'
    },

    {
      kind: 'category',
      name: 'Variables',
      categorystyle: 'variable_category',
      custom: 'VARIABLE'
    },
    {
      kind: 'category',
      name: 'Fonctions',
      categorystyle: 'procedure_category',
      custom: 'PROCEDURE'
    },
    {
      kind: 'sep'
    },

    {
      kind: 'category',
      name: 'Entrées',
      categorystyle: 'input_category',
      contents: [
        {
          kind: 'block',
          type: 'spacecode_isKeyPressed'
        },
        {
          kind: 'block',
          type: 'spacecode_isGamepadButtonPressed'
        },
        {
          kind: 'block',
          type: 'spacecode_isGamepadJoystickPointing'
        }
      ]
    },
    {
      kind: 'category',
      name: 'Space Code',
      categorystyle: 'spacecode_category',
      contents: [
        {
          kind: 'block',
          type: 'spacecode_move'
        },
        {
          kind: 'block',
          type: 'spacecode_turn'
        },
        {
          kind: 'block',
          type: 'spacecode_loop'
        },
        {
          kind: 'block',
          type: 'spacecode_shoot'
        },
        {
          kind: 'block',
          type: 'spacecode_getNearestEnemy'
        },
        {
          kind: 'block',
          type: 'spacecode_orientTo'
        },
        {
          kind: 'block',
          type: 'spacecode_getAttribute'
        },
        {
          kind: 'block',
          type: 'spacecode_setAttribute'
        }
      ]
    }
  ]
}

var blocklyArea = document.getElementById('blocklyArea')
var blocklyDiv = document.getElementById('blocklyDiv')
var demoWorkspace = Blockly.inject(blocklyDiv, {
  media: './node_modules/blockly/media/',
  theme: Blockly.Themes.Spacecode,
  toolbox: toolbox,
  horizontalLayout: true,
  toolboxPosition: 'start',
  renderer: 'zelos',
  zoom: {
    controls: true,
    wheel: true,
    startScale: 0.8,
    maxScale: 3,
    minScale: 0.3,
    scaleSpeed: 1.2,
    pinch: true
  }
})

var onresize = function (e) {
  // Compute the absolute coordinates and dimensions of blocklyArea.
  var element = blocklyArea
  var x = 0
  var y = 0
  do {
    x += element.offsetLeft
    y += element.offsetTop
    element = element.offsetParent
  } while (element)
  // Position blocklyDiv over blocklyArea.
  blocklyDiv.style.left = x + 'px'
  blocklyDiv.style.top = y + 'px'
  blocklyDiv.style.width = blocklyArea.offsetWidth + 'px'
  blocklyDiv.style.height = blocklyArea.offsetHeight + 'px'
  Blockly.svgResize(demoWorkspace)

  console.log('resize')
}
window.addEventListener('resize', onresize, false)
onresize()

////////////////// START SCRIPT

function loadDemo(demoblocks) {
  Blockly.serialization.workspaces.load(demoblocks, demoWorkspace)
}
function resetWorkspace() {
  loadDemo(DEMO_BASIC)
  localStorage.removeItem('profile')
}

if (!restoreCode()) {
  resetWorkspace()
}
