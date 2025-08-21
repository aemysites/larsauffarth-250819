/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract a column cell for a link-list-wrapper
  function extractLinkListColumn(wrapper) {
    const res = document.createElement('div');
    // Get the title (h3)
    const title = wrapper.querySelector(':scope > .link-list.block > .link-list-title');
    if (title) res.appendChild(title);
    // Get the list
    const list = wrapper.querySelector(':scope > .link-list.block > .link-list-detail > ul');
    if (list) res.appendChild(list);
    return res;
  }

  // Helper to extract the icon social links column
  function extractSocialIconsColumn(container) {
    const res = document.createElement('div');
    // Select only direct icon blocks
    const iconBlocks = container.querySelectorAll(':scope > .icon.block');
    iconBlocks.forEach(icon => {
      const a = icon.querySelector('a');
      if (a) res.appendChild(a);
    });
    return res;
  }

  // Find all the columns for this columns7 block
  const columns = [];

  // Left and Middle columns: link-list-wrapper(s)
  const linkWrappers = element.querySelectorAll(':scope > .link-list-wrapper');
  linkWrappers.forEach(wrapper => {
    // Only add if it has a list (avoid empty column)
    const list = wrapper.querySelector('.link-list-detail ul');
    if (list) {
      columns.push(extractLinkListColumn(wrapper));
    }
  });

  // Right column: icon social links
  const iconWrapper = element.querySelector(':scope > .icon-link-list-wrapper > .icon-link-list.block > .icon-link-list-container');
  if (iconWrapper) {
    columns.push(extractSocialIconsColumn(iconWrapper));
  }

  // Block header row: must be a single cell array
  const header = ['Columns (columns7)'];
  // Content row: array of columns
  const contentRow = columns;

  // Build block table: first row is header (single cell), second row is content (columns)
  const table = WebImporter.DOMUtils.createTable([header, contentRow], document);
  element.replaceWith(table);
}
