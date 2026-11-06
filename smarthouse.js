(()=> {
  const $ = s => document.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (window.gsap && !reduce && $('.smart-page')) {
    gsap.to('.smart-glow', { opacity: .5, duration: 1.8, yoyo: true, repeat: -1, stagger: .3, ease: 'sine.inOut' });
    gsap.to('.smart-lamp i', { opacity: .6, duration: 1.4, yoyo: true, repeat: -1, stagger: .25, ease: 'sine.inOut' });
  }

  // Interactive lighting demo; controls affect only the illustrative scene.
  const room = $('#interactive-room');
  if (!room) return;
  const values = { ceiling: 82, accent: 58, floor: 72 };
  const tones = { warm: '255,204,133', neutral: '245,241,220', cool: '168,216,255', blue: '111,145,255' };
  const presets = {
    welcome: { ceiling: 82, accent: 58, floor: 72, tone: 'warm' },
    focus: { ceiling: 100, accent: 22, floor: 0, tone: 'neutral' },
    movie: { ceiling: 12, accent: 42, floor: 18, tone: 'warm' },
    night: { ceiling: 0, accent: 12, floor: 18, tone: 'blue' }
  };
  const update = (key, value) => {
    values[key] = Math.max(0, Math.min(100, Number(value)));
    room.style.setProperty('--' + key, values[key] / 100);
    const slider = $(`[data-brightness="${key}"]`);
    if (slider) slider.value = values[key];
    const label = $(`[data-value="${key}"]`);
    if (label) label.textContent = values[key] + '%';
    const toggle = $(`[data-light="${key}"]`);
    if (toggle) {
      toggle.classList.toggle('on', values[key] > 0);
      toggle.setAttribute('aria-pressed', String(values[key] > 0));
    }
    const active = Object.values(values).filter(v => v > 0).length;
    const count = $('#active-count');
    if (count) count.textContent = active + ' / 03 ON';
  };
  const tone = t => {
    room.style.setProperty('--light-color', tones[t] || tones.warm);
    $$('.tone').forEach(b => b.classList.toggle('active', b.dataset.tone === t));
  };

  $$('[data-light]').forEach(btn => btn.addEventListener('click', () => {
    const key = btn.dataset.light;
    update(key, values[key] > 0 ? 0 : Math.max(45, values[key]));
    $$('.scene-btn').forEach(b => b.classList.remove('active'));
  }));
  $$('[data-brightness]').forEach(slider => slider.addEventListener('input', () => {
    update(slider.dataset.brightness, slider.value);
    $$('.scene-btn').forEach(b => b.classList.remove('active'));
  }));
  $$('.scene-btn').forEach(btn => btn.addEventListener('click', () => {
    const preset = presets[btn.dataset.scene];
    if (!preset) return;
    Object.keys(values).forEach(key => update(key, preset[key]));
    tone(preset.tone);
    $$('.scene-btn').forEach(b => b.classList.toggle('active', b === btn));
    room.dataset.scene = btn.dataset.scene;
  }));
  $$('.tone').forEach(btn => btn.addEventListener('click', () => tone(btn.dataset.tone)));
  tone('warm');
  Object.keys(values).forEach(key => update(key, values[key]));
})();