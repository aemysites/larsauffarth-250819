/* global WebImporter */
export default function parse(element, { document }) {
  // Find YouTube embed figure
  const youtubeFigure = element.querySelector('figure.wp-block-embed-youtube');
  let videoUrl;
  let posterImg = null;
  if (youtubeFigure) {
    const iframe = youtubeFigure.querySelector('iframe');
    if (iframe && iframe.src) {
      const src = iframe.src;
      // Prefer normal YouTube link format
      const match = src.match(/youtube\.com\/embed\/([\w-]+)/);
      if (match) {
        videoUrl = `https://www.youtube.com/watch?v=${match[1]}`;
      } else {
        videoUrl = src;
      }
    }
    // Only add image if present (not in example, but edge-case ready)
    posterImg = youtubeFigure.querySelector('img');
  }

  // Collect all content relevant to the block (based on HTML structure and example)
  // Reference all content except sidebar/share blocks and video embed itself
  // The main content is inside .post-content
  const postContent = element.querySelector('.post-content');
  const contentEls = [];
  if (postContent) {
    Array.from(postContent.children).forEach(child => {
      // Avoid including the video block itself
      if (!child.matches('figure.wp-block-embed-youtube')) {
        contentEls.push(child);
      }
    });
  }

  // Compose cell content (all content, then image, then video link)
  const cellContent = [];
  // Reference existing elements, do not clone
  if (contentEls.length) {
    cellContent.push(...contentEls);
  }
  if (posterImg) {
    cellContent.push(posterImg);
  }
  if (videoUrl) {
    const a = document.createElement('a');
    a.href = videoUrl;
    a.textContent = videoUrl;
    cellContent.push(a);
  }

  // Compose block table
  const headerRow = ['Embed (embedVideo27)'];
  // If only one element, provide as a single element, else provide array
  const contentRow = [cellContent.length === 1 ? cellContent[0] : cellContent];
  const cells = [headerRow, contentRow];
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(blockTable);
}
