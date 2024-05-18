import globals from "globals"
import tseslint from "typescript-eslint"
import stylistic from "@stylistic/eslint-plugin"
import StylisticPlugin from "@stylistic/eslint-plugin"
import eslintConfigPrettier from "eslint-config-prettier"

export default [
  { languageOptions: { globals: globals.browser } },
  ...tseslint.configs.recommended,
  stylistic.configs["recommended-flat"],
  eslintConfigPrettier,
  {
    plugins: {
      stylistic: StylisticPlugin,
    },
    rules: {
      "@stylistic/object-curly-spacing": ["error", "never"],
      "@stylistic/indent": ["off"],
      "@typescript-eslint/ban-ts-comment": ["off"],
      "@typescript-eslint/no-explicit-any": ["off"],
      "@typescript-eslint/explicit-function-return-type": ["error"],
      "sort-imports": ["error"],
    },
  },
]
