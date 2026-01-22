/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the inner columns block
  const columnsBlock = element.querySelector('.columns');
  if (!columnsBlock) return;

  // Get all immediate card containers (each card is a direct child div)
  const cardDivs = columnsBlock.querySelectorAll(':scope > div');

  // Prepare table rows
  const rows = [];
  // Header row as required
  rows.push(['Cards (cards6)']);

  // For each card
  cardDivs.forEach((cardDiv) => {
    // Find the image (picture inside p.image-wrapper-el)
    const imageWrapper = cardDiv.querySelector('p.image-wrapper-el');
    let imageEl = null;
    if (imageWrapper) {
      // Use the whole picture element for best resilience
      const picture = imageWrapper.querySelector('picture');
      if (picture) imageEl = picture;
    }

    // Compose the text cell: number tag, heading, description
    const textEls = [];
    // Number tag (h4)
    const numberTag = cardDiv.querySelector('h4');
    if (numberTag) textEls.push(numberTag);
    // Heading (h3)
    const heading = cardDiv.querySelector('h3');
    if (heading) textEls.push(heading);
    // Description (first p not image-wrapper)
    const descPs = Array.from(cardDiv.querySelectorAll('p')).filter(p => !p.classList.contains('image-wrapper-el'));
    descPs.forEach(p => textEls.push(p));

    // Add row: [image, text]
    rows.push([
      imageEl || '',
      textEls
    ]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
