/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row: must match target block name exactly
  const headerRow = ['Hero (hero7)'];

  // Background image row: This hero uses a CSS gradient grid, not an <img>, so leave empty
  const backgroundRow = [''];

  // Content row: heading, subheading (if any), CTA
  const contentCell = document.createElement('div');
  const upperContent = element.querySelector('.upper-content');
  if (upperContent) {
    // Heading (h2)
    const heading = upperContent.querySelector('h2');
    if (heading) contentCell.appendChild(heading);
    // Subheading (optional, if present)
    const subheading = upperContent.querySelector('h3, h4, h5, h6, p');
    if (subheading && subheading !== heading) contentCell.appendChild(subheading);
    // CTA button
    const cta = upperContent.querySelector('a.button');
    if (cta) contentCell.appendChild(cta);
  }
  const contentRow = [contentCell];

  // Compose table
  const cells = [headerRow, backgroundRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
