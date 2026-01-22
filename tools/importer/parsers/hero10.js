/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero section (.article-header)
  const header = element.querySelector('.article-header');
  if (!header) return;

  // Extract background image from .background style for row 2
  let bgImgUrl = '';
  const bgDiv = header.querySelector('.background');
  if (bgDiv && bgDiv.style && bgDiv.style.backgroundImage) {
    const match = bgDiv.style.backgroundImage.match(/url\(['"]?([^'")]+)['"]?\)/);
    if (match) bgImgUrl = match[1];
  }
  let imageElem = null;
  if (bgImgUrl) {
    imageElem = document.createElement('img');
    imageElem.src = bgImgUrl;
    imageElem.alt = '';
  }

  // Row 3: Heading element only (h1)
  let titleElem = header.querySelector('h1');
  // Fallback: look for any h1 inside header
  if (!titleElem) {
    titleElem = header.querySelector('.article-header__title h1') || header.querySelector('h1');
  }

  // Compose block table with 3 rows: header, image, heading
  const cells = [
    ['Hero (hero10)'],
    [imageElem ? imageElem : ''],
    [titleElem ? titleElem : '']
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  header.replaceWith(table);
}
