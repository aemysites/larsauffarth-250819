/* global WebImporter */
export default function parse(element, { document }) {
  // Ensure we select only direct columns
  const columns = Array.from(element.querySelectorAll(':scope > .wp-block-column'));

  // Prepare the columns' contents, preserving all child nodes (text, elements, etc)
  const rowCells = columns.map(col => {
    // Gather all meaningful child nodes
    const nodes = Array.from(col.childNodes).filter(node => {
      // Ignore empty text nodes
      if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return false;
      return true;
    });
    // If only one node, return as single element, else as array
    if (nodes.length === 1) return nodes[0];
    return nodes;
  });

  // The table: header row, then row with n columns
  const table = WebImporter.DOMUtils.createTable([
    ['Columns (columns18)'],
    rowCells
  ], document);

  element.replaceWith(table);
}
