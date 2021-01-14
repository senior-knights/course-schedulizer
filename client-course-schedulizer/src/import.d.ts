/* eslint-disable @typescript-eslint/no-explicit-any */
// ESM-HMR Interface: `import.meta.hot`

interface ImportMeta {
  env: Record<string, any>;
  // TODO: Import the exact .d.ts files from "esm-hmr"
  // https://github.com/pikapkg/esm-hmr
  hot: any;
}
