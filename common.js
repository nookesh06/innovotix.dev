(()=> {
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  // Responsive navigation shared by all pages.
  const menu = $('.menu');
  const nav = $('.topbar nav');
  if (menu && nav) menu.addEventListener('click', () => nav.classList.toggle('open'));

  // Shared scroll reveal for content sections.
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (window.gsap && !reduce && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    $$('.module-card,.company-story,.person-card,.partner-grid article,.learning-grid article,.kit-detail,.solution-grid article,.routine-grid article,.timeline article')
      .forEach(el => gsap.from(el, {
        y: 30, opacity: 0, duration: .7, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      }));
  }
})();