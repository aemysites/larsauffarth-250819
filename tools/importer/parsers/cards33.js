/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct child columns block that are cards (skip sidebar, promo, etc)
  function getCardsRows() {
    // The direct children of .post-content that are .wp-block-columns
    const postContent = element.querySelector('.post-content');
    if (!postContent) return [];
    return Array.from(postContent.children).filter(row => {
      // Only .wp-block-columns which contain at least one .with-logo or .with-text
      if (!row.classList || !row.classList.contains('wp-block-columns')) return false;
      return row.querySelector('.with-logo, .with-text');
    });
  }

  const cardsRows = getCardsRows();
  const cells = [['Cards (cards33)']];

  cardsRows.forEach(row => {
    // Get the columns (usually 2, logo and text)
    const columns = Array.from(row.querySelectorAll(':scope > .wp-block-column'));
    let logoCol = columns.find(col => col.classList.contains('with-logo'));
    let textCol = columns.find(col => col.classList.contains('with-text'));
    // Fallback if class is missing, look for column with image
    if ((!logoCol || !textCol) && columns.length === 2) {
      if (columns[0].querySelector('img')) {
        logoCol = columns[0];
        textCol = columns[1];
      } else {
        logoCol = columns[1];
        textCol = columns[0];
      }
    }
    // Get image element in logoCol
    let image = null;
    if (logoCol) {
      image = logoCol.querySelector('img');
    }
    // Compose text cell: heading, all non-empty paragraphs, and cta link
    const textContent = [];
    if (textCol) {
      // Heading
      const heading = textCol.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) textContent.push(heading);
      // All non-empty paragraphs (excluding those which only wrap a button)
      const paragraphs = Array.from(textCol.querySelectorAll('p')).filter(p => p.textContent.trim() !== '' && p.querySelector('a.wp-block-button__link, .wp-block-button > a') == null);
      paragraphs.forEach(p => textContent.push(p));
      // CTA button link (find the first <a> within a .wp-block-button)
      const ctaBtn = textCol.querySelector('.wp-block-button > a.wp-block-button__link, a.wp-block-button__link');
      if (ctaBtn) textContent.push(ctaBtn);
    }
    // Add as row
    cells.push([image, textContent]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
