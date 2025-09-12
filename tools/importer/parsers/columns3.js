/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Only process if element is a UL with the expected class
  if (!element || element.tagName !== 'UL') return;

  // Get all immediate LI children (each column)
  const columns = Array.from(element.querySelectorAll(':scope > li'));
  if (!columns.length) return;

  // Header row as per spec
  const headerRow = ['Columns (columns3)'];

  // Content row: each LI is a column cell
  const contentRow = columns;

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
