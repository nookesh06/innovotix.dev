(()=> {
  const $ = s => document.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const bot = $('.walk-bot');
  const stage = $('.robot-walk-stage');
  const status = $('.robot-follow-status');

  if (bot && stage) initWheelBot(bot, stage, status);

  if (window.gsap && !reduce && $('.robotics-page')) {
    $$('.sidekick-bot').forEach((b, i) => {
      gsap.to(b, { y: i % 2 ? -10 : 9, rotation: i % 2 ? 2 : -2, duration: 1.2 + i * .2, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      b.querySelectorAll('.wheelbot-wheel').forEach((w, j) => gsap.to(w, { rotation: 360, duration: 2.8 + i * .5, repeat: -1, ease: 'none', delay: j * .1 }));
      const core = b.querySelector('.wheelbot-core');
      if (core) gsap.to(core, { scale: 1.2, opacity: .55, duration: .8 + i * .2, yoyo: true, repeat: -1 });
    });
  } else if ($('.robotics-page')) {
    document.documentElement.classList.add('motion-fallback');
  }
})();