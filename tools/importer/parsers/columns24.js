/* global WebImporter */
export default function parse(element, { document }) {
  // Define the header row exactly as required
  const headerRow = ['Columns (columns24)'];

  // Find the left column (logos/links)
  const aside = element.querySelector('aside');
  let logosCell = '';
  if (aside) {
    // Reference all logo links inside the aside
    // Each <a> contains a <figure><img></figure>
    const logoLinks = Array.from(aside.querySelectorAll(':scope > a'));
    // Place all <a> elements in the cell
    logosCell = logoLinks;
  }

  // Find the right column (content)
  const content = element.querySelector('div.content');
  let contentCell = '';
  if (content) {
    // Reference all existing elements in order
    contentCell = Array.from(content.children);
  }

  // Compose the block table: 2 columns, 1 header row
  const cells = [
    headerRow,
    [logosCell, contentCell],
  ];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
