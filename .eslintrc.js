// eslint error levels
const ERROR = 2
const WARN = 1
const OFF = 0

module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
    mocha: true
  },
  extends: 'eslint:recommended',
  rules: {
    'no-console': ERROR,
    // 2 rules framing the removal of unnecessary semi-colons
    semi: [ERROR, 'never'],
    'no-unreachable': ERROR,
    // formatting rules
    indent: [ERROR, 2],
    'no-trailing-spaces': ERROR,
    'no-multiple-empty-lines': [ERROR, { max: 1 }],
    // - object keys escaping { 'while': 0, valid: true, '12': 1 }
    'quote-props': [ERROR, 'as-needed', { keywords: true, numbers: true }],
    // - uses single-quoted strings when escaping is not needed
    quotes: [ERROR, 'single', 'avoid-escape'],
    // - `function() {}` and `function method() {}`
    'space-before-function-paren': [ERROR, { anonymous: 'never', named: 'never' }],
    // - inner spaces in { key: 'value' } literals
    'object-curly-spacing': [ERROR, 'always'],
    // - forbids if(true) doThing(); without braces
    curly: ERROR,
  }
}
