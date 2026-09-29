document.addEventListener('DOMContentLoaded', async () => {
  const root = document.getElementById('app-root');
  const nav = document.getElementById('nav-links');

  try {
    const response = await fetch('data/content.json');
    const data = await response.json();

    document.getElementById('site-title').textContent = data.siteTitle;

    data.partitions.forEach((partition, pIndex) => {
      // Build top navigation item
      const navItem = document.createElement('a');
      navItem.href = `#${partition.id}`;
      navItem.textContent = partition.navLabel;
      nav.appendChild(navItem);

      // Build Partition Section Container
      const partSection = document.createElement('section');
      partSection.id = partition.id;
      partSection.className = 'partition';

      // Section Header & Divider
      partSection.innerHTML = `
        <div class="partition-header">
          <h2>${partition.heading}</h2>
          ${partition.subtitle ? `<p class="subtitle">${partition.subtitle}</p>` : ''}
        </div>
      `;

      // Render cards within this partition (alternating left/right)
      partition.cards.forEach((card, cIndex) => {
        const cardElem = document.createElement('div');
        const isAlternate = (cIndex % 2 === 1);
        cardElem.className = `card ${isAlternate ? 'align-right' : 'align-left'}`;

        let mediaHtml = '';
        if (card.youtubeId) {
          mediaHtml = `
            <div class="card-media">
              <div class="video-wrapper">
                <iframe src="https://www.youtube.com/embed/${card.youtubeId}" frameborder="0" allowfullscreen></iframe>
              </div>
            </div>`;
        } else if (card.image) {
          mediaHtml = `
            <div class="card-media">
              <img src="${card.image}" alt="${card.title || 'Illustration'}" loading="lazy">
            </div>`;
        }

        let linksHtml = '';
        if (card.links && card.links.length > 0) {
          linksHtml = `
            <div class="resource-links">
              ${card.links.map(link => `<a href="${link.url}" target="_blank" rel="noopener noreferrer" class="badge">${link.label} &rarr;</a>`).join('')}
            </div>`;
        }

        let listHtml = '';
        if (card.points && card.points.length > 0) {
          listHtml = `<ul>${card.points.map(pt => `<li>${pt}</li>`).join('')}</ul>`;
        }

        cardElem.innerHTML = `
          <div class="card-content">
            <div class="card-text">
              ${card.title ? `<h3>${card.title}</h3>` : ''}
              ${card.text ? `<p>${card.text}</p>` : ''}
              ${listHtml}
              ${linksHtml}
            </div>
            ${mediaHtml}
          </div>
        `;

        partSection.appendChild(cardElem);
      });

      root.appendChild(partSection);
    });

    // IntersectionObserver scroll animation
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      document.querySelectorAll('.card').forEach(card => observer.observe(card));
    } else {
      document.querySelectorAll('.card').forEach(card => card.classList.add('visible'));
    }

  } catch (error) {
    console.error('Failed to load content modules:', error);
    root.innerHTML = '<p>Error loading content modules.</p>';
  }
});
