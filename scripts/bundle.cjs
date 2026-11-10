const { join } = require("node:path");
const { context } = require("esbuild");

const tabs = ["home", "404"];
const tabFiles = tabs.map((tab) => ({
  in: join(process.cwd(), "src/tabs", `${tab}.ts`),
  out: join(process.cwd(), "public/bundle", `${tab}.js`),
}));

const watchTabs = async () => {
  const removeCwd = (path) =>
    path.slice(process.cwd().length + 1).replace(/\\/g, "/");

  console.clear();
  console.log("\x1b[1m\x1b[35m⚡ Starting esbuild watch mode...\x1b[0m\n");

  for (let i = 0; i < tabFiles.length; i++) {
    const tabFile = tabFiles[i];

    // Create an esbuild context for live watching
    const ctx = await context({
      entryPoints: [tabFile.in],
      bundle: true,
      minify: true,
      platform: "browser",
      target: "esnext",
      format: "iife",
      outfile: tabFile.out,
      treeShaking: true,
    });

    // Start watching for file changes
    await ctx.watch();

    const timestamp = new Date().toLocaleTimeString();
    console.log(
      `\x1b[90m[${timestamp}]\x1b[0m \x1b[36m[WATCH]\x1b[0m Bundled \x1b[33m${removeCwd(
        tabFile.in,
      )}\x1b[0m ➔ \x1b[32m${removeCwd(tabFile.out)}\x1b[0m`,
    );
  }

  console.log(
    "\n\x1b[32m✔ Watching for file changes... (Press Ctrl+C to stop)\x1b[0m",
  );
};

watchTabs();
