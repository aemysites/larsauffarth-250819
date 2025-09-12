/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the testimonials block
  const testimonialsBlock = element.querySelector('.testimonials');
  if (!testimonialsBlock) return;

  // Find all tabpanel testimonial slides
  const tabPanels = testimonialsBlock.querySelectorAll('.tabcontent .tabpanel.testimonial');
  if (!tabPanels.length) return;

  // Table header row as required
  const headerRow = ['Carousel (carousel5)'];
  const rows = [headerRow];

  tabPanels.forEach((panel) => {
    // --- IMAGE CELL ---
    // Find the main image for the slide
    let imageCell = null;
    const imageSide = panel.querySelector('.image-side');
    if (imageSide) {
      // Use the <picture> block directly
      const picture = imageSide.querySelector('picture');
      if (picture) {
        imageCell = picture;
      }
    }

    // --- CONTENT CELL ---
    const contentCell = document.createElement('div');
    contentCell.style.display = 'flex';
    contentCell.style.flexDirection = 'column';

    // Testimonial quote
    const quote = panel.querySelector('.testimonial-quote');
    if (quote) {
      // Use a heading for the quote
      const heading = document.createElement('h2');
      heading.innerHTML = quote.innerHTML;
      contentCell.appendChild(heading);
    }

    // Customer info (image, name, title, CTA)
    const customerInfo = panel.querySelector('.customer-info');
    if (customerInfo) {
      // Customer image
      const custPic = customerInfo.querySelector('picture');
      if (custPic) {
        contentCell.appendChild(custPic);
      }
      // Titles (name, role)
      const titles = customerInfo.querySelector('.titles');
      if (titles) {
        // Add each <p> as a paragraph
        titles.querySelectorAll('p').forEach((p) => {
          contentCell.appendChild(p);
        });
      }
      // CTA link
      const cta = customerInfo.querySelector('a[href]');
      if (cta) {
        contentCell.appendChild(cta);
      }
    }

    // Stats list
    const statsList = panel.querySelector('ul');
    if (statsList) {
      // Add as-is
      contentCell.appendChild(statsList);
    }

    // Add row to table
    rows.push([imageCell, contentCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
