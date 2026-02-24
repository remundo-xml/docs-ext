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
      pattern: (params) => `/md/${params.filePath}`,
      text: "See `.md`",
    },
    search: {
      provider: "local",
    },
  },
});
