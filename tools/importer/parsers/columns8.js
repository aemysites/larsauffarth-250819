/* global WebImporter */
export default function parse(element, { document }) {
  // Find the desktop wrapper for columns layout
  const desktopWrapper = element.querySelector('.footer-nav-wrapper.desktop');
  if (!desktopWrapper) return;

  // Get all direct children (columns) of the desktop wrapper
  const columnDivs = Array.from(desktopWrapper.querySelectorAll(':scope > div'));
  if (columnDivs.length === 0) return;

  // Build the header row
  const headerRow = ['Columns (columns8)'];

  // For each column, extract its full content (not just the div)
  const columnsRow = columnDivs.map((colDiv) => {
    // If the column contains only a heading, keep it as is
    // If it contains heading + list, wrap both in a fragment
    // If it's a button, keep as is
    // Clone to avoid removing from original DOM
    const frag = document.createDocumentFragment();
    Array.from(colDiv.childNodes).forEach((node) => {
      frag.appendChild(node.cloneNode(true));
    });
    return frag;
  });

  // Build the table
  const cells = [headerRow, columnsRow];
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(blockTable);
}
