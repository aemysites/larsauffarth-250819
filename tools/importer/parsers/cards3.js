/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the actual columns block structure
  const columnsWrapper = element.querySelector('.columns-wrapper');
  if (!columnsWrapper) return;
  const columnsBlock = columnsWrapper.querySelector('.columns.block');
  if (!columnsBlock) return;
  // The first row of the table: the block/component name
  const cells = [['Cards']];

  // The cards container is columnsBlock's first child
  const containerDiv = columnsBlock.children[0];
  if (!containerDiv) return;
  // Each card is a direct child div of containerDiv
  const cardDivs = Array.from(containerDiv.children).filter(child => child.tagName === 'DIV');

  cardDivs.forEach((cardDiv) => {
    // The structure inside each cardDiv is 3 <p> tags: 1st contains <picture>, 2nd is title, 3rd is button
    const paragraphs = Array.from(cardDiv.querySelectorAll(':scope > p'));
    let image = null;
    let title = null;
    let button = null;
    if (paragraphs.length > 0) {
      // First p contains the image/picture
      const pic = paragraphs[0].querySelector('picture');
      if (pic) image = pic;
      else {
        const img = paragraphs[0].querySelector('img');
        if (img) image = img;
      }
    }
    if (paragraphs.length > 1) {
      title = paragraphs[1]; // May be plain text, but keep as <p>
    }
    if (paragraphs.length > 2) {
      button = paragraphs[2]; // button container <p>
    }
    // Compose text cell: always include title if present, and button if present
    const textCell = [];
    if (title) textCell.push(title);
    if (button) textCell.push(button);
    cells.push([
      image,
      textCell.length > 0 ? textCell : ''
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
