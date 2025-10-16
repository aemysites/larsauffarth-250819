/* global WebImporter */
export default function parse(element, { document }) {
  // Find all tab-pane profile sections
  const tabPanes = Array.from(element.querySelectorAll(':scope > div.tab-pane'));
  if (!tabPanes.length) return;

  // Prepare rows: header first
  const headerRow = ['Columns (columns5)'];
  const rows = [headerRow];

  tabPanes.forEach((tabPane) => {
    const dFlex = tabPane.querySelector('.d-flex');
    if (!dFlex) return;
    const columns = Array.from(dFlex.children);
    if (columns.length < 2) return;

    // Left column: image
    const leftCol = columns[0];
    const img = leftCol.querySelector('img');

    // Right column: content
    const rightCol = columns[1];
    const rightContent = [];

    // Collect all direct children of rightCol (to include all text content)
    Array.from(rightCol.children).forEach((child) => {
      // For the 'Registered States' block, flatten the label and the list into one paragraph
      if (child.classList.contains('flex-col-100')) {
        const statesLabel = child.querySelector('b');
        const statesList = child.querySelector('ul.comma-list');
        let statesText = '';
        if (statesLabel) {
          statesText += statesLabel.textContent.trim();
        }
        if (statesList) {
          // Join all state abbreviations with commas
          const states = Array.from(statesList.querySelectorAll('li')).map(li => li.textContent.trim());
          if (states.length) {
            statesText += '\n' + states.join(', ');
          }
        }
        if (statesText) {
          const p = document.createElement('p');
          p.textContent = statesText;
          rightContent.push(p);
        }
      } else {
        // Otherwise, include the element as-is if it has text or is an element
        if (
          (child.textContent && child.textContent.trim()) ||
          child.tagName === 'UL' ||
          child.tagName === 'DIV' ||
          child.tagName === 'H2'
        ) {
          rightContent.push(child);
        }
      }
    });

    rows.push([img, rightContent]);
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
