/* global WebImporter */
export default function parse(element, { document }) {
  // Set the correct header row, exactly as the example
  const headerRow = ['Columns (columns36)'];

  // We want a second row with 2 columns, each representing a visual column from the block
  // Extract left column block: everything except the right column
  // The left column visually contains the SEP logo. The right contains the Roche logo.
  // We'll extract both columns as they appear in the HTML

  // Get all top-level children
  const directChildren = Array.from(element.children);

  // Left column: the .logo div (contains <a> and SEP logo)
  const leftColumn = directChildren.find(el => el.classList && el.classList.contains('logo'));
  // Right column: .header-container__right (contains secondary logos)
  const rightColumn = directChildren.find(el => el.classList && el.classList.contains('header-container__right'));

  // Compose the content for each column
  // If leftColumn is present, use it; otherwise, pass empty string
  // If rightColumn is present, use it; otherwise, pass empty string
  const row = [leftColumn || '', rightColumn || ''];

  const cells = [headerRow, row];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
