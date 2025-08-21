/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must exactly match: 'Hero (hero4)'
  const headerRow = ['Hero (hero4)'];

  // Find the main background image (desktop preferred)
  let bgImg = null;
  const desktopPicture = element.querySelector('picture.desktopimg');
  if (desktopPicture && desktopPicture.querySelector('img')) {
    bgImg = desktopPicture.querySelector('img');
  } else {
    // Fallback to mobile image
    const mobilePicture = element.querySelector('picture.mobileimg');
    if (mobilePicture && mobilePicture.querySelector('img')) {
      bgImg = mobilePicture.querySelector('img');
    }
  }

  // Find the text content (headline, subheading, CTA) and use existing elements
  const textRoot = element.querySelector('.background-media-item-text');
  let textContent = document.createElement('div');
  if (textRoot) {
    // Headline
    const headline = textRoot.querySelector('.background-media-item-text-headline');
    if (headline) textContent.appendChild(headline);
    // Subheading
    const subheading = textRoot.querySelector('h2.background-media-item-text-copytext');
    if (subheading) textContent.appendChild(subheading);
    // CTA
    const cta = textRoot.querySelector('.bg-media-btn-container a');
    if (cta) {
      // The CTA is already an anchor -- wrap in paragraph for structure
      const p = document.createElement('p');
      p.appendChild(cta);
      textContent.appendChild(p);
    }
  }
  // If no text was found, leave cell empty
  if (!textContent.hasChildNodes()) textContent = '';

  // Build table
  const tableRows = [
    headerRow,
    [bgImg ? bgImg : ''],
    [textContent],
  ];

  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
