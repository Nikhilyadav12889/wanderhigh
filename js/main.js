// js/main.js — All interactivity for WanderHigh

/* ===================== NAVBAR ===================== */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});


/* ===================== TREK CARDS ===================== */
function getDifficultyColor(difficulty) {
  return { easy: '#4caf50', moderate: '#ff9800', hard: '#f44336' }[difficulty] || '#888';
}

function renderTreks(filter = 'all') {
  const grid = document.getElementById('trekGrid');
  grid.innerHTML = '';
  const filtered = filter === 'all' ? treks : treks.filter(t => t.difficulty === filter);

  filtered.forEach((trek, i) => {
    const card = document.createElement('div');
    card.className = 'trek-card reveal';
    card.style.animationDelay = `${i * 0.1}s`;
    card.innerHTML = `
      <div class="trek-img-wrap">
        <img src="${trek.image}" alt="${trek.name}" loading="lazy"/>
        <span class="trek-tag">${trek.tag}</span>
        <span class="trek-difficulty" style="background:${getDifficultyColor(trek.difficulty)}">${trek.difficulty}</span>
      </div>
      <div class="trek-body">
        <p class="trek-region">📍 ${trek.region}</p>
        <h3>${trek.name}</h3>
        <p class="trek-desc">${trek.description}</p>
        <div class="trek-meta">
          <span>⏱ ${trek.duration}</span>
          <span>🏔 ${trek.altitude}</span>
        </div>
        <div class="trek-footer">
          <span class="trek-price">${trek.price} <small>/ person</small></span>
          <a href="pages/trek-detail.html?id=${trek.id}" class="btn-book">View Trek</a>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
  observeReveal();
}

// Filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderTreks(btn.dataset.filter);
  });
});

renderTreks();


/* ===================== SCROLL REVEAL ===================== */
function observeReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
observeReveal();


/* ===================== TESTIMONIAL SLIDER ===================== */
const track = document.getElementById('testimonialTrack');
const dotsContainer = document.getElementById('sliderDots');
let currentSlide = 0;
const totalSlides = document.querySelectorAll('.testimonial-card').length;

// Create dots
for (let i = 0; i < totalSlides; i++) {
  const dot = document.createElement('span');
  dot.className = 'dot' + (i === 0 ? ' active' : '');
  dot.addEventListener('click', () => goToSlide(i));
  dotsContainer.appendChild(dot);
}

function goToSlide(index) {
  currentSlide = index;
  track.style.transform = `translateX(-${index * 100}%)`;
  document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === index));
}

// Auto-advance every 4 seconds
setInterval(() => {
  goToSlide((currentSlide + 1) % totalSlides);
}, 4000);


/* ===================== NEWSLETTER ===================== */
function subscribeNewsletter() {
  const email = document.getElementById('emailInput').value.trim();
  const msg = document.getElementById('newsletterMsg');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    msg.textContent = '⚠️ Please enter your email.';
    msg.style.color = '#ff9800';
    return;
  }
  if (!emailRegex.test(email)) {
    msg.textContent = '⚠️ Please enter a valid email address.';
    msg.style.color = '#f44336';
    return;
  }

  // Save to localStorage
  let subscribers = JSON.parse(localStorage.getItem('subscribers') || '[]');
  if (subscribers.includes(email)) {
    msg.textContent = '✅ You\'re already subscribed!';
    msg.style.color = '#4caf50';
    return;
  }
  subscribers.push(email);
  localStorage.setItem('subscribers', JSON.stringify(subscribers));

  document.getElementById('emailInput').value = '';
  msg.textContent = '🎉 You\'re in! Welcome to the WanderHigh family.';
  msg.style.color = '#4caf50';
}

// Allow Enter key in newsletter
document.getElementById('emailInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') subscribeNewsletter();
});
