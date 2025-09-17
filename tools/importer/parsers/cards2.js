/* global WebImporter */
export default function parse(element, { document }) {
  // Find the team cards block (the advisor cards)
  const mgtTeam = element.querySelector('.mgt_team');
  if (!mgtTeam) return;
  // Find the advisor list (desktop carousel)
  const tabContent = mgtTeam.querySelector('.tab-content');
  if (!tabContent) return;
  const tabPane = tabContent.querySelector('.tab-pane.active.show');
  if (!tabPane) return;
  // Find all advisor-list ULs (may be multiple slides)
  const advisorLists = tabPane.querySelectorAll('ul.advisor-list');
  // Collect all LI advisor cards
  const advisorCards = [];
  advisorLists.forEach((ul) => {
    ul.querySelectorAll('li.teammember-container').forEach((li) => {
      advisorCards.push(li);
    });
  });
  // Build table rows for each advisor card
  const rows = advisorCards.map((li) => {
    // Defensive: find image
    const img = li.querySelector('.col-pic img');
    // Defensive: find name/title block
    const colBio = li.querySelector('.col-bio');
    // Defensive: find button(s)
    const btnWrap = li.querySelector('.btn-wrap');
    // Defensive: find contact icons (phone, linkedin, email)
    const bioInfo = colBio ? colBio.querySelector('.bio-info') : null;
    // Defensive: find bio description (from hidden div)
    let bioDescription = '';
    const entityId = li.querySelector('.box-btn')?.getAttribute('data-entityid');
    if (entityId) {
      // Instead of searching from element, search from li's parent (which contains the hidden bios)
      const parent = li.parentNode;
      const hiddenBioDiv = parent.querySelector(`[id="${entityId}-bio"]`);
      if (hiddenBioDiv) {
        bioDescription = hiddenBioDiv.textContent.trim();
      }
    }
    // Compose text cell
    const textCell = document.createElement('div');
    if (colBio) {
      // Name (h3)
      const name = colBio.querySelector('h3');
      if (name) textCell.appendChild(name.cloneNode(true));
      // Titles (p)
      colBio.querySelectorAll('p').forEach((p) => {
        if (p.textContent.trim()) textCell.appendChild(p.cloneNode(true));
      });
      // Contact icons (phone, linkedin, email)
      if (bioInfo) {
        const contactDiv = document.createElement('div');
        contactDiv.className = 'advisor-contact-icons';
        bioInfo.querySelectorAll('li').forEach((liIcon) => {
          const a = liIcon.querySelector('a');
          if (a) {
            contactDiv.appendChild(a.cloneNode(true));
          }
        });
        textCell.appendChild(contactDiv);
      }
    }
    // Add bio description below titles (as plain text)
    if (bioDescription) {
      const bioDiv = document.createElement('div');
      bioDiv.className = 'advisor-bio';
      bioDiv.textContent = bioDescription;
      textCell.appendChild(bioDiv);
    }
    // Add buttons (View bio, Industry recognition)
    if (btnWrap) {
      btnWrap.querySelectorAll('a.btn').forEach((btn) => {
        textCell.appendChild(btn.cloneNode(true));
      });
    }
    return [img, textCell];
  });
  // Table header
  const headerRow = ['Cards (cards2)'];
  // Compose table
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.parentNode.replaceChild(block, element);
}
