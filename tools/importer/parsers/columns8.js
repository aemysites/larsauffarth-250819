/* global WebImporter */
export default function parse(element, { document }) {
  // This block is for Columns (columns8), two columns: left: main article, right: comments
  // Find left column (main content)
  let leftCol = null;
  let rightCol = null;

  // Try to find the post-content for left column
  leftCol = element.querySelector('.post-content');
  // Try to find the comment box for right column
  rightCol = element.querySelector('.comment-box');

  // Defensive: if not found, fall back to an empty div
  if (!leftCol) {
    leftCol = document.createElement('div');
  }
  if (!rightCol) {
    rightCol = document.createElement('div');
  }

  // Block header row must match exactly
  const headerRow = ['Columns (columns8)'];
  // Content row: leftCol and rightCol as referenced elements
  const contentRow = [leftCol, rightCol];

  // Create table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace element with table
  element.replaceWith(table);
}
