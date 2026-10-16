// Filters and incremental browsing; no server, database, or subscription needed.
(() => {
  const cards=[...document.querySelectorAll('#feed .post')];
  const buttons=[...document.querySelectorAll('.filter')];
  const input=document.getElementById('search');
  const more=document.getElementById('more');
  const noResults=document.getElementById('no-results');
  let category='All', query='', limit=6;
  function refresh(){
    const results=cards.filter(card => (category==='All'||card.dataset.category===category) && card.dataset.search.includes(query));
    cards.forEach(card => card.classList.toggle('is-hidden',!results.includes(card)||results.indexOf(card)>=limit));
    noResults.style.display=results.length?'none':'block';
    more.hidden=results.length<=limit;
  }
  buttons.forEach(btn=>btn.addEventListener('click',()=>{
    category=btn.dataset.filter;limit=6;
    buttons.forEach(b=>b.setAttribute('aria-pressed',String(b===btn)));refresh();
  }));
  input.addEventListener('input',()=>{query=input.value.trim().toLowerCase();limit=6;refresh()});
  more.addEventListener('click',()=>{limit+=6;refresh()});
  refresh();
})();
