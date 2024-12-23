const DEMO_BASIC = {
  blocks: {
    languageVersion: 0,
    blocks: [
      {
        type: 'spacecode_loop',
        id: 'wjRQUj@z_Q8aH:f:Qhce',
        x: 76,
        y: -39,
        inputs: {
          CONTENT: {
            block: {
              type: 'spacecode_move',
              id: 'b{tEN+eIgCslUr8GS:wT',
              fields: { DIRECTION: 'forward' },
              inputs: {
                VALUE: {
                  shadow: {
                    type: 'math_number',
                    id: '^Td[egVj!n+doNjx:asJ',
                    fields: { NUM: 5 }
                  }
                }
              },
              next: {
                block: {
                  type: 'spacecode_turn',
                  id: 'XQ{JpPZuAI{Up6z`7*ct',
                  fields: { DIRECTION: 'right' },
                  inputs: {
                    VALUE: {
                      shadow: {
                        type: 'math_number',
                        id: '8H~)}ZQi%{c.fCi5w}`;',
                        fields: { NUM: 5 }
                      }
                    }
                  },
                  next: {
                    block: {
                      type: 'spacecode_shoot',
                      id: '6I|Z?TCbz^h.Cu{8P$)5'
                    }
                  }
                }
              }
            }
          }
        }
      }
    ]
  }
}
