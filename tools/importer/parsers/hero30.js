/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: always exactly as in the spec
  const headerRow = ['Hero (hero30)'];

  // 2nd row: Image (background image)
  let imageCell = null;
  const img = element.querySelector('img');
  if (img) {
    imageCell = img;
  } else {
    imageCell = '';
  }

  // 3rd row: Heading, subheading, cta etc (in order)
  const textContainer = element.querySelector('.text-container');
  let textCell = [];
  if (textContainer) {
    // Add any label (subheading)
    const label = textContainer.querySelector('.label-hp');
    if (label) textCell.push(label);
    // Add heading (h1)
    const h1 = textContainer.querySelector('h1');
    if (h1) textCell.push(h1);
    // Add graphic-line (svg decoration) if present
    const graphicLine = textContainer.querySelector('.graphic-line');
    if (graphicLine) textCell.push(graphicLine);
  } else {
    // fallback in case structure is different or missing
    // try to find h1 and .label-hp in the main element
    const label = element.querySelector('.label-hp');
    if (label) textCell.push(label);
    const h1 = element.querySelector('h1');
    if (h1) textCell.push(h1);
    const graphicLine = element.querySelector('.graphic-line');
    if (graphicLine) textCell.push(graphicLine);
  }
  if (textCell.length === 0) textCell = [''];

  // Compose block table
  const cells = [
    headerRow,
    [imageCell],
    [textCell]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
