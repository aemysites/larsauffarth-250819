/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required
  const rows = [['Cards (cards34)']];

  // Find all card items
  const carouselItems = element.querySelectorAll('.carousel-item');

  carouselItems.forEach(item => {
    // --- IMAGE CELL ---
    // Get the first img inside the card
    const img = item.querySelector('img');

    // --- CONTENT CELL ---
    // Compose cell content by referencing existing elements
    const cellContent = [];

    // Gather heading (prefer h3 or .h3 class)
    let heading = item.querySelector('h3, .h3, h2, h4');
    if (heading) {
      cellContent.push(heading);
    }

    // Gather all paragraphs with non-empty text except ones inside heading
    let paragraphs = Array.from(item.querySelectorAll('p')).filter(p => {
      // Avoid <p> inside heading
      return (!heading || !heading.contains(p)) && p.textContent.trim();
    });
    paragraphs.forEach(p => cellContent.push(p));

    // Gather CTA links (class .button-round OR links in .shared-post__content .link span)
    let cta = item.querySelector('a.button-round');
    if (cta) {
      cellContent.push(cta);
    } else {
      // For shared post card
      let linkContainer = item.querySelector('.shared-post__content .link span');
      let parentA = item.querySelector('.shared-post');
      if (linkContainer && parentA && parentA.href) {
        let a = document.createElement('a');
        a.href = parentA.href;
        if (parentA.target) a.target = parentA.target;
        a.textContent = linkContainer.textContent.trim();
        cellContent.push(a);
      }
    }

    // If nothing found, fallback: include all text content except images and SVGs
    if (cellContent.length === 0) {
      // Reference all <p>, <a>, and headings with text from the item
      let fallback = Array.from(item.querySelectorAll('h1,h2,h3,h4,h5,h6,p,a')).filter(el => {
        return !el.closest('img, svg') && el.textContent.trim();
      });
      if (fallback.length) {
        fallback.forEach(el => cellContent.push(el));
      } else {
        // As a last fallback, include the item itself (excluding images and svgs)
        let clone = item.cloneNode(true);
        clone.querySelectorAll('img, svg').forEach(n => n.remove());
        cellContent.push(clone);
      }
    }

    rows.push([
      img || '',
      cellContent.length === 1 ? cellContent[0] : cellContent
    ]);
  });

  // Create and replace with table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
