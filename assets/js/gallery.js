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
