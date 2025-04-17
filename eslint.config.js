// @ts-check
import {
  luxass,
} from "@luxass/eslint-config";

export default luxass({}, {
  files: [
    "**/test/fixtures/**/*",
  ],
  rules: {
    "no-console": "off",
  },
}, {
  ignores: [
    "types/**/*",
  ],
});
