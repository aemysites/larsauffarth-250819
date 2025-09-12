/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content wrapper
  const innerContent = element.querySelector('.inner-content');

  // --- Background Image Extraction (row 2) ---
  // No image present in this HTML, but code supports future variations
  let backgroundImage = '';
  // If a background image is present as an <img> or background style, extract it here
  // Example: const img = element.querySelector('img'); if (img) backgroundImage = img;

  // --- Content Extraction (row 3) ---
  const upperContent = innerContent ? innerContent.querySelector('.upper-content') : null;
  const contentFragments = [];

  if (upperContent) {
    // Heading (styled as heading)
    const heading = upperContent.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) {
      contentFragments.push(heading);
    }
    // CTA button (text with link)
    const cta = upperContent.querySelector('a.button');
    if (cta) {
      contentFragments.push(cta);
    }
  }

  // --- Table Construction ---
  // Header row must match block name exactly
  const headerRow = ['Hero (hero7)'];
  const imageRow = [backgroundImage];
  const contentRow = [contentFragments];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow
  ], document);

  // Replace the original element with the block table
  element.replaceWith(table);
}
