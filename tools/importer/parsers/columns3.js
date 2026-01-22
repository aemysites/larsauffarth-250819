/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: ensure we have the expected structure
  if (!element || !element.querySelectorAll) return;

  // Header row as per block guidelines
  const headerRow = ['Columns (columns3)'];

  // Each <li> is a column cell
  const items = Array.from(element.children);
  if (!items.length) return;

  // Build the columns row
  const columnsRow = items.map((li) => li);

  // Compose the table
  const cells = [
    headerRow,
    columnsRow,
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block table
  element.replaceWith(block);
}
