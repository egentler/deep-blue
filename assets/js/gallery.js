// Browser Back should close an open full-screen image or series and keep
// visitors on the page where they opened it. The on-screen X does the same.
// No routing changes, third-party libraries, or CMS changes are required.
const deepBlueViewerHistory = (() => {
  const KEY = '__deepBlueViewerEntry';
  const previouslyOpened = new Map();
  let sequence = 0;
  let active = null;

  // A hard reload inside an open modal cannot restore its JS callbacks. Make
  // the refreshed page's current history entry a normal (closed) page.
  if (history.state && typeof history.state === 'object' && history.state[KEY] != null) {
    const clean = { ...history.state };
    delete clean[KEY];
    history.replaceState(clean, '', location.href);
  }

  function open(openModal, closeModal) {
    if (active) active.close();
    openModal();
    const id = ++sequence;
    previouslyOpened.set(id, { open: openModal, close: closeModal });
    const base = history.state && typeof history.state === 'object' ? history.state : {};
    history.pushState({ ...base, [KEY]: id }, '', location.href);
    active = { id, open: openModal, close: closeModal };
  }

  function close() {
    if (!active) return;
    const id = active.id;
    active.close();
    active = null;
    // Go back only over the viewer's own synthetic history entry. This does
    // NOT navigate to a previous category page.
    if (history.state && history.state[KEY] === id) history.back();
  }

  window.addEventListener('popstate', event => {
    const targetId = event.state && event.state[KEY];
    if (active && active.id === targetId) return;
    if (active) active.close();
    active = null;
    // Browser Forward can re-open a viewer that was closed with Back.
    if (previouslyOpened.has(targetId)) {
      const entry = previouslyOpened.get(targetId);
      entry.open();
      active = { id: targetId, ...entry };
    }
  });

  return { open, close };
})();

// Individual photographs/artwork: an accessible full-screen image viewer.
(() => {
  const modal = document.querySelector('#deepblue-image-viewer');
  if (!modal || typeof modal.showModal !== 'function') return;
  const image = modal.querySelector('[data-viewer-image]');
  const title = modal.querySelector('[data-viewer-title]');
  const credit = modal.querySelector('[data-viewer-credit]');
  const previous = modal.querySelector('[data-viewer-prev]');
  const next = modal.querySelector('[data-viewer-next]');
  const openers = Array.from(document.querySelectorAll('[data-open-image]'));
  let group = [], current = 0;

  function display(index) {
    if (!group.length) return;
    current = (index + group.length) % group.length;
    const item = group[current];
    image.src = item.dataset.src;
    image.alt = item.dataset.title || 'Student artwork';
    title.textContent = item.dataset.title || '';
    credit.textContent = item.dataset.credit || '';
    previous.hidden = next.hidden = group.length < 2;
  }

  openers.forEach(opener => opener.addEventListener('click', () => {
    deepBlueViewerHistory.open(() => {
      group = openers.filter(item => item.dataset.group === opener.dataset.group);
      display(group.indexOf(opener));
      modal.showModal();
    }, () => { if (modal.open) modal.close(); });
  }));
  modal.querySelector('[data-viewer-close]').addEventListener('click', deepBlueViewerHistory.close);
  previous.addEventListener('click', () => display(current - 1));
  next.addEventListener('click', () => display(current + 1));
  modal.addEventListener('click', event => {
    if (event.target === modal) deepBlueViewerHistory.close();
  });
  modal.addEventListener('cancel', event => {
    event.preventDefault();
    deepBlueViewerHistory.close();
  });
  modal.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); display(current - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); display(current + 1); }
  });
  modal.addEventListener('close', () => { image.removeAttribute('src'); });
})();

// Multi-image art/photography series: one scrollable, dark gallery.
(() => {
  const modal = document.querySelector('#deepblue-series-viewer');
  if (!modal || typeof modal.showModal !== 'function') return;
  const container = modal.querySelector('[data-series-content]');
  let lastTrigger = null;

  document.querySelectorAll('[data-open-series]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const source = document.getElementById(trigger.dataset.seriesId);
      if (!source || source.tagName !== 'TEMPLATE') return;
      deepBlueViewerHistory.open(() => {
        lastTrigger = trigger;
        container.replaceChildren(source.content.cloneNode(true));
        modal.showModal();
        modal.scrollTop = 0;
        const scroll = modal.querySelector('.series-viewer-scroll');
        if (scroll) scroll.scrollTop = 0;
      }, () => { if (modal.open) modal.close(); });
    });
  });
  modal.querySelector('[data-series-close]').addEventListener('click', deepBlueViewerHistory.close);
  modal.addEventListener('click', event => {
    if (event.target === modal) deepBlueViewerHistory.close();
  });
  modal.addEventListener('cancel', event => {
    event.preventDefault();
    deepBlueViewerHistory.close();
  });
  modal.addEventListener('close', () => {
    container.replaceChildren();
    if (lastTrigger) lastTrigger.focus({ preventScroll: true });
  });
})();
