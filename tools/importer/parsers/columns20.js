/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the main columns block
  const columnsWrapper = element.querySelector('.wp-block-columns');
  if (!columnsWrapper) return;

  // Identify each column in the block (should be two for this layout)
  const columnEls = Array.from(columnsWrapper.children).filter(c => c.classList.contains('wp-block-column'));

  // For each column, gather all children (images, lists, text, etc.), preserving their order
  const columns = columnEls.map(col => {
    // Exclude empty text nodes
    const contentNodes = Array.from(col.childNodes).filter(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        return !!node.textContent.trim();
      }
      return true;
    });
    // If only one node, return it directly; otherwise, return array
    return contentNodes.length === 1 ? contentNodes[0] : contentNodes;
  });

  // Compose the columns block table
  const cells = [
    ['Columns (columns20)'],
    columns
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original columns block in the DOM
  columnsWrapper.replaceWith(block);
}
