/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main hero block
  const heroBlock = element.querySelector('.hero');
  if (!heroBlock) return;

  // Header row
  const headerRow = ['Hero (hero2)'];

  // Row 2: Background image (from .image-wrapper)
  let imageCell = '';
  const imageWrapper = heroBlock.querySelector('.image-wrapper');
  if (imageWrapper) {
    // Find the <img> inside the <picture>
    const img = imageWrapper.querySelector('img');
    if (img) {
      imageCell = img;
    }
  }

  // Row 3: Content (headings, paragraph, CTA)
  let contentCell = '';
  const innerContent = heroBlock.querySelector('.inner-content');
  if (innerContent) {
    // Collect heading, subheading, paragraph, CTA button
    const children = Array.from(innerContent.children);
    // Only include elements that are headings, paragraphs, or links
    const contentEls = [];
    children.forEach((el) => {
      if (
        el.tagName === 'H1' ||
        el.tagName === 'H2' ||
        el.tagName === 'H3' ||
        el.tagName === 'H4' ||
        el.tagName === 'P' ||
        (el.tagName === 'A' && el.classList.contains('button'))
      ) {
        contentEls.push(el);
      }
    });
    if (contentEls.length) {
      contentCell = contentEls;
    }
  }

  // Compose table rows
  const cells = [
    headerRow,
    [imageCell],
    [contentCell]
  ];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with block table
  element.replaceWith(block);
}
