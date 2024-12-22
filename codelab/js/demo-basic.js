const DEMO_BASIC = {
  blocks: {
    languageVersion: 0,
    blocks: [
      {
        type: 'spacecode_loop',
        id: 'wjRQUj@z_Q8aH:f:Qhce',
        x: 20,
        y: 20,
        inputs: {
          CONTENT: {
            block: {
              type: 'spacecode_move',
              id: 'cJ:]|/S$Ems)I{e)2S?O',
              fields: { DIRECTION: 'forward' },
              next: {
                block: {
                  type: 'spacecode_turn',
                  id: '}ntlU;|FL{vL%n$`ZR#/',
                  fields: { DIRECTION: 'left' },
                  next: {
                    block: {
                      type: 'spacecode_shoot',
                      id: 'tmcU41zxS7H;!F;6E,V='
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
