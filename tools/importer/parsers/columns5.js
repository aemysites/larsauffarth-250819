/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row must match example exactly
  const headerRow = ['Columns (columns5)'];

  // Extract all immediate content from quiz block that is visible
  // First column: all question text, description, and choices
  let column1Content = [];
  const formWrapper = element.querySelector('.form-wrapper');
  const gform = formWrapper && formWrapper.querySelector('.gform_wrapper');
  if (gform) {
    // Include heading (h3 and description)
    const gformHeading = gform.querySelector('.gform_heading');
    if (gformHeading) {
      Array.from(gformHeading.children).forEach(child => {
        // Only push if content present
        if (child.textContent && child.textContent.trim()) {
          column1Content.push(child);
        }
      });
    }
    // Include quiz question and choices (as text)
    const quizField = gform.querySelector('.gquiz-field');
    if (quizField) {
      // Main question label
      const mainLabel = quizField.querySelector('.gfield_label');
      if (mainLabel && mainLabel.textContent.trim()) {
        const questionP = document.createElement('p');
        questionP.textContent = mainLabel.textContent.trim();
        column1Content.push(questionP);
      }
      // Choices: list of radio labels as <ul>
      const choicesUl = quizField.querySelector('.gfield_radio');
      if (choicesUl) {
        const choiceLabels = Array.from(choicesUl.querySelectorAll('label'));
        if (choiceLabels.length) {
          const ul = document.createElement('ul');
          choiceLabels.forEach(label => {
            const li = document.createElement('li');
            li.textContent = label.textContent.trim();
            ul.appendChild(li);
          });
          column1Content.push(ul);
        }
      }
    }
  }

  // Second column: image
  let column2Content = [];
  if (gform) {
    const imageWrapper = gform.querySelector('.image-wrapper');
    const img = imageWrapper && imageWrapper.querySelector('img');
    if (img) {
      column2Content.push(img);
    }
  }

  // Build the table rows per spec
  const rows = [
    headerRow,
    [column1Content, column2Content]
  ];

  // Create the table and replace the original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
