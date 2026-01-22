/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the main testimonials block
  const block = element.querySelector('.testimonials');
  if (!block) return;

  // Find all tabpanels (each is a slide)
  const tabPanels = block.querySelectorAll('.tabcontent .tabcontent-container > .testimonial');

  // Table header as required
  const headerRow = ['Carousel (carousel5)'];
  const rows = [headerRow];

  tabPanels.forEach((panel) => {
    // --- IMAGE CELL ---
    // Find the main slide image (first .image-side picture)
    let imageCell = null;
    const imageSide = panel.querySelector('.image-side');
    if (imageSide) {
      // Use the <picture> element directly
      const pic = imageSide.querySelector('picture');
      if (pic) imageCell = pic;
    }

    // --- CONTENT CELL ---
    const content = [];
    // Testimonial quote
    const quote = panel.querySelector('.testimonial-info .testimonial-quote');
    if (quote) {
      // Make a heading element for the quote
      const heading = document.createElement('h3');
      heading.textContent = quote.textContent.replace(/^[“"]|[”"]$/g, '');
      content.push(heading);
    }

    // Customer info
    const customerInfo = panel.querySelector('.customer-info');
    if (customerInfo) {
      // Optionally add customer image
      const customerPic = customerInfo.querySelector('picture');
      if (customerPic) content.push(customerPic);
      // Add name/title
      const titles = customerInfo.querySelector('.titles');
      if (titles) {
        // Add each <p> as a paragraph
        titles.querySelectorAll('p').forEach((p) => {
          content.push(p);
        });
      }
      // Add CTA link
      const cta = customerInfo.querySelector('a[href]');
      if (cta) content.push(cta);
    }

    // Stats list
    const statsList = panel.querySelector('.testimonial-info ul');
    if (statsList) {
      // Add as-is
      content.push(statsList);
    }

    // Defensive: If no image, skip row
    if (!imageCell) return;
    rows.push([imageCell, content]);
  });

  // Create table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(table);
}
