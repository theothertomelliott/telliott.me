import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import TurndownService from 'turndown';
import { JSDOM } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const EXPORT_DIR = path.join(ROOT, 'substack_export');
const POSTS_CSV = path.join(EXPORT_DIR, 'posts.csv');
const HTML_DIR = path.join(EXPORT_DIR, 'posts');
const OUTPUT_DIR = path.join(ROOT, 'src', 'blog');

// Simple CSV parser that handles quoted fields with commas
function parseCSV(text) {
  const lines = text.split('\n').filter(l => l.trim());
  const headers = parseCSVLine(lines[0]);
  return lines.slice(1).map(line => {
    const values = parseCSVLine(line);
    const obj = {};
    headers.forEach((h, i) => obj[h] = values[i] || '');
    return obj;
  });
}

function parseCSVLine(line) {
  const fields = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        fields.push(current);
        current = '';
      } else {
        current += ch;
      }
    }
  }
  fields.push(current);
  return fields;
}

// Configure turndown
const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
});

// Handle Substack image containers
turndown.addRule('substackImages', {
  filter: function (node) {
    return node.classList && node.classList.contains('captioned-image-container');
  },
  replacement: function (content, node) {
    const img = node.querySelector('img');
    if (!img) return content;
    const src = img.getAttribute('src') || '';
    const alt = img.getAttribute('alt') || '';
    const figcaption = node.querySelector('figcaption');
    const caption = figcaption ? figcaption.textContent.trim() : '';
    if (caption) {
      return `\n\n![${alt || caption}](${src})\n*${caption}*\n\n`;
    }
    return `\n\n![${alt}](${src})\n\n`;
  }
});

// Handle Substack buttons/subscribe links - remove them
turndown.addRule('substackButtons', {
  filter: function (node) {
    return node.classList && (
      node.classList.contains('subscription-widget-wrap') ||
      node.classList.contains('button-wrapper')
    );
  },
  replacement: function () {
    return '';
  }
});

// Preserve iframes (e.g. Datawrapper embeds) as raw HTML
turndown.addRule('iframes', {
  filter: 'iframe',
  replacement: function (content, node) {
    const src = node.getAttribute('src') || '';
    const width = node.getAttribute('width') || '100%';
    const height = node.getAttribute('height') || '400';
    const title = node.getAttribute('title') || '';
    return `\n\n<iframe src="${src}" width="${width}" height="${height}" title="${title}" frameborder="0" scrolling="no"></iframe>\n\n`;
  }
});

// Handle code blocks
turndown.addRule('preCode', {
  filter: function (node) {
    return node.nodeName === 'PRE' && node.querySelector('code');
  },
  replacement: function (content, node) {
    const code = node.querySelector('code');
    const lang = code.className ? code.className.replace('language-', '') : '';
    const text = code.textContent;
    return `\n\n\`\`\`${lang}\n${text}\n\`\`\`\n\n`;
  }
});

function escapeYaml(str) {
  if (!str) return '""';
  // If it contains special chars, wrap in double quotes and escape internal quotes
  if (str.includes(':') || str.includes('"') || str.includes("'") || str.includes('#') || str.includes(',') || str.includes('?') || str.includes('!')) {
    return `"${str.replace(/"/g, '\\"')}"`;
  }
  return `"${str}"`;
}

