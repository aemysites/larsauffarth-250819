/* global WebImporter */
export default function parse(element, { document }) {
  // Create the header row with a single cell 'Tabs'
  const headerRow = ['Tabs'];
  const rows = [headerRow];

  // Find all tab links
  const tabLinks = element.querySelectorAll('ul.list > li > a');

  // For each tab, create a row with two cells: label and (empty) content
  tabLinks.forEach(link => {
    const label = link.textContent.trim();
    rows.push([label, '']);
  });

  // Create table using WebImporter
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
