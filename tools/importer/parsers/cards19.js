/* global WebImporter */
export default function parse(element, { document }) {
  // Table header, exactly as required
  const headerRow = ['Cards (cards19)'];
  const rows = [headerRow];

  // Find the container with all cards
  const itemsContainer = element.querySelector('.block-posts__items');
  if (itemsContainer) {
    // Select all immediate article children for cards
    const articles = Array.from(itemsContainer.querySelectorAll(':scope > article'));
    articles.forEach((article) => {
      // Get card image (required)
      let img = null;
      const imgContainer = article.querySelector('.img-container');
      if (imgContainer) {
        img = imgContainer.querySelector('img');
      }
      // Get card text content (should reference the post-content div)
      const postContent = article.querySelector('.post-content');
      // Always reference the actual element, defaulting to empty string
      rows.push([
        img || '',
        postContent || ''
      ]);
    });
    // Handle the CTA block, if present (not part of the card grid, goes as a final row)
    const cta = itemsContainer.querySelector('.block-posts__cta.keep');
    if (cta) {
      rows.push(['', cta]);
    }
  }
  // Create and replace the table block with correct structure
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}