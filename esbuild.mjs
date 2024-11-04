import {nodeExternalsPlugin} from "esbuild-node-externals";
import { build } from "esbuild";
import pkg from "./package.json" assert { type: "json" };

const { dependencies } = pkg;

const entryFile = "src/index.ts";
const shared = {
    bundle: true,
    entryPoints: [entryFile],
    external: Object.keys(dependencies),
    logLevel: "info",
    minify: true,
    sourcemap: true,
    treeShaking: true,
    platform: 'node',
    plugins: [nodeExternalsPlugin()],
};

build({
    ...shared,
    format: "esm",
    outfile: "./dist/index.esm.js",
    target: ["esnext", "node16"],
})
.catch(() => process.exit(1));