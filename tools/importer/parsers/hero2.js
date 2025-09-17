/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .hero block inside the wrapper
  const hero = element.querySelector('.hero');
  if (!hero) return;

  // --- 1. Extract the background image (picture/img) ---
  let imageEl = '';
  const imageWrapper = hero.querySelector('.image-wrapper');
  if (imageWrapper) {
    const picture = imageWrapper.querySelector('picture');
    if (picture) {
      imageEl = picture;
    } else {
      const img = imageWrapper.querySelector('img');
      if (img) imageEl = img;
    }
  }

  // --- 2. Extract the content (headings, paragraph, CTA) ---
  let contentFragment = document.createDocumentFragment();
  const innerContent = hero.querySelector('.inner-content');
  if (innerContent) {
    // Clone children in order, preserving tags and formatting
    Array.from(innerContent.children).forEach(child => {
      contentFragment.appendChild(child.cloneNode(true));
    });
  }

  // --- 3. Build the table rows ---
  const headerRow = ['Hero (hero2)'];
  const imageRow = [imageEl ? imageEl : ''];
  const contentRow = [contentFragment.childNodes.length ? contentFragment : ''];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow,
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
