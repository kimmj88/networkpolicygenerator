import pluginJs from '@eslint/js';
import typescriptEslintParser from '@typescript-eslint/parser';
import pluginVue from 'eslint-plugin-vue';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node
            },
            ecmaVersion: 'latest',
            parser: typescriptEslintParser,
            plugin: ['@typescript-eslint']
        }
    },
    pluginJs.configs.recommended,
    ...pluginVue.configs['flat/essential'],
    ...tseslint.configs.recommended
];
