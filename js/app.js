document.addEventListener('DOMContentLoaded', async () => {
  const root = document.getElementById('app-root');
  const nav = document.getElementById('nav-links');

  try {
    const response = await fetch('data/content.json');
    const data = await response.json();

    document.getElementById('site-title').textContent = data.siteTitle;

    data.sections.forEach(section => {
      // Build top navigation
      const navItem = document.createElement('a');
      navItem.href = `#${section.id}`;
      navItem.textContent = section.heading;
      nav.appendChild(navItem);

      // Build section container
      const secElement = document.createElement('section');
      secElement.id = section.id;
      secElement.className = `card ${section.type || ''}`;

      let innerHTML = `<h2>${section.heading}</h2>${section.summary ? `<p>${section.summary}</p>` : ''}`;

      if (section.image) {
        innerHTML += `<img src="${section.image}" alt="${section.heading}" loading="lazy">`;
      }

      if (section.techDetails) {
        innerHTML += `<ul>${section.techDetails.map(item => `<li>${item}</li>`).join('')}</ul>`;
      }

      if (section.youtubeId) {
        innerHTML += `
          <div class="video-wrapper">
            <iframe src="https://www.youtube.com/embed/${section.youtubeId}" frameborder="0" allowfullscreen></iframe>
          </div>
          ${section.commentary ? `<p class="commentary">${section.commentary}</p>` : ''}`;
      }

      secElement.innerHTML = innerHTML;
      root.appendChild(secElement);
    });

    // Animate cards on scroll
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });

      document.querySelectorAll('.card').forEach(card => observer.observe(card));
    } else {
      document.querySelectorAll('.card').forEach(card => card.classList.add('visible'));
    }

  } catch (error) {
    console.error('Failed to load site content:', error);
    root.innerHTML = '<p>Error loading content modules.</p>';
  }
});
