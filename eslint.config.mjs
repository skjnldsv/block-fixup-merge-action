import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import * as airbnb from 'eslint-config-airbnb-extended';
import globals from 'globals';
import { importX } from 'eslint-plugin-import-x';
import stylistic from '@stylistic/eslint-plugin';

export default defineConfig({
  files: ['src/*.js'],
  extends: [
    js.configs.recommended,
    importX.flatConfigs.recommended,
    airbnb.configs.base.recommended
  ],
  languageOptions: {
    globals: {
      ...globals.browser,
      ...globals.commonjs,
      ...globals.es2021,
    },
  },
  plugins: {
    '@stylistic': stylistic,
  },
});
