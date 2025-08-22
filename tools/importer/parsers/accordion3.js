/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match spec
  const headerRow = ['Accordion (accordion3)'];

  // Find the main content block
  const postContent = element.querySelector('.post-content');
  if (!postContent) return;

  // Collect headings to split accordion items
  // Only consider h2.wp-block-heading and h3.wp-block-heading (do not include 'Sources' section)
  const headings = [];
  const children = Array.from(postContent.children);
  for (let i = 0; i < children.length; i++) {
    const el = children[i];
    // Stop collecting after we reach 'Sources' heading
    if (
      (el.tagName === 'H2' && el.classList.contains('wp-block-heading')) &&
      el.textContent.trim().toLowerCase().startsWith('sources')
    ) {
      break;
    }
    if (
      (el.tagName === 'H2' && el.classList.contains('wp-block-heading')) ||
      (el.tagName === 'H3' && el.classList.contains('wp-block-heading'))
    ) {
      headings.push({ heading: el, idx: i });
    }
  }

  // If no headings found, don't build block
  if (headings.length === 0) return;

  // Build accordion rows
  const rows = [];
  for (let i = 0; i < headings.length; i++) {
    const titleEl = headings[i].heading;
    // Get all elements between this heading and next heading
    const startIdx = headings[i].idx + 1;
    const endIdx = i + 1 < headings.length ? headings[i + 1].idx : children.length;
    const contentEls = [];
    for (let j = startIdx; j < endIdx; j++) {
      // Only include elements that are not empty
      const child = children[j];
      if (child && (child.textContent.trim() || child.querySelector('img,a,ul,ol'))) {
        contentEls.push(child);
      }
    }
    // Always reference existing elements (do not clone)
    rows.push([titleEl, contentEls]);
  }

  // Compose table cell structure
  const cells = [headerRow, ...rows];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original content block
  postContent.replaceWith(block);
}
