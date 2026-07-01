
(async function(){
  // __INDEX_GUARD__
  if(!document.getElementById('grid')) return;
  const $ = (s,root=document)=>root.querySelector(s);
  const $$ = (s,root=document)=>Array.from(root.querySelectorAll(s));

  const state = { games: [], view: [], sort: 'az', chunk: 96, rendered: 0, selectedCat: '' };

  function sortView(){
    if(state.sort === 'az'){
      state.view.sort((a,b)=> (a.label||'').localeCompare(b.label||''));
    }else if(state.sort === 'za'){
      state.view.sort((a,b)=> (b.label||'').localeCompare(a.label||''));
    }else if(state.sort === 'rnd'){
      for(let i=state.view.length-1;i>0;i--){
        const j = Math.floor(Math.random()*(i+1));
        [state.view[i],state.view[j]] = [state.view[j],state.view[i]];
      }
    }
  }

  function renderInto(list, target){
    target.innerHTML = '';
    const frag = document.createDocumentFragment();
    for(const g of list){
      const card = document.createElement('article');
      card.className = 'card';

      const a = document.createElement('a');
      const gi = state.games.findIndex(x => x.label===g.label && x.game_url===g.game_url);
      a.href = (window.gameSlugMap && window.gameSlugMap[String(g.id)]) ? window.gameSlugMap[String(g.id)] : ('test.html?id=' + g.id);
      a.title = g.label || '';

      const img = document.createElement('img');
      img.className = 'thumb';
      img.loading = 'lazy';
      img.src = g.game_image_icon || '';
      img.alt = g.label || 'Game';

      a.appendChild(img);
      card.appendChild(a);

      const body = document.createElement('div');
      body.className = 'card-body';

      const titleLink = document.createElement('a');
      titleLink.className = 'title';
      titleLink.href = a.href;
      titleLink.textContent = g.label || '';
      body.appendChild(titleLink);

      // Categories hidden on index for main grid; keep same behavior here (no chips)
      card.appendChild(body);
      frag.appendChild(card);
    }
    target.appendChild(frag);
  }

  function renderMore(){
    const grid = $('#grid');
    const frag = document.createDocumentFragment();
    const end = Math.min(state.rendered + state.chunk, state.view.length);
    for(let i=state.rendered; i<end; i++){
      const g = state.view[i];
      const card = document.createElement('article');
      card.className = 'card';

      const a = document.createElement('a');
      const gi = state.games.findIndex(x => x.label===g.label && x.game_url===g.game_url);
      a.href = (window.gameSlugMap && window.gameSlugMap[String(g.id)]) ? window.gameSlugMap[String(g.id)] : ('test.html?id=' + g.id);
      a.title = g.label || '';

      const img = document.createElement('img');
      img.className = 'thumb';
      img.loading = 'lazy';
      img.src = g.game_image_icon || '';
      img.alt = g.label || 'Game';

      a.appendChild(img);
      card.appendChild(a);

      
      const body = document.createElement('div');
      body.className = 'card-body';

      // Clickable title as the ONLY text element
      const titleLink = document.createElement('a');
      titleLink.className = 'title';
      titleLink.href = a.href;
      titleLink.textContent = g.label || '';
      body.appendChild(titleLink);

      // Optionally show category chips ONLY on non-index pages
      const isIndex = /(?:^|\/)index\.html$|\/$/.test(location.pathname);
      if(!isIndex && Array.isArray(g.categories) && g.categories.length){
        const meta = document.createElement('div');
        meta.className = 'meta';
        for(const c of g.categories.slice(0,3)){
          const chip = document.createElement('span');
          chip.className = 'chip'; chip.textContent = c;
          meta.appendChild(chip);
        }
        body.appendChild(meta);
      }

      card.appendChild(body);
      frag.appendChild(card);
}
    grid.appendChild(frag);
    state.rendered = end;
  }

  function render(list){
    const grid = $('#grid');
    grid.innerHTML = '';
    $('#count').textContent = list.length + ' games';
    state.rendered = 0;
    renderMore();
  }

  function applyFilters(){
    const q = ($('#q').value || '').trim().toLowerCase();
    const c = $('#cat').value || '';
    state.view = state.games.filter(g => {
      const nameOk = !q || (g.label && g.label.toLowerCase().includes(q));
      const catOk = !c || (Array.isArray(g.categories) && g.categories.includes(c));
      return nameOk && catOk;
    });
    sortView();
    render(state.view);
  }

  // Fetch games
  const res = await fetch('assets/data/games.json');
  const games = await res.json();
  state.games = Array.isArray(games) ? games.map((g,i)=>({...g, id: String(i+1)})) : [];
  state.view = state.games.slice();

  // Build category options
  const cats = new Set();
  for(const g of state.games){
    if(Array.isArray(g.categories)){
      for(const c of g.categories){ if(c) cats.add(c); }
    }
  }
  const catSel = $('#cat');
  const catbar = $('#catbar');
  for(const c of [...cats].sort((a,b)=>a.localeCompare(b))){
    const opt = document.createElement('option');
    opt.value = c; opt.textContent = c;
    catSel.appendChild(opt);
    if(catbar){
      const b = document.createElement('button');
      b.className = 'catbtn'; b.type='button'; b.textContent = c; b.dataset.cat = c;
      b.addEventListener('click', () => {
        state.selectedCat = (state.selectedCat === c ? '' : c);
        // toggle active UI
        [...catbar.querySelectorAll('.catbtn')].forEach(x=> x.classList.toggle('active', x.dataset.cat === state.selectedCat));
        // mirror to hidden select for compatibility
        if(catSel) catSel.value = state.selectedCat;
        applyFilters();
      });
      catbar.appendChild(b);
    }
  }
  /*__BUILD_CATBTNS__*/

  // Popular section render
  const popEl = document.getElementById('popular-grid');
  if (popEl && Array.isArray(window.popularGames)){
    const byLabel = new Map(state.games.map(g => [g.label, g]));
    const chosen = window.popularGames.map(lbl => byLabel.get(lbl)).filter(Boolean).slice(0, 20);
    renderInto(chosen, popEl);
  }

  // URL params
  const urlParams = new URLSearchParams(location.search);
  const urlCat = urlParams.get('cat') || '';
  const sortSel = $('#sort');

  if(urlCat){
    const found = [...catSel.options].find(o=>o.value===urlCat);
    if(found){ catSel.value = urlCat; state.selectedCat = urlCat; }
  }
  // Reflect selection on buttons
  if(catbar){
    [...catbar.querySelectorAll('.catbtn')].forEach(x=> x.classList.toggle('active', x.dataset.cat === state.selectedCat));
  }
  /*__APPLY_URLCAT_TO_BUTTONS__*/

  // Bind events
  $('#q').addEventListener('input', applyFilters);
  $('#cat').addEventListener('change', applyFilters);
  if (sortSel){
    sortSel.addEventListener('change', ()=>{ state.sort = sortSel.value; applyFilters(); });
  }
  $('#reset').addEventListener('click', () => { $('#q').value=''; $('#cat').value=''; state.selectedCat=''; if(sortSel) sortSel.value='az'; state.sort='az'; if(catbar){[...catbar.querySelectorAll('.catbtn')].forEach(x=>x.classList.remove('active'));} /*__RESET_HOOK__*/ applyFilters(); });

  // Initial render
  applyFilters();

  // Infinite scroll
  window.addEventListener('scroll', () => {
    const nearBottom = (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 400);
    if(nearBottom && state.rendered < state.view.length){
      renderMore();
    }
  });

  // Year
  $('#year').textContent = new Date().getFullYear();
})();
