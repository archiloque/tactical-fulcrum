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
      "@stylistic/arrow-parens": ["off"],
      "@stylistic/brace-style": ["off"],
      "@stylistic/indent": ["off"],
      "@stylistic/indent-binary-ops": ["off"],
      "@stylistic/object-curly-spacing": ["error", "always"],
      "@stylistic/operator-linebreak": ["off"],
      "@stylistic/quotes": ["off"],
      "@typescript-eslint/ban-ts-comment": ["off"],
      "@typescript-eslint/explicit-function-return-type": ["error"],
      "@typescript-eslint/no-empty-object-type": ["off"],
      "@typescript-eslint/no-explicit-any": ["off"],
      "@typescript-eslint/no-extra-non-null-assertion": ["off"],
      "@typescript-eslint/no-this-alias": ["off"],
      "sort-imports": ["error", { ignoreCase: true }],
    },
  },
]
