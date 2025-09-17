/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main d-flex row containing the columns
  const dFlex = element.querySelector('.d-flex');
  if (!dFlex) return;

  // Get the two main columns
  const columns = dFlex.querySelectorAll(':scope > div');
  if (columns.length < 2) return;

  // First column: image
  const imgCol = columns[0];
  const img = imgCol.querySelector('img');

  // Second column: content
  const contentCol = columns[1];
  const contentFragments = [];

  // Collect all content from the second column, not just title and paragraphs
  Array.from(contentCol.childNodes).forEach(node => {
    // Include elements with text or lists, skip empty text nodes
    if (node.nodeType === 1) { // Element
      if (
        node.tagName === 'DIV' && node.classList.contains('title') && node.textContent.trim()
      ) {
        contentFragments.push(node);
      } else if (
        node.tagName === 'P' && node.textContent.trim()
      ) {
        contentFragments.push(node);
      } else if (
        node.tagName === 'DIV' && node.classList.contains('flex-col-100')
      ) {
        // Registered States block: include as is
        contentFragments.push(node);
      }
    }
  });

  // Table header
  const headerRow = ['Columns (columns5)'];
  // Table content row: image | content
  const contentRow = [img, contentFragments];

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);
  element.replaceWith(table);
}
