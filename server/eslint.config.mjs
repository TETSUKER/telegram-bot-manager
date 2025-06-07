import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["./dist", "eslint.config.mjs"]),
  { files: ["**/*.{js,mjs,cjs,ts}"], plugins: { js }, extends: ["js/recommended"] },
  { files: ["**/*.{js,mjs,cjs,ts}"], languageOptions: { globals: globals.browser } },
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      "semi": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "indent": ["error", 2 , {
        "SwitchCase": 1
      }],
      "require-await": "warn",
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/no-base-to-string": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/no-misused-promises": "off"
    }
  },
]);