function main() {
  // Parse CSV
  const csvText = fs.readFileSync(POSTS_CSV, 'utf-8');
  const posts = parseCSV(csvText);

  // Filter to published posts only
  const published = posts.filter(p => p.is_published === 'true' && p.post_date);

  // Sort by date ascending (oldest first)
  published.sort((a, b) => new Date(a.post_date) - new Date(b.post_date));

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log(`Found ${published.length} published posts to convert.\n`);

  let converted = 0;
  let skipped = 0;

  for (let i = 0; i < published.length; i++) {
    const post = published[i];
    const postId = post.post_id;
    const slug = postId.split('.').slice(1).join('.');

    // Find the HTML file
    const htmlFiles = fs.readdirSync(HTML_DIR).filter(f =>
      f.startsWith(postId.split('.')[0] + '.') && f.endsWith('.html')
    );

    if (htmlFiles.length === 0) {
      console.log(`  SKIP: No HTML file found for ${postId}`);
      skipped++;
      continue;
    }

    const htmlPath = path.join(HTML_DIR, htmlFiles[0]);
    const html = fs.readFileSync(htmlPath, 'utf-8');

    // Skip very short posts (likely drafts/stubs that got published)
    if (html.length < 100) {
      console.log(`  SKIP: ${slug} (HTML too short, likely a stub)`);
      skipped++;
      continue;
    }

    // Parse HTML to extract first image for frontmatter
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    // Find the first captioned-image-container (hero image)
    let imageUrl = '';
    let imageCaption = '';
    let imageAlt = '';
    const firstImageContainer = doc.querySelector('.captioned-image-container');
    if (firstImageContainer) {
      const img = firstImageContainer.querySelector('img');
      if (img) {
        imageUrl = img.getAttribute('src') || '';
        const figcaption = firstImageContainer.querySelector('figcaption');
        // Full text (including any URL attribution) becomes the caption
        imageCaption = img.getAttribute('alt') || (figcaption ? figcaption.textContent.trim() : '') || '';
        // Alt text is the caption with URLs stripped out
        imageAlt = imageCaption.replace(/https?:\/\/\S+/gi, '').replace(/\s{2,}/g, ' ').trim();
        // Remove trailing colon/dash left over after URL removal
        imageAlt = imageAlt.replace(/[\s:-]+$/, '').trim();
        if (!imageAlt) imageAlt = imageCaption;
      }
      // Remove it from the DOM so it doesn't appear in the body
      firstImageContainer.remove();
    }

    // Replace LaTeX blocks with placeholders (Turndown escapes backslashes, so we swap them back after)
    const latexExpressions = [];
    doc.querySelectorAll('.latex-rendered').forEach(el => {
      try {
        const attrs = JSON.parse(el.getAttribute('data-attrs') || '{}');
        const expr = attrs.persistentExpression || '';
        if (expr) {
          const placeholder = `LATEX_PLACEHOLDER_${latexExpressions.length}`;
          latexExpressions.push(expr);
          const p = doc.createElement('p');
          p.textContent = placeholder;
          el.replaceWith(p);
        } else {
          el.remove();
        }
      } catch (e) {
        el.remove();
      }
    });

    // Remove subscription widgets, subscribe components, captioned buttons, and script tags
    doc.querySelectorAll('.subscription-widget').forEach(el => el.remove());
    doc.querySelectorAll('[data-component-name="SubscribeWidgetToDOM"]').forEach(el => el.remove());
    doc.querySelectorAll('[data-component-name="CaptionedButtonToDOM"]').forEach(el => el.remove());
    doc.querySelectorAll('[data-component-name="ButtonCreateButton"]').forEach(el => el.remove());
    doc.querySelectorAll('script').forEach(el => el.remove());

    // Log unknown embedded components
    const knownComponents = new Set([
      'Image2ToDOM', 'LatexBlockToDOM', 'DatawrapperToDOM',
      'ButtonWithIconToDOM', 'CaptionedImage2ToDOM',
      'SubscribeWidgetToDOM', 'CaptionedButtonToDOM', 'ButtonCreateButton',
      'BlueskyCreateBlueskyEmbed',
    ]);
    doc.querySelectorAll('[data-component-name]').forEach(el => {
      const name = el.getAttribute('data-component-name');
      if (!knownComponents.has(name)) {
        console.warn(`  ⚠ Unknown component "${name}" in ${slug}`);
      }
    });

    // Convert the remaining HTML to markdown
    let markdown = turndown.turndown(doc.body.innerHTML);

    // Convert #### headings to ## and strip bold markers from heading text
    markdown = markdown.replace(/^#{3,}\s+\*\*(.+?)\*\*/gm, '## $1');
    markdown = markdown.replace(/^#{3,}\s+/gm, '## ');

    // Replace LaTeX placeholders with $$ blocks
    // Using function replacer because String.replace treats $$ as escape for literal $
    latexExpressions.forEach((expr, idx) => {
      const mathBlock = `$$\n${expr}\n$$`;
      markdown = markdown.replace(`LATEX\\_PLACEHOLDER\\_${idx}`, () => mathBlock);
      markdown = markdown.replace(`LATEX_PLACEHOLDER_${idx}`, () => mathBlock);
    });

    // Clean up excessive whitespace
    markdown = markdown.replace(/\n{3,}/g, '\n\n').trim();

    // Build frontmatter
    const pubDate = new Date(post.post_date);
    const dateStr = pubDate.toISOString().split('T')[0];
    const title = escapeYaml(post.title.trim());
    const description = escapeYaml(post.subtitle.trim());

    // Date prefix for ordering: yyyymmdd
    const yyyy = pubDate.getUTCFullYear();
    const mm = String(pubDate.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(pubDate.getUTCDate()).padStart(2, '0');
    const filename = `${yyyy}${mm}${dd}-${slug}.md`;

    let frontmatter = `---
title: ${title}
slug: "${slug}"
pubDate: ${dateStr}
description: ${description}
author: "Tom Elliott"`;
    if (imageUrl) {
      frontmatter += `\nimage:\n  url: ${escapeYaml(imageUrl)}\n  alt: ${escapeYaml(imageAlt)}\n  caption: ${escapeYaml(imageCaption)}`;
    }
    frontmatter += `\n---`;

    const output = `${frontmatter}\n\n${markdown}\n`;
    const outputPath = path.join(OUTPUT_DIR, filename);

    fs.writeFileSync(outputPath, output, 'utf-8');
    console.log(`  ${filename}`);
    converted++;
  }

  console.log(`\nDone! Converted ${converted} posts, skipped ${skipped}.`);
}

main();
