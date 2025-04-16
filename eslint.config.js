// @ts-check
import {
  luxass,
} from "@luxass/eslint-config";

export default luxass({}, {
  files: [
    "./types",
    "**/test/fixtures/**/*",
  ],
  rules: {
    "no-console": "off",
  },
});
