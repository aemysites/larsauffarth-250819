/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find main content block with all the text
  // Use .post-content as the main container for article body content
  const postContent = element.querySelector('.post-content');
  let contentElements = [];
  if (postContent) {
    // Include all children preserving order/structure
    contentElements = Array.from(postContent.children);
  }

  // 2. Find the video embed
  let vimeoUrl = null;
  const videoFigure = element.querySelector('figure.wp-block-embed-vimeo');
  if (videoFigure) {
    const iframe = videoFigure.querySelector('iframe');
    if (iframe && iframe.src) {
      // Canonicalize the Vimeo URL
      const vimeoMatch = iframe.src.match(/vimeo\.com\/video\/(\d+)/);
      if (vimeoMatch) {
        vimeoUrl = `https://vimeo.com/${vimeoMatch[1]}`;
      } else {
        vimeoUrl = iframe.src;
      }
    }
  }

  // 3. Create the video link element
  let videoLink = null;
  if (vimeoUrl) {
    videoLink = document.createElement('a');
    videoLink.href = vimeoUrl;
    videoLink.textContent = vimeoUrl;
  }

  // 4. Compose cell content: all article text + video link (with br between)
  const cellContent = contentElements.length ? [...contentElements] : [];
  if (videoLink) {
    if (cellContent.length > 0) {
      cellContent.push(document.createElement('br'));
    }
    cellContent.push(videoLink);
  }

  // 5. Build the block table per example
  const headerRow = ['Embed (embedVideo17)'];
  const cells = [
    headerRow,
    [cellContent]
  ];
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // 6. Replace the original element
  element.replaceWith(blockTable);
}
