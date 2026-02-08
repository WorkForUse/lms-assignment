// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  {
    ...expoConfig,
    languageOptions: {
      ...expoConfig.languageOptions,
      parserOptions: {
        ...expoConfig.languageOptions?.parserOptions,
        project: true, // Use the closest tsconfig.json for each file
      },
    },
  },
  {
    ignores: ["dist/*"],
  },
]);
