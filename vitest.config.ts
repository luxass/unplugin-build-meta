import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    onConsoleLog(_, type) {
      if (type === "stderr") {
        return true;
      }

      return false;
    },
  },
});
