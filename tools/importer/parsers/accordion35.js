/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the main content section
  const articleBody = element.querySelector('.article-body .content-article .post-content');
  if (!articleBody) return;

  const rows = [];
  // Header row as per spec
  rows.push(['Accordion (accordion35)']);

  const children = Array.from(articleBody.childNodes);
  let i = 0;
  while (i < children.length) {
    const node = children[i];
    // Identify accordion section start at H3
    if (node.nodeType === 1 && node.tagName === 'H3') {
      const title = node; // Reference the actual H3 element
      const contentNodes = [];
      i++;
      // Collect content until next H3 or H2 (or end)
      while (
        i < children.length &&
        !(children[i].nodeType === 1 && (children[i].tagName === 'H3' || children[i].tagName === 'H2'))
      ) {
        const el = children[i];
        // Only include meaningful elements/text
        if (
          (el.nodeType === 1 && el.textContent.trim() !== '') ||
          (el.nodeType === 3 && el.textContent.trim() !== '')
        ) {
          contentNodes.push(el);
        }
        i++;
      }
      // If there is content, add as row; else add empty string
      rows.push([title, contentNodes.length ? contentNodes : '']);
    } else {
      i++;
    }
  }

  // Only replace if we actually have accordion items
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}