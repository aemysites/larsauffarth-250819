/* global WebImporter */
export default function parse(element, { document }) {
  // The block name from spec
  const headerRow = ['Accordion (accordion9)'];

  // Find the post-content element,
  // which contains the accordion rows (h3 + content pairs)
  const postContent = element.querySelector('.post-content');
  if (!postContent) return;

  // Reference direct children for robust parsing
  const children = Array.from(postContent.children);
  const rows = [headerRow];
  let i = 0;
  while (i < children.length) {
    const child = children[i];
    if (child.tagName === 'H3' && child.classList.contains('wp-block-heading')) {
      // Title is the H3 element (keep formatting)
      const titleElem = child;

      // Gather content until next H3.wp-block-heading or end
      const contentNodes = [];
      i++;
      while (i < children.length && !(children[i].tagName === 'H3' && children[i].classList.contains('wp-block-heading'))) {
        contentNodes.push(children[i]);
        i++;
      }
      // If only one content node, reference it directly; else, pass array
      rows.push([titleElem, contentNodes.length === 1 ? contentNodes[0] : contentNodes]);
    } else {
      i++;
    }
  }

  // Only one block table needed (no Section Metadata block in example)
  // All referenced content comes from existing live elements
  const block = WebImporter.DOMUtils.createTable(rows, document);
  postContent.replaceWith(block);
}
