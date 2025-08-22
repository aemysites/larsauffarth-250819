/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in example, exact wording
  const headerRow = ['Cards (cards28)'];

  // Select all card-like elements in order (articles and survey block)
  const cards = Array.from(element.querySelectorAll('.tease, .insert-survey'));
  const cells = [headerRow];

  cards.forEach(card => {
    // Survey block (special non-article card)
    if (card.classList.contains('insert-survey')) {
      const img = card.querySelector('img');
      const question = card.querySelector('.survey-question');
      const form = card.querySelector('form');
      // Compose left (image) and right (question + form)
      // Always reference existing elements directly
      cells.push([
        img,
        [question, form].filter(Boolean)
      ]);
      return;
    }
    // Standard card
    const img = card.querySelector('.img-container img');
    // Compose right cell: type, title (h2.underline)
    const postContent = card.querySelector('.post-content');
    const textEls = [];
    if (postContent) {
      const type = postContent.querySelector('.post-type');
      if (type) textEls.push(type);
      const h2 = postContent.querySelector('h2');
      if (h2) textEls.push(h2);
    }
    cells.push([
      img,
      textEls
    ]);
  });

  // Create and replace block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
