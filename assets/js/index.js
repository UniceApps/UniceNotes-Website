document.getElementById('year').textContent = new Date().getFullYear();

// Scroll reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      // stagger siblings in the same grid
      const siblings = e.target.parentElement.querySelectorAll('.reveal');
      siblings.forEach((el, idx) => {
        if (el === e.target) {
          setTimeout(() => el.classList.add('visible'), i * 60);
        }
      });
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));