import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    exclude: ["./tests/pw", "./node_modules"],
    environment: "jsdom",
  },
});
