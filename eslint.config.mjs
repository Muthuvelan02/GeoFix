import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "off", // Allow any for rapid development
      "react/no-unescaped-entities": "off", // Allow quotes in JSX
      "prefer-const": "warn",
      "@next/next/no-img-element": "off", // Allow img elements
      "react-hooks/exhaustive-deps": "warn", // Warning only for missing deps
      "@typescript-eslint/no-empty-object-type": "off", // Allow empty interfaces
    },
  },
];

export default eslintConfig;
