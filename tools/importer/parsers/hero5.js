/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Get background image (poster)
  function getBackgroundImageEl() {
    // Prefer an <img> in the background-media area
    let img = element.querySelector('.background-media-item-vidimg img');
    if (img) return img;
    // Fallback: poster from data-poster-desktop
    const vidimg = element.querySelector('.background-media-item-vidimg');
    if (vidimg) {
      const poster = vidimg.getAttribute('data-poster-desktop');
      if (poster) {
        const fallbackImg = document.createElement('img');
        fallbackImg.src = poster;
        fallbackImg.alt = vidimg.getAttribute('data-video-title') || '';
        return fallbackImg;
      }
    }
    // Fallback: <img> in .vjs-poster
    img = element.querySelector('.vjs-poster img');
    if (img) return img;
    return '';
  }

  // 2. Get all content text and CTA as block, referencing existing elements ONLY
  function getContentBlockElement() {
    // Reference the entire background-media-item-text block, if present
    const textBlock = element.querySelector('.background-media-item-text');
    if (textBlock) return textBlock;
    // If not present, fallback: grab all <h1>-<h4>, <p>, <a> in order
    const frags = [];
    element.querySelectorAll('h1,h2,h3,h4,p,a').forEach(el => {
      if (el.textContent.trim()) frags.push(el);
    });
    if (frags.length) return frags;
    return '';
  }

  const headerRow = ['Hero (hero5)'];
  const bgImgEl = getBackgroundImageEl();
  const bgRow = [bgImgEl ? bgImgEl : ''];
  const contentBlock = getContentBlockElement();
  const contentRow = [contentBlock ? contentBlock : ''];

  // Compose the table for the block
  const cells = [headerRow, bgRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
