/* global WebImporter */
export default function parse(element, { document }) {
  // Get all immediate card columns
  const cardNodes = Array.from(element.querySelectorAll(':scope > div > div'));

  // Header row as specified
  const headerRow = ['Cards (cards4)'];

  // Helper to extract icon and text content from each card
  function extractCardContent(card) {
    // Find the content wrapper
    const wrapper = card.querySelector('.columns-content-wrapper');
    if (!wrapper) return ['', ''];

    // Icon: find the span.icon (contains svg)
    const iconSpan = wrapper.querySelector('.icon');
    const iconCell = iconSpan || '';

    // Text: collect ALL non-empty <h3> and <p> elements in order
    const textCell = [];
    Array.from(wrapper.children).forEach(child => {
      if (child.tagName === 'H3' && child.textContent.trim()) {
        textCell.push(child);
      }
      if (child.tagName === 'P' && child.textContent.trim()) {
        textCell.push(child);
      }
    });

    return [iconCell, textCell];
  }

  // Build rows for each card
  const rows = cardNodes.map(card => extractCardContent(card));

  // Compose table data
  const cells = [headerRow, ...rows];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with block table
  element.replaceWith(block);
}
