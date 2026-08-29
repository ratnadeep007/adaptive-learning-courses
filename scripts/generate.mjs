import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { marked } from "marked";

const ROOT = process.cwd();
const COURSES_DIR = ROOT;
const DIST_DIR = path.join(ROOT, "dist");
const PUBLIC_DIR = path.join(DIST_DIR, "assets");
const warnings = [];

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const normalizeKey = (value) => value.replaceAll("\\", "/").replace(/^\.\//, "").replace(/\.md$/i, "");

function parseValue(value) {
  const trimmed = value.trim();
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    return trimmed
      .slice(1, -1)
      .split(",")
      .map((item) => item.trim().replace(/^['"]|['"]$/g, ""))
      .filter(Boolean);
  }
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  return trimmed.replace(/^['"]|['"]$/g, "");
}

function parseFrontmatter(source) {
  if (!source.startsWith("---\n")) return { attributes: {}, body: source };
  const end = source.indexOf("\n---", 4);
  if (end < 0) return { attributes: {}, body: source };
  const header = source.slice(4, end);
  const body = source.slice(end + 4).replace(/^\n/, "");
  const attributes = {};
  for (const line of header.split("\n")) {
    const separator = line.indexOf(":");
    if (separator < 0) continue;
    attributes[line.slice(0, separator).trim()] = parseValue(line.slice(separator + 1));
  }
  return { attributes, body };
}

async function markdownFiles(directory, prefix = "") {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.name.startsWith(".") || entry.name === "progress.md") continue;
    const relative = path.join(prefix, entry.name);
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await markdownFiles(absolute, relative)));
    else if (entry.isFile() && entry.name.endsWith(".md")) files.push({ absolute, relative: relative.replaceAll("\\", "/") });
  }
  return files;
}

function routeFor(courseSlug, relative) {
  const withoutExtension = relative.replace(/\.md$/i, "");
  if (withoutExtension === "index") return `/${courseSlug}/`;
  return `/${courseSlug}/${withoutExtension}/`;
}

function titleFromMarkdown(body, fallback) {
  const heading = body.match(/^#\s+(.+)$/m);
  return heading ? heading[1].trim() : fallback;
}

function slugLabel(relative) {
  return relative
    .replace(/\.md$/i, "")
    .split("/")
    .at(-1)
    .replace(/^N\d+[-_]?/i, "")
    .split(/[-_]/g)
    .filter(Boolean)
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" ");
}

function relativeHref(fromRoute, toRoute) {
  const fromDirectory = fromRoute.endsWith("/") ? fromRoute : `${fromRoute}/`;
  const href = path.posix.relative(fromDirectory, toRoute);
  if (!href) return "./";
  if (toRoute.endsWith(".html")) return href;
  return href.endsWith("/") ? href : `${href}/`;
}

function transformWikiLinks(markdown, current, routeMap) {
  return markdown.replace(/\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|([^\]]+))?\]\]/g, (_match, rawTarget, rawLabel) => {
    const target = normalizeKey(rawTarget.trim());
    const label = (rawLabel || rawTarget).trim();
    const targetRoute = routeMap.get(target) || routeMap.get(path.posix.basename(target));
    if (!targetRoute) {
      warnings.push(`${current.relative}: unresolved wikilink [[${rawTarget.trim()}]]`);
      return `<span class="unresolved-link">${escapeHtml(label)}</span>`;
    }
    return `[${label}](${relativeHref(current.route, targetRoute)})`;
  });
}

function renderMarkdown(body, current, routeMap) {
  const linkedMarkdown = transformWikiLinks(body, current, routeMap);
  return marked.parse(linkedMarkdown, { gfm: true, headerIds: true });
}

