document.addEventListener("DOMContentLoaded", () => {
  // Sistem za prebacivanje scena (Tabovi umesto beskonačnog skrolovanja)
const navLinks = document.querySelectorAll('.nav-link');
const scenes = document.querySelectorAll('.page-scene');

function switchScene(targetId) {
  // Sakrij sve scene i ukloni 'active' klasu
  scenes.forEach(scene => {
    scene.classList.remove('active-scene');
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
  });

  // Prikaži ciljanu scenu
  const activeScene = document.getElementById(targetId);
  if (activeScene) {
    activeScene.classList.add('active-scene');
  }

  // Označi aktivni link u navigaciji
  const activeLink = document.querySelector(`.nav-link[data-target="${targetId}"]`);
  if (activeLink) {
    activeLink.classList.add('active');
  }
}

// Klik na navigaciju
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('data-target');
    switchScene(targetId);
    window.location.hash = targetId;
  });
});

// Učitavanje odgovarajuće scene iz URL hash-a ako postoji (npr. #podrzi-me)
const initialHash = window.location.hash.replace('#', '');
if (initialHash && document.getElementById(initialHash)) {
  switchScene(initialHash);
} else {
  switchScene('videi'); // Podrazumevana (prva) scena
}
  const grid = document.getElementById("video-grid");

  fetch("videos.json")
    .then((response) => response.json())
    .then((videos) => {
      videos.forEach((video) => {
        // 1. Dinamičko kreiranje video kartice na sajtu
        const card = document.createElement("article");
        card.className = "video-card";
        card.innerHTML = `
          <div class="responsive-iframe">
            <iframe src="https://www.youtube.com/embed/${video.id}" allowfullscreen loading="lazy"></iframe>
          </div>
          <div class="card-content">
            <h3>${video.title}</h3>
            <p>${video.description}</p>
          </div>
        `;
        grid.appendChild(card);

        // 2. Dinamičko generisanje Google VideoObject Schema skripte (SEO)
        const schema = {
          "@context": "https://schema.org",
          "@type": "VideoObject",
          "name": `${video.title} | Pazi Sad`,
          "description": video.description,
          "thumbnailUrl": [
            `https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`
          ],
          "uploadDate": video.uploadDate,
          "contentUrl": `https://www.youtube.com/watch?v=${video.id}`,
          "embedUrl": `https://www.youtube.com/embed/${video.id}`
        };

        if (video.chapters && video.chapters.length > 0) {
          schema.hasPart = video.chapters.map((ch) => ({
            "@type": "Clip",
            "name": ch.name,
            "startOffset": ch.startOffset,
            "endOffset": ch.endOffset
          }));
        }

        const scriptTag = document.createElement("script");
        scriptTag.type = "application/ld+json";
        scriptTag.textContent = JSON.stringify(schema, null, 2);
        document.head.appendChild(scriptTag);
      });
    })
    .catch((error) => console.error("Greška pri učitavanju videos.json fajla:", error));
});
