import { nextJsConfig } from "@repo/eslint-config/next-js";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...nextJsConfig,
  {
    rules: {
      // The site is a static export (`output: "export"`): there is no image
      // optimization server, so next/image offers nothing over plain <img>.
      "@next/next/no-img-element": "off",
    },
  },
];
