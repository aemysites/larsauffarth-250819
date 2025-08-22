/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: safely get all direct children as array
  function getContentArray(parent) {
    const content = [];
    parent.childNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        content.push(node);
      } else if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent.trim();
        if (text) {
          content.push(document.createTextNode(text));
        }
      }
    });
    return content.length ? content : [document.createTextNode('')];
  }

  // Extract left/main column: main article body (post content)
  let leftColumnContent = [];
  let postContent = element.querySelector('.post-content');
  if (!postContent) {
    // fallback: use all children of .content-article
    const contentArticle = element.querySelector('.content-article');
    if (contentArticle) postContent = contentArticle;
  }
  if (postContent) {
    leftColumnContent = getContentArray(postContent);
  } else {
    leftColumnContent = [document.createTextNode('')];
  }

  // Extract right/sidebar column: all of the comment-box
  let rightColumnContent = [];
  const commentBox = element.querySelector('.comment-box');
  if (commentBox) {
    rightColumnContent = getContentArray(commentBox);
  } else {
    rightColumnContent = [document.createTextNode('')];
  }

  // Table header: block name, per example
  const headerRow = ['Columns (columns15)'];
  // Table content: two columns, left and right
  const contentRow = [leftColumnContent, rightColumnContent];

  const cells = [headerRow, contentRow];

  // Create and replace the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
