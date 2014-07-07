Keyboards['zh-Hans-Handwriting'] = {
  label: 'Chinese - Simplified - Handwriting',
  menuLabel: '手写简体',
  needsCandidatePanel: true,
  disableAlternateLayout: true,
  imEngine: 'handwriting',
  types: ['text'],
  width: 10,
  textLayoutOverwrite: {
    ',': false,
    '.': false
  },
  handwriting: {
    width: 8.5,
    rowspan: 4
  },
  keys: [
    [
      { value: '…', ratio: 1.5 }
    ], [
      { value: '？', ratio: 1.5 }
    ], [
      { value: '，', ratio: 1.5 }
    ], [
      { value: '⌫', keyCode: KeyEvent.DOM_VK_BACK_SPACE, ratio: 1.5 }
    ], [
      { value: '?123', keyCode: -21, ratio: 1.5 },
      { value: '空格', keyCode: KeyEvent.DOM_VK_SPACE, ratio: 5 },
      { value: '。', ratio: 1.5 },
      { value: '↵', ratio: 2, keyCode: KeyEvent.DOM_VK_RETURN }
    ]
  ]
};

Keyboards['zh-Hans-Handwriting-Symbol-Ch-1'] = {
  hidesSwitchKey: true,
  needsCandidatePanel: true,
  disableAlternateLayout: true,
  width: 10,
  textLayoutOverwrite: {
    ',': false,
    '.': false
  },
  keys: [
    [
      { value: '1' }, { value: '2' }, { value: '3' } , { value: '4' },
      { value: '5' }, { value: '6' }, { value: '7' } , { value: '8' },
      { value: '9' }, { value: '0' }
    ], [
      { value: '？' }, { value: '！' }, { value: '：' }, { value: '；' },
      { value: '……', compositeKey: '……', className: 'pinyin-ch-ellipsis' },
      { value: '～' }, { value: '（' }, { value: '）' },
      { value: '“' }, { value: '”' }
    ], [
      { value: '1/2', ratio: 1.5, keyCode: -22 },
      { value: '、' }, { value: '@' }, { value: '&' }, { value: '^' },
      { value: '#' }, { value: '%' }, { value: '/' },
      { value: '⌫', ratio: 1.5, keyCode: KeyEvent.DOM_VK_BACK_SPACE }
    ], [
      { value: '返回', ratio: 1.5, keyCode: -11 },
      { value: '中/<span class="pinyin-toggle-button-small">英</span>',
        ratio: 1.5, keyCode: -30 },
      { value: '，' },
      { value: '空格', ratio: 3, keyCode: KeyboardEvent.DOM_VK_SPACE },
      { value: '。' },
      { value: '↵', ratio: 2, keyCode: KeyEvent.DOM_VK_RETURN }
    ]
  ]
};

Keyboards['zh-Hans-Handwriting-Symbol-Ch-2'] = {
  hidesSwitchKey: true,
  needsCandidatePanel: true,
  disableAlternateLayout: true,
  width: 10,
  textLayoutOverwrite: {
    ',': false,
    '.': false
  },
  keys: [
    [
      { value: '1' }, { value: '2' }, { value: '3' } , { value: '4' },
      { value: '5' }, { value: '6' }, { value: '7' } , { value: '8' },
      { value: '9' }, { value: '0' }
    ], [
      { value: '+' }, { value: '-' }, { value: '_' }, { value: '=' },
      { value: '$' }, { value: '￥' }, { value: '《' }, { value: '》' },
      { value: '{' }, { value: '}' }
    ], [
      { value: '2/2', ratio: 1.5, keyCode: -21 },
      { value: '【' }, { value: '】' }, { value: '「' }, { value: '」' },
      { value: '＊' }, { value: '·' }, { value: '|' },
      { value: '⌫', ratio: 1.5, keyCode: KeyEvent.DOM_VK_BACK_SPACE }
    ], [
      { value: '返回', ratio: 1.5, keyCode: -11 },
      { value: '中/<span class="pinyin-toggle-button-small">英</span>',
        ratio: 1.5, keyCode: -30 },
      { value: '，' },
      { value: '空格', ratio: 3, keyCode: KeyboardEvent.DOM_VK_SPACE },
      { value: '。' },
      { value: '↵', ratio: 2, keyCode: KeyEvent.DOM_VK_RETURN }
    ]
  ]
};

Keyboards['zh-Hans-Handwriting-Symbol-En-1'] = {
  hidesSwitchKey: true,
  needsCandidatePanel: true,
  disableAlternateLayout: true,
  width: 10,
  textLayoutOverwrite: {
    ',': false,
    '.': false
  },
  keys: [
    [
      { value: '1' }, { value: '2' }, { value: '3' } , { value: '4' },
      { value: '5' }, { value: '6' }, { value: '7' } , { value: '8' },
      { value: '9' }, { value: '0' }
    ], [
      { value: '?' }, { value: '!' }, { value: ':' }, { value: ';' },
      { value: '…' }, { value: '~' }, { value: '(' }, { value: ')' },
      { value: '\'' }, { value: '"' }
    ], [
      { value: '1/2', ratio: 1.5, keyCode: -32 },
      { value: '\\' }, { value: '@' }, { value: '&' }, { value: '^' },
      { value: '#' }, { value: '%' }, { value: '/' },
      { value: '⌫', ratio: 1.5, keyCode: KeyEvent.DOM_VK_BACK_SPACE }
    ], [
      { value: '返回', ratio: 1.5, keyCode: -11 },
      { value: '<span class="pinyin-toggle-button-small">中</span>/英',
        ratio: 1.5, keyCode: -20 },
      { value: ',' },
      { value: '空格', ratio: 3, keyCode: KeyboardEvent.DOM_VK_SPACE },
      { value: '.' },
      { value: '↵', ratio: 2, keyCode: KeyEvent.DOM_VK_RETURN }
    ]
  ]
};

Keyboards['zh-Hans-Handwriting-Symbol-En-2'] = {
  hidesSwitchKey: true,
  needsCandidatePanel: true,
  disableAlternateLayout: true,
  width: 10,
  textLayoutOverwrite: {
    ',': false,
    '.': false
  },
  keys: [
    [
      { value: '1' }, { value: '2' }, { value: '3' } , { value: '4' },
      { value: '5' }, { value: '6' }, { value: '7' } , { value: '8' },
      { value: '9' }, { value: '0' }
    ], [
      { value: '+' }, { value: '-' }, { value: '_' }, { value: '=' },
      { value: '$' }, { value: '￥' }, { value: '<' }, { value: '>' },
      { value: '{' }, { value: '}' }
    ], [
      { value: '2/2', ratio: 1.5, keyCode: -31 },
      { value: '[' }, { value: ']' }, { value: '「' }, { value: '」' },
      { value: '*' }, { value: '`' }, { value: '|' },
      { value: '⌫', ratio: 1.5, keyCode: KeyEvent.DOM_VK_BACK_SPACE }
    ], [
      { value: '返回', ratio: 1.5, keyCode: -11 },
      { value: '<span class="pinyin-toggle-button-small">中</span>/英',
        ratio: 1.5, keyCode: -20 },
      { value: ',' },
      { value: '空格', ratio: 3, keyCode: KeyboardEvent.DOM_VK_SPACE },
      { value: '.' },
      { value: '↵', ratio: 2, keyCode: KeyEvent.DOM_VK_RETURN }
    ]
  ]
};
