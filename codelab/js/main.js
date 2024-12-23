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
      name: 'Base',
      categorystyle: 'input_category',
      contents: [
        { kind: 'block', type: 'spacecode_init' },
        { kind: 'block', type: 'spacecode_loop' },
        { kind: 'block', type: 'spacecode_screen' },
        {
          kind: 'block',
          type: 'spacecode_getAttribute'
        },
        {
          kind: 'block',
          type: 'spacecode_setAttribute',
          inputs: {
            VALUE: {
              shadow: {
                type: 'math_number',
                fields: {
                  NUM: 0
                }
              }
            }
          }
        },
        { kind: 'block', type: 'spacecode_handler' }
      ]
    },
    {
      kind: 'category',
      name: 'Actions',
      categorystyle: 'action_category',
      contents: [
        {
          kind: 'block',
          type: 'spacecode_move',
          inputs: {
            VALUE: {
              shadow: {
                type: 'math_number',
                fields: {
                  NUM: 5
                }
              }
            }
          }
        },
        {
          kind: 'block',
          type: 'spacecode_turn',
          inputs: {
            VALUE: {
              shadow: {
                type: 'math_number',
                fields: {
                  NUM: 5
                }
              }
            }
          }
        },
        { kind: 'block', type: 'spacecode_shoot' },
        { kind: 'block', type: 'spacecode_scan' }
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
          type: 'math_arithmetic',
          inputs: {
            A: {
              shadow: {
                type: 'math_number',
                fields: {
                  NUM: 1
                }
              }
            },
            B: {
              shadow: {
                type: 'math_number',
                fields: {
                  NUM: 1
                }
              }
            }
          }
        },
        {
          kind: 'block',
          type: 'math_single',
          inputs: {
            NUM: {
              shadow: {
                type: 'math_number',
                fields: {
                  NUM: 0
                }
              }
            }
          }
        },
        {
          kind: 'block',
          type: 'math_random_int',
          inputs: {
            FROM: {
              shadow: {
                type: 'math_number',
                fields: {
                  NUM: 0
                }
              }
            },
            TO: {
              shadow: {
                type: 'math_number',
                fields: {
                  NUM: 10
                }
              }
            }
          }
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
