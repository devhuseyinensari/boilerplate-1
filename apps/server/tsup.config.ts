import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  target: "node20",
  clean: true,
  sourcemap: true,
  // bundle our own workspace source (it ships as raw .ts), keep real
  // npm dependencies external so they're resolved from node_modules at runtime
  noExternal: [/^@repo\//],
});