const CSS = `
:root {
  color-scheme: dark;
  --bg: #0c1115;
  --surface: #141b21;
  --surface-raised: #1a232b;
  --border: #2a3741;
  --text: #e8eef2;
  --muted: #93a4af;
  --accent: #5eead4;
  --accent-soft: rgba(94, 234, 212, .12);
  --warning: #fbbf24;
  --max: 1180px;
}

* { box-sizing: border-box; }
html { background: var(--bg); scroll-behavior: smooth; }
body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  line-height: 1.7;
}
a { color: var(--accent); }
a:hover { color: #99f6e4; }
.skip-link { position: absolute; left: -9999px; }
.skip-link:focus { left: 1rem; top: 1rem; z-index: 10; padding: .5rem .75rem; background: var(--accent); color: #06201c; }
.site-header { border-bottom: 1px solid var(--border); background: rgba(12, 17, 21, .96); }
.header-inner { max-width: var(--max); margin: 0 auto; padding: 1rem 1.25rem; display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; }
.brand { color: var(--text); font-weight: 700; letter-spacing: -.02em; text-decoration: none; }
.brand-mark { color: var(--accent); margin-right: .45rem; }
.header-link { color: var(--muted); text-decoration: none; font-size: .9rem; }
.header-link:hover { color: var(--text); }
.page-shell { max-width: var(--max); margin: 0 auto; padding: 2.5rem 1.25rem 4rem; }
.breadcrumbs { color: var(--muted); font-size: .85rem; margin-bottom: 2rem; }
.breadcrumbs a { color: var(--muted); }
.layout { display: grid; grid-template-columns: 220px minmax(0, 1fr); gap: 3.5rem; align-items: start; }
.sidebar { position: sticky; top: 1.5rem; }
.sidebar-label { color: var(--muted); font-size: .72rem; letter-spacing: .12em; text-transform: uppercase; }
.sidebar h2 { margin: .35rem 0 1rem; font-size: 1rem; }
.sidebar ul { list-style: none; padding: 0; margin: 0; display: grid; gap: .35rem; }
.sidebar a { display: block; padding: .35rem .5rem; border-radius: .35rem; color: var(--muted); text-decoration: none; font-size: .9rem; }
.sidebar a:hover, .sidebar a[aria-current="page"] { background: var(--accent-soft); color: var(--accent); }
.sidebar-note { margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid var(--border); color: var(--muted); font-size: .8rem; }
.content { min-width: 0; }
.content > h1:first-child { margin-top: 0; }
.content h1, .content h2, .content h3, .content h4 { color: var(--text); line-height: 1.2; letter-spacing: -.025em; }
.content h1 { font-size: clamp(2rem, 4vw, 3.4rem); margin: 0 0 1.25rem; }
.content h2 { margin-top: 2.5rem; font-size: 1.55rem; border-top: 1px solid var(--border); padding-top: 1.5rem; }
.content h3 { margin-top: 2rem; font-size: 1.15rem; }
.content p, .content ul, .content ol, .content blockquote { max-width: 72ch; }
.content blockquote { margin-left: 0; padding: .75rem 1rem; border-left: 3px solid var(--accent); background: var(--surface); color: var(--muted); }
.content code { padding: .12rem .35rem; border-radius: .25rem; background: var(--surface-raised); color: #b8f7ed; font-size: .9em; }
.content pre { overflow-x: auto; padding: 1rem; border: 1px solid var(--border); border-radius: .5rem; background: #0a0f13; }
.content pre code { padding: 0; background: transparent; color: var(--text); }
.content table { width: 100%; border-collapse: collapse; margin: 1.25rem 0; font-size: .92rem; }
.content th, .content td { padding: .65rem .75rem; border-bottom: 1px solid var(--border); text-align: left; vertical-align: top; }
.content th { color: var(--text); background: var(--surface); }
.content img { max-width: 100%; height: auto; }
.content input[type="checkbox"] { accent-color: var(--accent); margin-right: .45rem; }
.mermaid { overflow-x: auto; padding: 1rem; margin: 1rem 0; background: var(--surface); border: 1px solid var(--border); border-radius: .5rem; }
.unresolved-link { color: var(--warning); border-bottom: 1px dashed var(--warning); }
.course-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-top: 2rem; }
.course-card { display: block; padding: 1.25rem; border: 1px solid var(--border); border-radius: .5rem; background: var(--surface); color: var(--text); text-decoration: none; }
.course-card:hover { border-color: var(--accent); background: var(--surface-raised); }
.course-card h2 { margin: 0 0 .45rem; font-size: 1.2rem; }
.course-card p { margin: 0; color: var(--muted); font-size: .9rem; }
.course-meta { display: flex; gap: .75rem; margin-top: 1rem; color: var(--muted); font-size: .78rem; }
.course-status { color: var(--accent); }
.page-nav { display: flex; justify-content: space-between; gap: 1rem; margin-top: 3rem; padding-top: 1.25rem; border-top: 1px solid var(--border); }
.page-nav a { max-width: 48%; text-decoration: none; }
.page-nav a:last-child { text-align: right; margin-left: auto; }
.page-nav small { display: block; color: var(--muted); margin-bottom: .2rem; }
.site-footer { max-width: var(--max); margin: 0 auto; padding: 1rem 1.25rem 2.5rem; color: var(--muted); font-size: .8rem; }
@media (max-width: 760px) {
  .page-shell { padding-top: 1.5rem; }
  .layout { grid-template-columns: 1fr; gap: 1.5rem; }
  .sidebar { position: static; padding-bottom: 1rem; border-bottom: 1px solid var(--border); }
  .sidebar ul { grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); }
  .content h1 { font-size: 2.25rem; }
}
`;

