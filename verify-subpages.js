const fs = require('fs');
const path = require('path');

const dirs = ['projects', 'labs', 'writeups'];
let totalPages = 0;
let errors = [];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
  files.forEach(file => {
    totalPages++;
    const p = path.join(dir, file);
    const html = fs.readFileSync(p, 'utf8');

    // Check basic structure
    if (!html.includes('<!DOCTYPE html>')) errors.push(`${p}: Missing DOCTYPE`);
    if (!html.includes('<html')) errors.push(`${p}: Missing <html> tag`);
    if (!html.includes('</html>')) errors.push(`${p}: Missing </html> tag`);
    if (!html.includes('<body class="detail-page">')) errors.push(`${p}: Missing <body class="detail-page">`);
    if (!html.includes('detail-nav-wrapper')) errors.push(`${p}: Missing detail nav header`);
    if (!html.includes('site-footer')) errors.push(`${p}: Missing footer`);

    // Check CSS link
    if (!html.includes('../css/style.css')) errors.push(`${p}: Missing ../css/style.css`);

    // Check scripts
    const hasThemeHead = html.includes("localStorage.getItem('cyber_theme')");
    const hasThemeJs = html.includes('theme.js');
    const hasAnimationsJs = html.includes('animations.js');
    const hasCursorJs = html.includes('cursor.js');

    // Check links
    const linkMatches = html.matchAll(/href="([^"#]+)(#[^"]*)?"/g);
    for (const match of linkMatches) {
      const link = match[1];
      if (link.startsWith('http') || link.startsWith('data:') || link.startsWith('mailto:')) continue;
      const cleanLink = link.split('?')[0];
      const resolved = path.resolve(dir, cleanLink);
      if (!fs.existsSync(resolved)) {
        errors.push(`${p}: Broken link href="${link}" -> resolved to ${resolved}`);
      }
    }

    console.log(`[PASS] ${p} | themeHead: ${hasThemeHead} | themeJs: ${hasThemeJs} | animJs: ${hasAnimationsJs} | cursorJs: ${hasCursorJs}`);
  });
});

console.log(`\nChecked ${totalPages} detail pages. Found ${errors.length} errors.`);
if (errors.length > 0) {
  console.log('Errors:', errors);
}
