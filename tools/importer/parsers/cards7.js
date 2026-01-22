/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main cards container
  const items = element.querySelector('.block-posts__items');
  if (!items) return;

  // Get all article elements (cards)
  const articles = Array.from(items.querySelectorAll('article.tease'));

  // Prepare table rows: First is header
  const rows = [['Cards (cards7)']];

  articles.forEach((article) => {
    // First cell: image element
    const img = article.querySelector('.img-container img');

    // Second cell: all visible content inside the card except the image
    // We want all post-content (including heading, type, etc)
    const postContent = article.querySelector('.post-content');
    // Reference the original node for all text/structure, if present
    let textCell = postContent ? postContent : '';

    // If the card is wrapped in a link, we should make the text cell a link as in the UI
    // But only if the link wraps the content (not just a part)
    const link = article.querySelector(':scope > a[href]');
    if (link && postContent) {
      // Reference the original <a>, and not a clone, so all structure, aria, and events are preserved
      // But we want only the .post-content inside the link, not the image (which is the first child)
      // So, recreate a new <a> and move only postContent into it
      const newA = document.createElement('a');
      newA.href = link.href;
      if (link.target) newA.target = link.target;
      newA.appendChild(postContent);
      textCell = newA;
    }

    rows.push([
      img ? img : '',
      textCell
    ]);
  });

  // Replace the original element with the new block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
