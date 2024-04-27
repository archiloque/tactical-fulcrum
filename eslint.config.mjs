import globals from "globals";
import tseslint from "typescript-eslint";
import stylistic from '@stylistic/eslint-plugin'
import StylisticPlugin from '@stylistic/eslint-plugin'

export default [
    {languageOptions: {globals: globals.browser}},
    ...tseslint.configs.recommended,
    stylistic.configs['recommended-flat'],
    {
        plugins: {
            stylistic: StylisticPlugin
        },
        rules: {
            '@stylistic/object-curly-spacing': ['error', 'never'],
            'comma-dangle': ['error', 'always-multiline'],
            '@stylistic/indent': ['off'],
            "@typescript-eslint/ban-ts-comment": ["off"]
        }
    }
];
