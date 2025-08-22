/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main article body with the content
  const mainSection = element.querySelector('.article-content .wrapper .container .article-body .content-article .post-content');

  // Edge case: if not found, abort
  if (!mainSection) return;

  // Optimization: get all direct children that are actual elements (ignore text nodes)
  const children = Array.from(mainSection.childNodes).filter(node => node.nodeType === 1);

  // Find the promo container (last meta paragraph)
  const promo = children.find(el => el.classList.contains('promomat-container'));

  // Find group block (À retenir)
  const groupBlock = children.find(el => el.classList.contains('wp-block-group'));

  // We'll split content into two logical parts for columns:
  // Column 1: All content except promo and groupBlock (main info)
  // Column 2: groupBlock (À retenir box)
  // For the screenshot structure, a two-column layout is appropriate

  // Gather all nodes before groupBlock
  let groupIdx = children.indexOf(groupBlock);
  let topContent = groupIdx >= 0 ? children.slice(0, groupIdx) : children.slice();
  // Remove promo if present
  topContent = topContent.filter(el => el !== promo);
  // Remove empty elements, if any
  topContent = topContent.filter(el => {
    if (!el.textContent.trim() && !el.querySelector('img')) return false;
    return true;
  });

  // Compose left column (main info)
  const leftCol = document.createElement('div');
  topContent.forEach(el => leftCol.appendChild(el));

  // Compose right column (à retenir group)
  let rightCol = null;
  if (groupBlock) {
    rightCol = document.createElement('div');
    rightCol.appendChild(groupBlock);
  }

  // Build the table row: if rightCol exists, use two columns, else just one
  const headerRow = ['Columns (columns21)'];
  const columnsRow = rightCol ? [leftCol, rightCol] : [leftCol];

  // Create the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow
  ], document);

  // Replace element with table
  element.replaceWith(table);
}
