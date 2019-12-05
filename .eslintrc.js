module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier"],
  env: { node: true },
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts"],
    },
  },
  rules: {},
};
