/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row
  const headerRow = ['Hero (hero12)'];

  // Get background image url from .background div
  let backgroundImgSrc = null;
  const bgDiv = element.querySelector('.background');
  if (bgDiv && bgDiv.style && bgDiv.style.backgroundImage) {
    const match = bgDiv.style.backgroundImage.match(/url\(['"]?(.*?)['"]?\)/);
    if (match && match[1]) {
      backgroundImgSrc = match[1];
    }
  }
  // Only create the image element if we got a background image src
  let backgroundImgEl = null;
  if (backgroundImgSrc) {
    backgroundImgEl = document.createElement('img');
    backgroundImgEl.src = backgroundImgSrc;
    backgroundImgEl.alt = '';
  }

  // Find the content div
  const contentDiv = element.querySelector('.article-header__content');
  const contentElements = [];
  if (contentDiv) {
    // Collect the title (h1)
    const titleDiv = contentDiv.querySelector('.article-header__title');
    if (titleDiv) {
      const h1 = titleDiv.querySelector('h1');
      if (h1) contentElements.push(h1);
    }
    // Collect the image inside content if present
    const img = contentDiv.querySelector('img');
    if (img) contentElements.push(img);
  }

  // Construct the table
  const cells = [
    headerRow,
    [backgroundImgEl ? backgroundImgEl : ''],
    [contentElements]
  ];
  // Create the table and replace the element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}