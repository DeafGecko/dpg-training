#!/usr/bin/env node
// Post-export cleanup. Run automatically via "export:web" after `expo export`.
// Replaces index.html with a redirect to /login so the root URL lands on login.

const fs = require("fs");
const path = require("path");

const DIST = path.join(__dirname, "../dist");

const INDEX_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta http-equiv="refresh" content="0;url=/login" />
  <title>Deaf Pathway Training</title>
</head>
<body></body>
</html>`;

fs.writeFileSync(path.join(DIST, "index.html"), INDEX_HTML, "utf8");
console.log("clean-dist: index.html replaced with redirect to /login.");
