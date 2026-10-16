// Full-screen, keyboard-accessible artwork viewer: no external library and no broken post links.
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
    group = openers.filter(item => item.dataset.group === opener.dataset.group);
    display(group.indexOf(opener));
    modal.showModal();
  }));
  modal.querySelector('[data-viewer-close]').addEventListener('click', () => modal.close());
  previous.addEventListener('click', () => display(current - 1));
  next.addEventListener('click', () => display(current + 1));
  modal.addEventListener('click', event => { if (event.target === modal) modal.close(); });
  modal.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); display(current - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); display(current + 1); }
  });
  modal.addEventListener('close', () => { image.removeAttribute('src'); });
})();


// A series is a self-contained, scrollable dark gallery. All images and artist
// credits stay together, without leaving the page or navigating to post URLs.
(() => {
  const modal = document.querySelector('#deepblue-series-viewer');
  if (!modal || typeof modal.showModal !== 'function') return;
  const container = modal.querySelector('[data-series-content]');
  let lastTrigger = null;

  document.querySelectorAll('[data-open-series]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const source = document.getElementById(trigger.dataset.seriesId);
      if (!source || source.tagName !== 'TEMPLATE') return;
      lastTrigger = trigger;
      container.replaceChildren(source.content.cloneNode(true));
      modal.showModal();
      modal.scrollTop = 0;
      const scroll = modal.querySelector('.series-viewer-scroll');
      if (scroll) scroll.scrollTop = 0;
    });
  });
  modal.querySelector('[data-series-close]').addEventListener('click', () => modal.close());
  modal.addEventListener('click', event => { if (event.target === modal) modal.close(); });
  modal.addEventListener('close', () => {
    container.replaceChildren();
    if (lastTrigger) lastTrigger.focus({preventScroll:true});
  });
})();
