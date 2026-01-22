/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Columns block
  const headerRow = ['Columns (columns4)'];

  // Find all tab-pane blocks (profile sections)
  const tabPanes = element.querySelectorAll('.tab-pane');
  if (!tabPanes.length) return;

  // We'll build one row with two columns: left (image), right (all text content from both tabs)
  let leftCell = '';
  let rightCell = document.createElement('div');

  // First tab-pane: image and main bio
  const firstPane = tabPanes[0];
  const firstDFlex = firstPane.querySelector('.d-flex');
  if (firstDFlex) {
    const firstCols = firstDFlex.querySelectorAll(':scope > div');
    if (firstCols.length >= 2) {
      // Left column: image
      const img = firstCols[0].querySelector('img');
      if (img) leftCell = img.cloneNode(true);

      // Right column: main bio content
      const rightCol = firstCols[1];
      // Name (h2)
      const name = rightCol.querySelector('h2');
      if (name) rightCell.appendChild(name.cloneNode(true));
      // Titles
      const titles = rightCol.querySelectorAll('.title p');
      titles.forEach(p => {
        if (p.textContent.trim()) rightCell.appendChild(p.cloneNode(true));
      });
      // Biography paragraphs
      Array.from(rightCol.querySelectorAll('p'))
        .filter(p => !p.closest('.title') && p.textContent.trim().length > 0)
        .forEach(p => rightCell.appendChild(p.cloneNode(true)));
      // Registered States
      const regStatesDiv = rightCol.querySelector('.flex-col-100');
      if (regStatesDiv) rightCell.appendChild(regStatesDiv.cloneNode(true));
    }
  }

  // Second tab-pane: address, phone, email, social links
  if (tabPanes.length > 1) {
    const secondPane = tabPanes[1];
    const secondDFlex = secondPane.querySelector('.d-flex');
    if (secondDFlex) {
      const secondCols = secondDFlex.querySelectorAll(':scope > div');
      if (secondCols.length >= 2) {
        const rightCol = secondCols[1];
        // Name (h2) if present and not already added
        const name = rightCol.querySelector('h2');
        if (name && !rightCell.querySelector('h2')) rightCell.appendChild(name.cloneNode(true));
        // Address
        const addressBlock = rightCol.querySelector('.address.address-wrap');
        if (addressBlock) rightCell.appendChild(addressBlock.cloneNode(true));
        // Phone list
        const phoneList = rightCol.querySelector('.phone-list');
        if (phoneList) rightCell.appendChild(phoneList.cloneNode(true));
        // Email
        const emailPara = rightCol.querySelector('p[id$="email"]');
        if (emailPara) rightCell.appendChild(emailPara.cloneNode(true));
        // Social links
        const socialContainer = rightCol.querySelector('.social-container');
        if (socialContainer) rightCell.appendChild(socialContainer.cloneNode(true));
      }
    }
  }

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    [leftCell, rightCell]
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
