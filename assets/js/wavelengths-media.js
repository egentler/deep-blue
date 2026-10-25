/* Only embed well-known video platforms from author-supplied CMS URLs. */
(function () {
  function embedFromLink(value) {
    let u;
    try { u = new URL(value); } catch (_) { return null; }
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
    const host = u.hostname.toLowerCase().replace(/^www\./, '');
    let id;
    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
      id = u.pathname === '/watch' ? u.searchParams.get('v') : u.pathname.match(/^\/(?:shorts|embed|live)\/([A-Za-z0-9_-]{11})/ )?.[1];
      if (id && /^[A-Za-z0-9_-]{11}$/.test(id)) return 'https://www.youtube-nocookie.com/embed/' + id;
    }
    if (host === 'youtu.be') {
      id = u.pathname.slice(1).split('/')[0];
      if (/^[A-Za-z0-9_-]{11}$/.test(id)) return 'https://www.youtube-nocookie.com/embed/' + id;
    }
    if (host === 'vimeo.com' || host === 'player.vimeo.com') {
      const m = u.pathname.match(/(?:^\/|\/video\/)(\d+)(?:\/|$)/);
      if (m) {
        const token = u.searchParams.get('h') || u.pathname.match(/^\/\d+\/([A-Za-z0-9]+)\/?$/)?.[1];
        return 'https://player.vimeo.com/video/' + m[1] + (token && /^[A-Za-z0-9]+$/.test(token) ? '?h=' + token : '');
      }
    }
    return null;
  }
  document.querySelectorAll('.db-external-video[data-video-url]').forEach(function (panel) {
    const target = embedFromLink(panel.dataset.videoUrl || '');
    if (!target) return; // Keep the original safe external link for other hosts.
    const frame = document.createElement('iframe');
    frame.src = target;
    frame.title = 'Performance video: ' + (panel.dataset.videoTitle || 'Student performance');
    frame.loading = 'lazy';
    frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    frame.allowFullscreen = true;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    const originalLink = panel.querySelector('a');
    panel.replaceChildren(frame);
    // Keep an ordinary link in case the embedded player is blocked on a school network.
    if (originalLink) {
      const linkRow = document.createElement('p');
      originalLink.textContent = 'Open video on YouTube or Vimeo';
      linkRow.appendChild(originalLink);
      panel.appendChild(linkRow);
    }
  });
  // If more than one audio composition is listed, play one at a time.
  document.querySelectorAll('.db-inline-audio').forEach(function (player) {
    player.addEventListener('play', function () {
      document.querySelectorAll('.db-inline-audio').forEach(function (other) {
        if (other !== player && !other.paused) other.pause();
      });
    });
  });
})();
