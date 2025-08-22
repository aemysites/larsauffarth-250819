/* global WebImporter */
export default function parse(element, { document }) {
  if (!element || !document) return;

  // Extract left column (main content)
  const wrapper = element.querySelector('.wrapper');
  if (!wrapper) return;
  const container = wrapper.querySelector('.container');
  if (!container) return;
  const articleBody = container.querySelector('.article-body');
  if (!articleBody) return;
  const contentArticle = articleBody.querySelector('.content-article');
  if (!contentArticle) return;

  // Find right column (comment box) as sibling of this section
  let rightCol = null;
  if (element.parentNode) {
    for (const sib of element.parentNode.children) {
      if (
        sib !== element &&
        sib.tagName === 'SECTION' &&
        sib.classList.contains('comment-box')
      ) {
        rightCol = sib;
        break;
      }
    }
  }
  // Fallback: try to find .comment-box inside element (if present)
  if (!rightCol) {
    rightCol = element.querySelector('.comment-box');
  }
  // Ensure a second column, even if no comment box found
  if (!rightCol) {
    rightCol = document.createElement('div');
  }

  // Build the table with two columns in second row
  const cells = [
    ['Columns (columns25)'],
    [contentArticle, rightCol],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
