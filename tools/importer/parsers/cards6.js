/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the actual columns block
  const columnsBlock = element.querySelector('.columns');
  if (!columnsBlock) return;

  // Table header
  const headerRow = ['Cards (cards6)'];
  const rows = [headerRow];

  // Get all direct children that represent cards
  // Each card is a direct child div of the .columns block
  const cardDivs = columnsBlock.querySelectorAll(':scope > div');

  cardDivs.forEach((cardDiv) => {
    // Find the image (picture or img)
    // Defensive: look for .image-wrapper-el > picture or img
    let imageEl = null;
    const imageWrapper = cardDiv.querySelector('.image-wrapper-el');
    if (imageWrapper) {
      imageEl = imageWrapper.querySelector('picture') || imageWrapper.querySelector('img');
    }

    // Compose the text content
    // Title: h3
    const title = cardDiv.querySelector('h3');
    // Description: all p elements except the image wrapper
    const descPs = Array.from(cardDiv.querySelectorAll('p')).filter(p => !p.classList.contains('image-wrapper-el'));
    // Number tag: h4.colored-tag (optional, but present)
    const numberTag = cardDiv.querySelector('h4.colored-tag');

    // Compose the text cell
    const textCellContent = [];
    if (numberTag) textCellContent.push(numberTag);
    if (title) textCellContent.push(title);
    descPs.forEach(p => textCellContent.push(p));

    // Add the row: [image, text]
    rows.push([
      imageEl || '',
      textCellContent
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
