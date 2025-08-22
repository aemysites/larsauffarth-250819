/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Get the heading (keep as is, preserve h3 semantics)
  const heading = element.querySelector('.title');

  // 2. Find all .col.col-3 ul columns inside .content, in the order they appear
  const columnLists = element.querySelectorAll('.content > ul.col');

  // 3. For each UL, reference it directly (do NOT clone)
  const columns = Array.from(columnLists);

  // 4. Compose cells for the Columns (columns38) block
  const cells = [
    ['Columns (columns38)'],
    columns
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // 5. Replace section content: insert heading before the block table if found, then replace original element
  if (heading) {
    // Remove heading from its old place (if present) and insert it before the table
    heading.parentNode && heading.parentNode.removeChild(heading);
    element.parentNode.insertBefore(heading, element);
  }
  element.replaceWith(table);
}
