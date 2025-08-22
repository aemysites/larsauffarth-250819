/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly matching the block name
  const headerRow = ['Columns (columns23)'];

  // Get all immediate children with class 'content' (the columns)
  const columns = Array.from(element.querySelectorAll(':scope > .content'));
  
  // Edge case: If no columns found, fallback to all direct children
  const cols = columns.length > 0 ? columns : Array.from(element.children);

  // Second row: each column is a single cell, reference the element directly
  const row = cols.map(col => col);

  // Output structure: header row, then content row
  const cells = [headerRow, row];

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace element in the DOM
  element.replaceWith(table);
}
