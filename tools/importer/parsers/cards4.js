/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header (block name)
  const headerRow = ['Cards (cards4)'];
  const cells = [headerRow];

  // 2. Get all card articles (direct children of block-posts__items)
  const itemsContainer = element.querySelector('.block-posts__items');
  if (itemsContainer) {
    const articles = Array.from(itemsContainer.children).filter(child => child.tagName === 'ARTICLE');
    articles.forEach(article => {
      // Image in first column
      let imgEl = null;
      const imgContainer = article.querySelector('.img-container');
      if (imgContainer) {
        const img = imgContainer.querySelector('img');
        if (img) {
          imgEl = img;
        }
      }
      // Text content in second column
      const postContent = article.querySelector('.post-content');
      let textCellContent = [];
      if (postContent) {
        // Reference all direct children (post-type, h2)
        Array.from(postContent.children).forEach(child => {
          textCellContent.push(child);
        });
      }
      // Compose row: [image, text content]
      cells.push([imgEl, textCellContent]);
    });
  }

  // 3. CTA (call-to-action) at end, as its own row, in the last cell
  const cta = element.querySelector('.block-posts__cta');
  if (cta) {
    // Place CTA in the second cell of a row, empty image cell
    cells.push(['', cta]);
  }

  // 4. Create block table, replace element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
