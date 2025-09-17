/* global WebImporter */
export default function parse(element, { document }) {
  // Find the desktop footer nav wrapper (the visible columns block)
  const desktopWrapper = element.querySelector('.footer-nav-wrapper.desktop');
  if (!desktopWrapper) return;

  // Get all direct children (columns) of the desktop wrapper
  const columns = Array.from(desktopWrapper.children);
  if (!columns.length) return;

  // The header row for the columns block
  const headerRow = ['Columns (columns8)'];

  // For each column, collect all its text content and links (not just the element)
  const columnsRow = columns.map(col => {
    // Create a fragment to hold all content from the column
    const frag = document.createDocumentFragment();
    // Clone all children to preserve structure and text
    Array.from(col.childNodes).forEach(node => {
      frag.appendChild(node.cloneNode(true));
    });
    return frag;
  });

  // Build the table rows array
  const tableRows = [headerRow, columnsRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element with the new block table
  element.replaceWith(block);
}
