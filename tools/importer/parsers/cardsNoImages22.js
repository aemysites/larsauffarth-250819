/* global WebImporter */
export default function parse(element, { document }) {
  // Header row
  const cells = [['Cards']];

  // Defensive: find card items
  // In this HTML, cards are .block-posts__cta within .block-posts__items
  const itemsContainer = element.querySelector('.block-posts__items');
  if (itemsContainer) {
    const cardItems = itemsContainer.querySelectorAll('.block-posts__cta');
    cardItems.forEach(cardEl => {
      // Collect heading (h3), description (p), and CTA (a.button-round), if present
      const cellContent = [];
      const heading = cardEl.querySelector('h3');
      if (heading) cellContent.push(heading);
      const desc = cardEl.querySelector('p');
      if (desc) cellContent.push(desc);
      const cta = cardEl.querySelector('a.button-round');
      if (cta) cellContent.push(cta);
      // Only add row if there is content
      if (cellContent.length) {
        cells.push([cellContent]);
      }
    });
  }

  // Replace original element with block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
