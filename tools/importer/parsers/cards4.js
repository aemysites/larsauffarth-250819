/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row: exactly one column
  const rows = [ ['Cards (cards4)'] ];

  // Find all card columns
  const cardEls = Array.from(element.querySelectorAll(':scope > div > div'));

  cardEls.forEach((cardEl) => {
    const wrapper = cardEl.querySelector('.columns-content-wrapper');
    if (!wrapper) return;

    // Icon: get the first .icon span (with svg)
    const icon = wrapper.querySelector('.icon');

    // Text cell: collect heading and all non-empty paragraphs (before and after heading)
    const heading = wrapper.querySelector('h3');
    let textCell = [];
    if (heading) textCell.push(heading.cloneNode(true));
    Array.from(wrapper.querySelectorAll('p')).forEach((p) => {
      if (p.textContent.trim().length > 0) {
        textCell.push(p.cloneNode(true));
      }
    });
    // Remove duplicate heading if h3 is also a p
    textCell = textCell.filter((el) => {
      if (el.tagName === 'H3') return true;
      if (heading && el.textContent.trim() === heading.textContent.trim()) return false;
      return true;
    });
    // Add row: [icon, text]
    rows.push([
      icon ? icon.cloneNode(true) : '',
      textCell
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
