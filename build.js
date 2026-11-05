/**
 * SABUJ // CYBERSPACE - Modular Workspace Compiler & Watcher
 * Assembles modular HTML sections (sections/) into index.html
 * and modular CSS modules (css/modules/) into css/style.css
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const TEMPLATE_FILE = path.join(ROOT_DIR, 'index.template.html');
const OUTPUT_HTML = path.join(ROOT_DIR, 'index.html');
const SECTIONS_DIR = path.join(ROOT_DIR, 'sections');

const CSS_MODULES_DIR = path.join(ROOT_DIR, 'css', 'modules');
const OUTPUT_CSS = path.join(ROOT_DIR, 'css', 'style.css');

// Ordered list of CSS modules to preserve cascade rules
const CSS_ORDER = [
  'variables.css',
  'base.css',
  'background.css',
  'boot.css',
  'nav.css',
  'hero.css',
  'terminal-section.css',
  'terminal.css',
  'about.css',
  'skills.css',
  'projects.css',
  'labs.css',
  'certs.css',
  'writeups.css',
  'contact.css',
  'modal.css',
  'footer.css',
  'hud.css',
  'simulators.css',
  'card-tilt.css',
  'radar.css',
  'animations.css',
  'cursor.css',
  'detail-page.css',
  'responsive.css'
];

function buildHTML() {
  const startTime = Date.now();
  if (!fs.existsSync(TEMPLATE_FILE)) {
    console.error(`[ERROR] Template file not found: ${TEMPLATE_FILE}`);
    return;
  }

  let template = fs.readFileSync(TEMPLATE_FILE, 'utf8');
  let includedCount = 0;

  const includePattern = /<!--\s*include:\s*([^\s>]+)\s*-->/g;
  template = template.replace(includePattern, (match, filePath) => {
    const fullPath = path.join(ROOT_DIR, filePath);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      includedCount++;
      return content.trim();
    } else {
      console.warn(`  ! [WARN] File not found: ${filePath}`);
      return `<!-- Missing: ${filePath} -->`;
    }
  });

  fs.writeFileSync(OUTPUT_HTML, template, 'utf8');
  const elapsed = Date.now() - startTime;
  console.log(`[HTML-BUILD] Compiled ${includedCount} sections -> index.html (${elapsed}ms)`);
}

function buildCSS() {
  const startTime = Date.now();
  if (!fs.existsSync(CSS_MODULES_DIR)) {
    console.error(`[ERROR] CSS modules directory not found: ${CSS_MODULES_DIR}`);
    return;
  }

  let compiledCSS = `/**\n * SABUJ // CYBERSPACE - Master Compiled Stylesheet\n * Generated automatically by build.js\n * Source: css/modules/\n */\n\n`;

  let count = 0;
  CSS_ORDER.forEach(filename => {
    const filePath = path.join(CSS_MODULES_DIR, filename);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      compiledCSS += `/* --- [MODULE: ${filename}] --- */\n` + content.trim() + '\n\n';
      count++;
    } else {
      console.warn(`  ! [WARN] CSS module not found: ${filename}`);
    }
  });

  fs.writeFileSync(OUTPUT_CSS, compiledCSS, 'utf8');
  const elapsed = Date.now() - startTime;
  console.log(`[CSS-BUILD]  Bundled ${count} modules -> css/style.css (${elapsed}ms)`);
}

function buildAll() {
  console.log('\n[CYBER-WORKSPACE] Recompiling modular assets...');
  buildHTML();
  buildCSS();
  console.log('[CYBER-WORKSPACE] Workspace build complete!\n');
}

// Initial Build
buildAll();

// Watcher mode
if (process.argv.includes('--watch')) {
  console.log('[WATCHER] CyberSpace File Watcher active.');
  console.log('          Monitoring sections/, css/modules/, and index.template.html...\n');

  let htmlTimer, cssTimer;

  // Watch HTML template & sections
  fs.watch(TEMPLATE_FILE, () => {
    clearTimeout(htmlTimer);
    htmlTimer = setTimeout(() => {
      console.log('[WATCHER] Detected template modification.');
      buildHTML();
    }, 80);
  });

  if (fs.existsSync(SECTIONS_DIR)) {
    fs.watch(SECTIONS_DIR, (eventType, filename) => {
      if (filename && filename.endsWith('.html')) {
        clearTimeout(htmlTimer);
        htmlTimer = setTimeout(() => {
          console.log(`[WATCHER] Detected HTML change: sections/${filename}`);
          buildHTML();
        }, 80);
      }
    });
  }

  // Watch CSS modules
  if (fs.existsSync(CSS_MODULES_DIR)) {
    fs.watch(CSS_MODULES_DIR, (eventType, filename) => {
      if (filename && filename.endsWith('.css')) {
        clearTimeout(cssTimer);
        cssTimer = setTimeout(() => {
          console.log(`[WATCHER] Detected CSS change: css/modules/${filename}`);
          buildCSS();
        }, 80);
      }
    });
  }
}
