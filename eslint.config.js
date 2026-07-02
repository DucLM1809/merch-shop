import jsxA11y from "eslint-plugin-jsx-a11y";
import tseslint from "typescript-eslint";

export default [
  { ignores: ["dist/**", ".output/**", "public/**", "graphify-out/**"] },
  {
    files: ["src/**/*.{jsx,tsx}"],
    ...jsxA11y.flatConfigs.recommended,
    languageOptions: {
      ...jsxA11y.flatConfigs.recommended.languageOptions,
      parser: tseslint.parser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: {
      "jsx-a11y": {
        // Chakra UI components are the project's only allowed HTML equivalents
        // (see CLAUDE.md) — map them so jsx-a11y's element-specific rules
        // (e.g. alt-text) actually fire instead of only checking raw tags.
        polymorphicPropName: "as",
        components: {
          Image: "img",
          Button: "button",
          Input: "input",
        },
      },
    },
  },
];
