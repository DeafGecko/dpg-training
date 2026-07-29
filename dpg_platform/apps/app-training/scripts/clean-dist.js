#!/usr/bin/env node
// Post-export cleanup: removes linter warnings from Expo-generated HTML files.
// Run automatically via the "export:web" npm script after `expo export`.

const fs = require("fs");
const path = require("path");

const DIST = path.join(__dirname, "../dist");

function cleanHtml(content) {
  // Remove empty CSS rulesets like `[stylesheet-group="0"]{}` and `[stylesheet-group="2.1"]{}`
  content = content.replace(/\[stylesheet-group="[^"]*"\]\{\}/g, "");

  // Remove `-ms-text-size-adjust` declarations
  content = content.replace(/-ms-text-size-adjust:[^;]+;/g, "");

  // Remove leftover empty rules that may result (e.g. `html{}`)
  content = content.replace(/\b(html|body|input[^{]*)\{\s*\}/g, "");

  return content;
}

const htmlFiles = fs
  .readdirSync(DIST)
  .filter((f) => f.endsWith(".html"))
  .map((f) => path.join(DIST, f));

let cleaned = 0;
for (const file of htmlFiles) {
  const original = fs.readFileSync(file, "utf8");
  const result = cleanHtml(original);
  if (result !== original) {
    fs.writeFileSync(file, result, "utf8");
    console.log(`  cleaned: ${path.basename(file)}`);
    cleaned++;
  }
}

console.log(`clean-dist: ${cleaned} file(s) patched.`);
