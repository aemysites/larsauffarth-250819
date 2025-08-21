/* global WebImporter */
export default function parse(element, { document }) {
  // Find background image element (if any)
  function getBackgroundMediaEl(section) {
    // Prefer image in video poster
    let img = section.querySelector('.background-media-item-vidimg .vjs-poster img');
    if (img) return img;
    // Else, try video poster attribute
    const video = section.querySelector('.background-media-item-vidimg video');
    const poster = video && video.getAttribute('poster');
    if (poster) {
      // Create an <img> referencing the poster URL
      const imgEl = document.createElement('img');
      imgEl.src = poster;
      imgEl.alt = video.getAttribute('data-description') || '';
      return imgEl;
    }
    // Else fallback: first image inside .background-media
    img = section.querySelector('.background-media img');
    if (img) return img;
    return '';
  }

  // Gather all text content from .background-media-item-text
  function getTextContentEl(section) {
    const txtBlock = section.querySelector('.background-media-item-text');
    if (!txtBlock) return '';
    // Compose all child nodes, including all structure, headings, paragraphs, spans, etc.
    const nodes = [];
    for (const child of txtBlock.childNodes) {
      // Only elements and significant text nodes
      if (child.nodeType === 1) {
        nodes.push(child);
      } else if (child.nodeType === 3 && child.textContent.trim()) {
        // Wrap significant text nodes in <span> to retain them
        const span = document.createElement('span');
        span.textContent = child.textContent;
        nodes.push(span);
      }
    }
    return nodes.length > 1 ? nodes : (nodes[0] || '');
  }

  // TABLE STRUCTURE
  const headerRow = ['Hero (hero2)']; // Must match example exactly
  const bgMediaEl = getBackgroundMediaEl(element);
  const textContentEl = getTextContentEl(element);

  const cells = [
    headerRow,
    [bgMediaEl || ''],
    [textContentEl || ''],
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
