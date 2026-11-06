(()=> {
  const stage = document.querySelector('.home-hero-full .hero-media');
  const video = stage?.querySelector('.hero-motion');
  if (!stage || !video) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    video.pause();
    return;
  }

  // The video file itself contains a forward + reverse pass.
  // It therefore turns right, then returns left at the same encoded speed.
  video.loop = true;
  video.playbackRate = 1.0;

  const revealWhenReady = () => {
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      stage.classList.add('video-ready');
    }
  };
  video.addEventListener('loadeddata', revealWhenReady);
  video.addEventListener('canplay', revealWhenReady);
  video.addEventListener('error', () => stage.classList.remove('video-ready'));
  if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) revealWhenReady();

  const startPlayback = () => {
    video.play().catch(error => {
      console.warn('Robot animation could not autoplay:', error);
      stage.classList.remove('video-ready');
    });
  };
  if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) startPlayback();
  else video.addEventListener('canplay', startPlayback, { once: true });
})();