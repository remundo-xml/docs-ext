import { defineConfig } from "vitepress";
import path from "node:path";
import { generateSidebar } from "./sidebar";

const docsRoot = path.resolve(__dirname, "..");

export default defineConfig({
  title: "Remundo Docs",
  description: "Remundo platform documentation",
  themeConfig: {
    sidebar: generateSidebar(docsRoot),
    editLink: {
      pattern: "https://dev.docs.remundo.com/md/:path",
      text: "See `.md`",
    },
    search: {
      provider: "local",
    },
  },
});
