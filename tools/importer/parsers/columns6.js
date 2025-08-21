/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns block wrapper ('.columns') inside the provided element
  let columnsBlock = element.querySelector('.columns');
  if (!columnsBlock) {
    // fallback if a wrapper with class 'columns' is not present
    return;
  }

  // In the provided HTML, the columns are contained in: .columns > div > [columns-img-col | content]
  // The first child of .columns is a div that contains the two columns (as divs)
  // So get .columns > div (the container for the two columns)
  const columnsContainer = columnsBlock.querySelector(':scope > div');
  if (!columnsContainer) return;

  // The two columns are the direct children
  const columnDivs = Array.from(columnsContainer.children);
  if (!columnDivs.length) return;

  // Build table rows
  const headerRow = ['Columns (columns6)'];
  const columnsRow = columnDivs;

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow
  ], document);

  element.replaceWith(table);
}
