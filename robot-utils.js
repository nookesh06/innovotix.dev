function initWheelBot(bot, stage, status) {
  if (!bot || !stage) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gsap = window.gsap;
  let active = false;
  const setStatus = on => {
    if (status) {
      status.textContent = on ? 'CURSOR LINK: ACTIVE' : 'CURSOR LINK: STANDBY';
      status.classList.toggle('active', on);
    }
  };

  if (gsap && !reduce) {
    const rig = bot.querySelector('.wheelbot-rig');
    if (rig) gsap.to(rig, { y: -6, duration: .8, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    ['.wheelbot-wheel-left', '.wheelbot-wheel-right'].forEach((sel, i) => {
      const wheel = bot.querySelector(sel);
      if (wheel) gsap.to(wheel, { rotation: 360, duration: 2.4, repeat: -1, ease: 'none', transformOrigin: 'center center', delay: i * .12 });
    });
    const head = bot.querySelector('.wheelbot-head');
    if (head) gsap.to(head, { rotation: 3, duration: 1.8, yoyo: true, repeat: -1, ease: 'sine.inOut', transformOrigin: '200px 185px' });
    const core = bot.querySelector('.wheelbot-core');
    if (core) gsap.to(core, { scale: 1.22, opacity: .55, duration: .9, yoyo: true, repeat: -1, ease: 'sine.inOut', transformOrigin: 'center' });
    const arms = bot.querySelectorAll('.wheelbot-arm');
    if (arms.length) gsap.to(arms, { rotation: 7, duration: .65, yoyo: true, repeat: -1, stagger: .18, ease: 'sine.inOut', transformOrigin: '50% 10%' });
  }

  const move = event => {
    const r = stage.getBoundingClientRect();
    const px = (event.clientX - r.left) / r.width;
    const py = (event.clientY - r.top) / r.height;
    const dx = Math.max(-r.width * .23, Math.min(r.width * .23, (px - .5) * r.width * .46));
    const dy = Math.max(-r.height * .12, Math.min(r.height * .12, (py - .55) * r.height * .24));
    if (active) {
      if (gsap && !reduce) gsap.to(bot, { x: dx, y: dy, duration: .55, ease: 'power3.out', overwrite: 'auto' });
      else bot.style.transform = `translate(${dx}px,${dy}px)`;
    }
    const head = bot.querySelector('.wheelbot-head');
    if (head && gsap && !reduce) gsap.to(head, { rotation: (px - .5) * 10, duration: .3, ease: 'power2.out', overwrite: 'auto' });
  };
  const toggle = () => {
    active = !active;
    bot.classList.toggle('cursor-follow-active', active);
    setStatus(active);
    if (!active) {
      if (gsap && !reduce) gsap.to(bot, { x: 0, y: 0, duration: .55, ease: 'power3.out' });
      else bot.style.transform = '';
    } else if (status) status.textContent = 'CURSOR LINK: ACTIVE · MOVE POINTER';
  };
  bot.addEventListener('click', toggle);
  bot.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
  });
  stage.addEventListener('pointermove', move);
  stage.addEventListener('pointerleave', () => {
    if (active) {
      if (gsap && !reduce) gsap.to(bot, { x: 0, y: 0, duration: .7, ease: 'power2.out' });
      else bot.style.transform = '';
    }
  });
}