function mermaidScript(html) {
  if (!html.includes("language-mermaid")) return "";
  return `<script type="module">\nimport mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";\nmermaid.initialize({ startOnLoad: true, theme: "dark", securityLevel: "strict" });\nfor (const block of document.querySelectorAll("code.language-mermaid")) {\n  const container = document.createElement("div");\n  container.className = "mermaid";\n  container.textContent = block.textContent;\n  block.parentElement.replaceWith(container);\n}\n</script>`;
}

function pageDocument({ title, body, course, current, sidebar, extraHead = "" }) {
  const breadcrumbs = course
    ? `<div class="breadcrumbs"><a href="${relativeHref(current.route, "/")}">Courses</a> / <a href="${relativeHref(current.route, `/${course.slug}/`)}">${escapeHtml(course.title)}</a>${current.route === `/${course.slug}/` ? "" : ` / ${escapeHtml(current.title)}`}</div>`
    : "";
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="${escapeHtml(course?.description || "Adaptive learning courses in Markdown.")}">
<title>${escapeHtml(title)} | Adaptive Learning</title>
<style>${CSS}</style>
${extraHead}
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header"><div class="header-inner"><a class="brand" href="${relativeHref(current.route, "/")}"><span class="brand-mark">/</span>Adaptive Learning</a><a class="header-link" href="${relativeHref(current.route, "/")}">All courses</a></div></header>
<div class="page-shell">${breadcrumbs}<main id="main" class="${sidebar ? "layout" : "content"}">${sidebar ? `<aside class="sidebar">${sidebar}</aside><article class="content">${body}</article>` : body}</main></div>
<footer class="site-footer">Generated from the adaptive-learning Markdown contract.</footer>
</body>
</html>`;
}

function courseSidebar(course, current, pages) {
  const links = pages
    .filter((page) => page.relative !== "progress.md")
    .map((page) => `<li><a href="${relativeHref(current.route, page.route)}"${page.route === current.route ? ' aria-current="page"' : ""}>${escapeHtml(page.navTitle)}</a></li>`)
    .join("\n");
  const graph = course.hasGraph ? `<p class="sidebar-note"><a href="${relativeHref(current.route, `/${course.slug}/graph.html`)}">Open learning graph</a></p>` : "";
  return `<div class="sidebar-label">Course</div><h2>${escapeHtml(course.title)}</h2><ul>${links}</ul>${graph}`;
}

async function buildCourse(courseEntry) {
  const slug = courseEntry.name;
  const courseDir = path.join(COURSES_DIR, slug);
  const sourceFiles = await markdownFiles(courseDir);
  const pages = [];
  for (const sourceFile of sourceFiles) {
    const source = await readFile(sourceFile.absolute, "utf8");
    const parsed = parseFrontmatter(source);
    const route = routeFor(slug, sourceFile.relative);
    const title = titleFromMarkdown(parsed.body, slugLabel(sourceFile.relative));
    pages.push({
      ...sourceFile,
      ...parsed,
      route,
      title,
      navTitle: sourceFile.relative === "index.md" ? "Overview" : title,
    });
  }
  pages.sort((a, b) => a.relative.localeCompare(b.relative, undefined, { numeric: true }));
  const routeMap = new Map();
  for (const page of pages) {
    const key = normalizeKey(page.relative);
    routeMap.set(key, page.route);
    routeMap.set(path.posix.basename(key), page.route);
  }
  const indexPage = pages.find((page) => page.relative === "index.md") || pages[0];
  const course = {
    slug,
    title: String(indexPage?.attributes.topic || indexPage?.title || slugLabel(slug)),
    description: indexPage ? titleFromMarkdown(indexPage.body, "") : "",
    status: String(indexPage?.attributes.status || "active"),
    hasGraph: courseEntry.hasGraph,
  };
  const nodePages = pages.filter((page) => page.relative.startsWith("nodes/")).sort((a, b) => a.relative.localeCompare(b.relative, undefined, { numeric: true }));
  for (const [index, page] of pages.entries()) {
    const html = renderMarkdown(page.body, page, routeMap);
    const previous = nodePages[nodePages.indexOf(page) - 1];
    const next = nodePages[nodePages.indexOf(page) + 1];
    const nav = nodePages.includes(page)
      ? `<nav class="page-nav" aria-label="Lesson navigation">${previous ? `<a href="${relativeHref(page.route, previous.route)}"><small>Previous</small>${escapeHtml(previous.title)}</a>` : ""}${next ? `<a href="${relativeHref(page.route, next.route)}"><small>Next</small>${escapeHtml(next.title)}</a>` : ""}</nav>`
      : "";
    const output = pageDocument({
      title: page.title,
      body: `${html}${nav}`,
      course,
      current: page,
      sidebar: courseSidebar(course, page, pages),
      extraHead: mermaidScript(html),
    });
    const outputPath = path.join(DIST_DIR, page.route.replace(/^\//, ""), "index.html");
    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, output);
    pages[index].outputPath = outputPath;
  }
  if (courseEntry.hasGraph) {
    const graphOutput = path.join(DIST_DIR, slug, "graph.html");
    await mkdir(path.dirname(graphOutput), { recursive: true });
    await cp(path.join(courseDir, "graph.html"), graphOutput);
  }
  return { ...course, pages, nodeCount: nodePages.length };
}

async function buildHome(courses) {
  const cards = courses
    .sort((a, b) => a.title.localeCompare(b.title))
    .map((course) => `<a class="course-card" href="/${course.slug}/"><h2>${escapeHtml(course.title)}</h2><p>${escapeHtml(course.description)}</p><div class="course-meta"><span>${course.nodeCount} lessons</span><span class="course-status">${escapeHtml(course.status)}</span></div></a>`)
    .join("\n");
  const current = { route: "/", title: "Courses" };
  const body = `<section class="content"><p class="sidebar-label">Adaptive study library</p><h1>Learn by building a path.</h1><p>Courses generated by the adaptive-learning skill, published as a searchable static library.</p>${cards ? `<div class="course-grid">${cards}</div>` : "<p>No courses found yet. Generate one with the adaptive-learning skill.</p>"}</section>`;
  await writeFile(path.join(DIST_DIR, "index.html"), pageDocument({ title: "Courses", body, current }));
}

async function main() {
  await rm(DIST_DIR, { recursive: true, force: true });
  await mkdir(PUBLIC_DIR, { recursive: true });
  await writeFile(path.join(PUBLIC_DIR, "site.css"), CSS);
  const entries = (await readdir(COURSES_DIR, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
    .sort((a, b) => a.name.localeCompare(b.name));
  const courseEntries = [];
  for (const entry of entries) {
    const files = await readdir(path.join(COURSES_DIR, entry.name));
    if (!files.includes("index.md")) continue;
    courseEntries.push({ name: entry.name, hasGraph: files.includes("graph.html") });
  }
  const courses = [];
  for (const entry of courseEntries) courses.push(await buildCourse(entry));
  await buildHome(courses);
  await writeFile(path.join(DIST_DIR, "404.html"), pageDocument({ title: "Not found", body: "<section class=\"content\"><h1>Page not found</h1><p><a href=\"/\">Return to all courses</a>.</p></section>", current: { route: "/404.html", title: "Not found" } }));
  console.log(`Generated ${courses.length} course${courses.length === 1 ? "" : "s"} in dist/`);
  for (const course of courses) console.log(`- ${course.title}: ${course.nodeCount} lessons`);
  for (const warning of warnings) console.warn(`Warning: ${warning}`);
}

await main();
