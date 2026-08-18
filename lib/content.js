import fs from "fs";
import path from "path";

const ROOT = process.cwd();

export function readContent(relativePath) {
  const full = path.join(ROOT, "content", relativePath);
  return fs.readFileSync(full, "utf8");
}

export function contentExists(relativePath) {
  return fs.existsSync(path.join(ROOT, "content", relativePath));
}

export function splitMarkdownSections(markdown, headingPattern = /^## /) {
  const lines = markdown.split(/\r?\n/);
  const sections = [];
  let current = null;

  for (const line of lines) {
    if (headingPattern.test(line)) {
      if (current) sections.push(current);
      current = {
        heading: line.replace(/^#+\s+/, "").trim(),
        level: (line.match(/^#+/) || ["##"])[0].length,
        body: `${line}\n`,
      };
    } else if (current) {
      current.body += `${line}\n`;
    }
  }
  if (current) sections.push(current);
  return sections;
}

export function extractTitle(markdown) {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : "";
}

export function extractLead(markdown) {
  const italic = markdown.match(/\n\*([^*]+)\*/);
  if (italic) return italic[1].replace(/\s+/g, " ").trim();
  const para = markdown
    .replace(/^#.+$/gm, "")
    .replace(/^>.+$/gm, "")
    .replace(/^\*.+\*$/gm, "")
    .split(/\n\n+/)
    .map((block) => block.replace(/\s+/g, " ").trim())
    .find((block) => block.length > 80);
  return para ? para.slice(0, 280) : "";
}
