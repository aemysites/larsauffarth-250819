/* global WebImporter */
export default function parse(element, { document }) {
  // Extract all social links
  const links = Array.from(element.querySelectorAll('a'));

  // Create a wrapper for all links, joining them with space as in original
  const colDiv = document.createElement('div');
  links.forEach((link, index) => {
    colDiv.appendChild(link);
    // Add spacing between links but not after the last
    if (index < links.length - 1) {
      colDiv.appendChild(document.createTextNode(' '));
    }
  });

  // Table header matches block name exactly
  const headerRow = ['Columns (columns40)'];
  // Content row: single column with all links in a cell
  const contentRow = [colDiv];

  // Create and replace block table
  const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);
  element.replaceWith(table);
}
