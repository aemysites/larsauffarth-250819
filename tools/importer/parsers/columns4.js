/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the first .d-flex direct child (the main row)
  const mainRow = element.querySelector('.d-flex');
  if (!mainRow) return;

  // Get the two main columns (image, content)
  const columns = mainRow.querySelectorAll(':scope > div');
  if (columns.length < 2) return;

  // First column: image (already a div with img inside)
  const imageCol = columns[0];

  // Second column: content (name, titles, description, registered states)
  const contentCol = columns[1];

  // We'll use the entire imageCol and contentCol as-is for resilience

  // Table structure: header row, then one row with two columns
  const headerRow = ['Columns (columns4)'];
  const contentRow = [imageCol, contentCol];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
