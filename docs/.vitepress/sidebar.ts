import fs from "node:fs";
import path from "node:path";

interface SidebarItem {
  text: string;
  link?: string;
  collapsed?: boolean;
  items?: SidebarItem[];
}

function titleCase(name: string): string {
  return name
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function readHeading(filePath: string): string | null {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const match = content.match(/^#\s+(.+)$/m);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

function buildSidebar(dir: string, urlPrefix: string): SidebarItem[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const items: SidebarItem[] = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;

    if (entry.isDirectory()) {
      const subDir = path.join(dir, entry.name);
      const children = buildSidebar(subDir, `${urlPrefix}/${entry.name}`);
      if (children.length === 0) continue;

      const indexFile = path.join(subDir, "index.md");
      const text = readHeading(indexFile) ?? titleCase(entry.name);

      items.push({
        text,
        link: fs.existsSync(indexFile) ? `${urlPrefix}/${entry.name}/` : undefined,
        collapsed: true,
        items: children,
      });
    } else if (entry.name.endsWith(".md") && entry.name !== "index.md") {
      const filePath = path.join(dir, entry.name);
      const slug = entry.name.replace(/\.md$/, "");
      const text = readHeading(filePath) ?? titleCase(slug);

      items.push({
        text,
        link: `${urlPrefix}/${slug}`,
      });
    }
  }

  return items;
}

export function generateSidebar(docsRoot: string): SidebarItem[] {
  const entries = fs.readdirSync(docsRoot, { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const sidebar: SidebarItem[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith(".")) continue;

    const dir = path.join(docsRoot, entry.name);
    const children = buildSidebar(dir, `/${entry.name}`);
    if (children.length === 0) continue;

    sidebar.push({
      text: titleCase(entry.name),
      collapsed: false,
      items: children,
    });
  }

  return sidebar;
}
