import { access, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const projectRoot = path.resolve(import.meta.dirname, '..');
const distRoot = path.join(projectRoot, 'dist');
const htmlFiles = [];

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) await walk(target);
    else if (entry.name.endsWith('.html')) htmlFiles.push(target);
  }
}

function outputTarget(pathname) {
  const decoded = decodeURIComponent(pathname);
  if (decoded.endsWith('/')) return path.join(distRoot, decoded, 'index.html');
  if (path.extname(decoded)) return path.join(distRoot, decoded);
  return path.join(distRoot, decoded, 'index.html');
}

await walk(distRoot);
const missing = [];
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const pagePath = `/${path.relative(distRoot, file).replaceAll(path.sep, '/')}`
    .replace(/index\.html$/u, '');

  for (const [, value] of html.matchAll(/\b(?:href|src)="([^"]+)"/gu)) {
    if (/^(?:[a-z]+:|#|\/\/)/iu.test(value)) continue;
    const pathname = new URL(value, `https://example.invalid${pagePath}`).pathname;
    const target = outputTarget(pathname);
    try {
      await access(target);
    } catch {
      missing.push(`${path.relative(distRoot, file)} -> ${value}`);
    }
  }
}

if (missing.length > 0) {
  console.error(`Broken internal links:\n${missing.map((item) => `- ${item}`).join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(`Checked internal links in ${htmlFiles.length} HTML files.`);
}
