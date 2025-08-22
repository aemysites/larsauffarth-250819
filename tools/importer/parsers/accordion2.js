/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main article content
  const postContent = element.querySelector('.post-content');
  if (!postContent) return;

  // Prepare the header row as per requirements
  const rows = [['Accordion (accordion2)']];

  // Get direct children of postContent
  const children = Array.from(postContent.children);
  // Find <ul> blocks for accordion items and their titles
  let i = 0;
  // Find first <h2> as the start of the accordion section (if present)
  let firstAccordionIdx = children.findIndex(e => e.tagName === 'H2');
  // If there is introductory content before the accordion, treat it as the first accordion item
  if (firstAccordionIdx > 0) {
    // All elements before the first H2
    const intro = children.slice(0, firstAccordionIdx);
    // Use the first <p> with <strong> as the title if exists, else just the first <p>
    let titleEl = intro.find(e => e.tagName === 'P' && e.querySelector('strong')) || intro.find(e => e.tagName === 'P');
    let contentArr = intro.filter(e => e !== titleEl && e.tagName !== 'SCRIPT' && e.tagName !== 'STYLE');
    rows.push([
      titleEl || '',
      contentArr.length === 1 ? contentArr[0] : contentArr
    ]);
    i = firstAccordionIdx;
  }
  // Now process each accordion item: each one is a <h2> (title) followed by one or more elements (content)
  while (i < children.length) {
    const node = children[i];
    if (/^H[1-6]$/.test(node.tagName)) {
      const titleEl = node;
      // Gather everything after this heading up to the next heading
      let contentArr = [];
      let j = i + 1;
      while (
        j < children.length &&
        !/^H[1-6]$/.test(children[j].tagName)
      ) {
        // Only include non-empty content (skip scripts, styles, empty blocks)
        if (children[j].tagName !== 'SCRIPT' && children[j].tagName !== 'STYLE') {
          contentArr.push(children[j]);
        }
        j++;
      }
      // Only add if there is at least a title or content
      if (titleEl || contentArr.length > 0) {
        rows.push([
          titleEl,
          contentArr.length === 1 ? contentArr[0] : contentArr
        ]);
      }
      i = j;
    } else {
      i++;
    }
  }
  // If there are no H2s (edge case), try to treat each <ul> as an accordion item, with previous <p> as title
  if (rows.length === 1) {
    for (let idx = 0; idx < children.length; idx++) {
      if (children[idx].tagName === 'UL') {
        // Find previous non-empty <p> as title
        let titleEl = null;
        for (let b=idx-1; b>=0; b--) {
          if (children[b].tagName === 'P' && children[b].textContent.trim()) {
            titleEl = children[b];
            break;
          }
        }
        rows.push([
          titleEl || '',
          children[idx]
        ]);
      }
    }
  }
  // Create the block table and replace the element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
