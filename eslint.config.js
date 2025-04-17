// @ts-check
import {
  luxass,
} from "@luxass/eslint-config";

export default luxass({}, {
  files: [
    "./types/**/*.ts",
    "**/test/fixtures/**/*",
  ],
  rules: {
    "no-console": "off",
  },
});
