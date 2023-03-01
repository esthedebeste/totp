import * as esbuild from "esbuild"

await esbuild.build({
	entryPoints: ["src/index.ts"],
	bundle: true,
	outfile: "dist/index-node.js",
	format: "esm",
	mainFields: ["module", "main"],
	minify: true,
	external: ["node:crypto"],
	inject: ["platforms/node.js"],
	treeShaking: true,
})

await esbuild.build({
	entryPoints: ["src/index.ts"],
	bundle: true,
	outfile: "dist/index.js",
	format: "esm",
	mainFields: ["module", "main"],
	minify: true,
	treeShaking: true,
})
