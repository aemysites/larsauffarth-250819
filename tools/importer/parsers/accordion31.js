/* global WebImporter */
export default function parse(element, { document }) {
  // Ensure we are targeting the article block with legal content
  const h1 = element.querySelector('.article-h1');
  const postContent = element.querySelector('.post-content');
  if (!h1 || !postContent) return;

  // Find all top-level h2s in .post-content
  const allH2s = Array.from(postContent.querySelectorAll(':scope > h2'));

  // Prepare the block table
  const cells = [];
  const headerRow = ['Accordion (accordion31)']; // Must match example header
  cells.push(headerRow);

  // For each h2, extract the title and content
  allH2s.forEach((h2, idx) => {
    // Title cell: reference the existing h2 element directly
    const titleCell = h2;
    // Content cell: collect all siblings until the next h2
    const contentEls = [];
    let node = h2.nextElementSibling;
    while (node && node.tagName !== 'H2') {
      contentEls.push(node);
      node = node.nextElementSibling;
    }
    // Only push if either title or content exists
    if (titleCell && contentEls.length > 0) {
      cells.push([titleCell, contentEls]);
    } else if (titleCell) {
      cells.push([titleCell, '']);
    }
  });

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
