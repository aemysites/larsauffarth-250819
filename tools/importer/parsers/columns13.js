/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly as specified
  const headerRow = ['Columns (columns13)'];

  // Get columns: direct children with 'col' class.
  const columns = Array.from(element.querySelectorAll(':scope > .col'));
  let dataRow = [];

  if (columns.length === 2) {
    // Reference the EXISTING left and right columns (not clones!)
    const leftCol = columns[0];
    const rightCol = columns[1];

    // For the right column: if there is an iframe, replace ONLY the iframe with a link, keeping all other content.
    const iframe = rightCol.querySelector('iframe');
    if (iframe) {
      // Create a link element as required
      const a = document.createElement('a');
      a.href = iframe.src;
      a.textContent = iframe.title || 'Video Link';

      // Replace the iframe with the link in the rightCol
      iframe.replaceWith(a);
    }
    // Reference the original left and right columns directly
    dataRow = [leftCol, rightCol];
  } else {
    // fallback for edge cases: put all content in a single cell
    dataRow = [element];
  }

  // Construct and insert the block table
  const cells = [headerRow, dataRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
