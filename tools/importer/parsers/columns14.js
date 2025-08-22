/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the relevant elements for each column
  // 1. Breadcrumbs navigation
  let breadcrumbs = null;
  const breadcrumbsWrapper = element.querySelector('.breadcrumbs-wrapper');
  if (breadcrumbsWrapper) {
    breadcrumbs = breadcrumbsWrapper.querySelector('nav');
  }

  // 2. Search form
  let searchForm = null;
  const headerRight = element.querySelector('.header-container__right');
  if (headerRight) {
    const navSearch = headerRight.querySelector('.nav-search');
    if (navSearch) {
      searchForm = navSearch.querySelector('form');
    }
  }

  // 3. Secondary logo area
  let logoArea = null;
  if (headerRight) {
    logoArea = headerRight.querySelector('.secondary-logo');
  }

  // Build columns array for the content row (only include if present)
  const columns = [];
  if (breadcrumbs) columns.push(breadcrumbs);
  if (searchForm) columns.push(searchForm);
  if (logoArea) columns.push(logoArea);

  // The header row MUST be a single cell, per spec
  const headerRow = ['Columns (columns14)'];
  const cells = [
    headerRow,
    columns
  ];
  
  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Ensure header row is a single cell only, even if columns.length > 1
  // (The createTable function uses the cells array structure, so as long as the first row is a single-item array, it's correct)

  element.replaceWith(table);
}
