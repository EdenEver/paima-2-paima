module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@react-three/recommended',
    'plugin:react/jsx-runtime',
    '@electron-toolkit/eslint-config-ts/recommended',
    '@electron-toolkit/eslint-config-prettier'
  ],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    'no-constant-condition': ['error', { checkLoops: false }]
  }
}
