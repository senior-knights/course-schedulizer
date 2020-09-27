module.exports = {
  ignorePatterns: ["serviceWorker.ts", "*/_generated"],
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    "react-app",
    "airbnb",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "prettier",
    "prettier/@typescript-eslint",
    "prettier/react",
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: "module",
  },
  plugins: [
    "react",
    "@typescript-eslint",
    "typescript-sort-keys",
    "react-hooks",
    "sort-keys-fix",
  ],
  rules: {
    // Disable some AirBnB rules.
    // Allow any linebreak type.
    "linebreak-style": "off",

    // Disable rules that will be enabled by typescript-eslint
    quotes: "off",
    camelcase: "off",

    // API might not have camelcase
    "@typescript-eslint/camelcase": ["off"],

    // JSX can be in either jsx or tsx files
    "react/jsx-filename-extension": [1, { extensions: [".tsx", ".jsx"] }],

    // Turn off rules related to Prettier. These are auto fixed.
    "max-len": "off",
    "@typescript-eslint/quotes": "off",
    "@typescript-eslint/indent": "off",
    "arrow-parens": "off",
    "@typescript-eslint/semi": "off",
    "react/jsx-closing-bracket-location": "off",
    "@typescript-eslint/indent": "off", // Conflicts with Prettier settings
    // Make comma-dangle error bc it needs to be in version control
    // or else it is confusing. See: https://eslint.org/docs/rules/comma-dangle
    "comma-dangle": ["error", "always-multiline"],

    // Don't prefer default exports
    "import/no-default-export": "error",
    "import/prefer-default-export": "off",

    // Don't require extensions for the follow files
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      },
    ],
    "import/no-unresolved": "off",

    // Rules related to function definitions
    "func-style": ["error", "expression"],
    "implicit-arrow-linebreak": "off",

    // Alphabetize
    "sort-vars": "error",
    "typescript-sort-keys/interface": "error",
    "typescript-sort-keys/string-enum": "error",
    "react/jsx-sort-props": "error",
    "sort-keys-fix/sort-keys-fix": "error",

    // More typescript specific rules
    "@typescript-eslint/array-type": "error",
    "@typescript-eslint/explicit-module-boundary-types": "error",
    "@typescript-eslint/explicit-function-return-type": [
      "error",
      {
        allowTypedFunctionExpressions: false,
      },
    ],
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/type-annotation-spacing": "error",
    "@typescript-eslint/typedef": [
      "error",
      {
        arrowParameter: true,
      },
    ],

    // Works with v2 typescript-eslint but not v3.
    // Enforces no anti pattern with interfaces I
    "@typescript-eslint/interface-name-prefix": ["error", "never"],

    // React Hooks
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",

    // React
    "react/jsx-props-no-spreading": "off",

    // Make debugger a warning instead of an error
    "no-debugger": "warn",

    // Don't require radix parameter
    radix: "off",

    // Allow nested ternary (often it's cleaner)
    "no-nested-ternary": "off",

    // Enforce the same syntax for all arrow functions
    "arrow-body-style": ["error", "always"],
  },
  settings: {
    // Imports with these extensions can be resolved with relative path
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  overrides: [
    {
      files: ["**/*.test.tsx"],
      env: {
        jest: true,
      },
    },
  ],
};
