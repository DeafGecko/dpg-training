#!/usr/bin/env node
// Post-export cleanup. Run automatically via "export:web" after `expo export`.
// 1. Replaces login.html with a lean standalone page (no RNW stylesheet bloat).
// 2. Strips empty rulesets and unsupported vendor prefixes from all other HTML files.

const fs = require("fs");
const path = require("path");

const DIST = path.join(__dirname, "../dist");
const SRC_LOGO = path.join(__dirname, "../assets/icons/dpg_brand_mark_color.svg");
const DIST_LOGO = path.join(DIST, "assets/dpg_brand_mark_color.svg");

// ── 1. Copy logo SVG into dist/assets so the standalone login page can use it ──
fs.mkdirSync(path.join(DIST, "assets"), { recursive: true });
fs.copyFileSync(SRC_LOGO, DIST_LOGO);

// ── 2. Write clean standalone login.html ──────────────────────────────────────
const LOGIN_JS = `
  // Read the access-key list embedded by the build
  async function getValidKeys() {
    try {
      const res = await fetch("/_expo/static/js/web/entry-" +
        document.querySelector("script[src*='entry-']")
          ?.src.match(/entry-([a-f0-9]+)\\.js/)?.[1] + ".js");
      // Keys are validated server-side on real auth; here we just forward to the
      // React app which holds the real validation logic.
    } catch {}
  }

  document.getElementById("form").addEventListener("submit", function (e) {
    e.preventDefault();
    const raw = document.getElementById("key").value;
    const key = raw.replace(/[\\u201c\\u201d\\u201e\\u2018\\u2019'"]/g, "").trim();
    if (!key) return showError(true);

    // Store and let the React training app validate on load
    sessionStorage.setItem("auth", "1");
    sessionStorage.setItem("accessKey", key);
    window.location.href = "/training";
  });

  function showError(show) {
    document.getElementById("error").style.display = show ? "block" : "none";
    document.getElementById("btn").style.backgroundColor = show ? "#c0392b" : "#46697C";
  }

  // If training redirected back here (invalid key), show error
  if (sessionStorage.getItem("loginError") === "1") {
    sessionStorage.removeItem("loginError");
    showError(true);
  }
`;

const LOGIN_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Deaf Pathway Training</title>
  <meta name="description" content="Bible story training app for Deaf Pathway Global." />
  <link rel="icon" href="/favicon.ico" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #e2e2e2;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }

    .card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 32px 24px;
    }

    .logo { width: 220px; height: 220px; }

    .title {
      font-size: 16px;
      font-weight: 700;
      color: #46697C;
    }

    .input {
      width: 100%;
      max-width: 250px;
      padding: 10px;
      border: 2px solid #b2a426;
      border-radius: 999px;
      text-align: center;
      font-size: 18px;
      font-weight: 700;
      color: #46697C;
      outline: none;
      background: #fff;
    }

    .input:focus { border-color: #46697C; }

    .btn {
      width: 100%;
      max-width: 250px;
      padding: 14px;
      border: none;
      border-radius: 999px;
      background: #46697C;
      color: #fff;
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.15s;
    }

    .btn:hover { background: #3a5567; }

    .error {
      display: none;
      color: #c0392b;
      font-size: 14px;
    }

    .form {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      width: 100%;
    }
  </style>
</head>
<body>
  <div class="card">
    <img class="logo" src="/assets/dpg_brand_mark_color.svg" alt="Deaf Pathway Global logo" />
    <p class="title">Login Portal</p>
    <form id="form" class="form">
      <input id="key" class="input" type="text" placeholder="Enter Access Key" autocomplete="off" />
      <button id="btn" class="btn" type="submit">Enter</button>
      <p id="error" class="error">Invalid key. Please try again.</p>
    </form>
  </div>
  <script>${LOGIN_JS}</script>
</body>
</html>`;

fs.writeFileSync(path.join(DIST, "login.html"), LOGIN_HTML, "utf8");
console.log("  wrote: login.html (standalone, no RNW styles)");

// ── Replace index.html with a simple redirect to login.html ──────────────────
const INDEX_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta http-equiv="refresh" content="0;url=/login.html" />
  <title>Deaf Pathway Training</title>
</head>
<body></body>
</html>`;

fs.writeFileSync(path.join(DIST, "index.html"), INDEX_HTML, "utf8");
console.log("  wrote: index.html (redirect to login.html)");

// ── 3. Strip unsupported/problematic CSS from other pages ────────────────────
function cleanHtml(content) {
  // Empty RNW marker rulesets
  content = content.replace(/\[stylesheet-group="[^"]*"\]\{\}/g, "");

  // Unsupported vendor prefixes
  content = content.replace(/-ms-text-size-adjust:[^;]+;/g, "");
  content = content.replace(/-webkit-text-size-adjust:[^;]+;/g, "");
  content = content.replace(/-webkit-overflow-scrolling:[^;]+;/g, "");

  // Vendor-prefixed appearance — keep only standard, deduplicate
  content = content.replace(/-moz-appearance:[^;]+;/g, "");
  content = content.replace(/-ms-appearance:[^;]+;/g, "");
  // Replace -webkit-appearance only if no standard appearance already present in same rule
  content = content.replace(/(-webkit-appearance:([^;]+);)(appearance:\2;)?/g, "appearance:$2;");
  // Remove duplicate appearance declarations in same rule
  content = content.replace(/(appearance:[^;]+;)(appearance:[^;]+;)/g, "$1");

  // Unknown/unsupported properties
  content = content.replace(/border-curve:[^;]+;/g, "");
  content = content.replace(/forced-color-adjust:[^;]+;/g, "");

  // Remove inline styles from RNW body markup (the two style= attributes)
  content = content.replace(/ style="position:absolute;left:0;right:0;top:0;bottom:0;pointer-events:none;visibility:hidden"/g, "");
  content = content.replace(/ style="background-color:rgba\(242,242,242,1\.00\);display:flex"/g, "");

  // Leftover empty rules after stripping
  content = content.replace(/[\w.:>*-]+\{(\s*)\}/g, "");

  // Remove blank lines left by stripped rules (inside <style> blocks)
  content = content.replace(/(<style[^>]*>)([\s\S]*?)(<\/style>)/g, (_, open, body, close) => {
    const cleaned = body.replace(/^\s*\n/gm, "");
    return open + cleaned + close;
  });

  return content;
}

const otherHtml = fs
  .readdirSync(DIST)
  .filter((f) => f.endsWith(".html") && f !== "login.html")
  .map((f) => path.join(DIST, f));

let cleaned = 0;
for (const file of otherHtml) {
  const original = fs.readFileSync(file, "utf8");
  const result = cleanHtml(original);
  if (result !== original) {
    fs.writeFileSync(file, result, "utf8");
    console.log(`  cleaned: ${path.basename(file)}`);
    cleaned++;
  }
}

console.log(`clean-dist: login.html replaced + ${cleaned} other file(s) patched.`);
