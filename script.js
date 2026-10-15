(() => {
  const BASE = 'https://wjwoitlioftohvwfymeq.supabase.co/storage/v1/object/public/designs/ossea/cloth-one-1.webp';
  const TOILE = 'https://wjwoitlioftohvwfymeq.supabase.co/storage/v1/object/public/designs/ossea/cloth-two-1.webp';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia('(min-width: 64rem)');
  const host = document.getElementById('picture');

  /* ---- the light ---- */
  let stop = null;
  function startLight() {
    host.innerHTML = '<img class="base" alt="" src="' + BASE + '"><img class="reveal" alt="" src="' + TOILE + '"><div class="grid"></div>';
    const reveal = host.querySelector('.reveal'), grid = host.querySelector('.grid');
    const cv = document.createElement('canvas'), ctx = cv.getContext('2d');
    let W = 0, H = 0, R = 0, cell = 0;
    const t = { x: innerWidth / 2, y: innerHeight / 2 }, s = { x: t.x, y: t.y }, g = { x: 0, y: 0 };
    let moved = false, raf = 0, last = '';
    function size() {
      W = cv.width = innerWidth; H = cv.height = innerHeight;
      R = Math.round(Math.min(420, Math.max(160, innerWidth * 0.16)));
      cell = Math.round(Math.min(64, Math.max(36, innerWidth * 0.028)));
      grid.style.backgroundSize = cell + 'px ' + cell + 'px';
      last = '';
    }
    function paint() {
      ctx.clearRect(0, 0, W, H);
      const gr = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, R);
      [[0, 1], [.4, 1], [.6, .75], [.75, .4], [.88, .12], [1, 0]].forEach(([p, a]) => gr.addColorStop(p, 'rgba(20,19,16,' + a + ')'));
      ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H);
      const u = 'url(' + cv.toDataURL() + ')';
      reveal.style.webkitMaskImage = u; reveal.style.maskImage = u;
    }
    function frame() {
      const k = reduce.matches ? 1 : 0.1;
      s.x += (t.x - s.x) * k; s.y += (t.y - s.y) * k;
      if (moved) {
        const key = s.x.toFixed(1) + s.y.toFixed(1);
        if (key !== last) { last = key; paint(); }
      }
      if (!reduce.matches) {
        const tx = (s.x / W - 0.5) * 16, ty = (s.y / H - 0.5) * 16;
        g.x += (tx - g.x) * 0.06; g.y += (ty - g.y) * 0.06;
        grid.style.backgroundPosition = g.x.toFixed(2) + 'px ' + g.y.toFixed(2) + 'px';
      }
      raf = requestAnimationFrame(frame);
    }
    function move(e) {
      t.x = e.clientX; t.y = e.clientY;
      if (!moved) { moved = true; s.x = t.x; s.y = t.y; reveal.style.opacity = 1; }
    }
    addEventListener('pointermove', move);
    addEventListener('resize', size);
    size(); raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('pointermove', move);
      removeEventListener('resize', size);
      host.innerHTML = '';
    };
  }
  function sync() {
    if (desktop.matches && !stop) stop = startLight();
    else if (!desktop.matches && stop) { stop(); stop = null; }
  }
  desktop.addEventListener('change', sync); sync();

  /* ---- drawers and bag ---- */
  const drawer = document.getElementById('drawer'), back = document.getElementById('backdrop');
  const toastEl = document.getElementById('toast'), countEl = document.getElementById('count');
  const pieces = [['POPLIN DRESS SHIRT', 180, 'SMALL RUN'], ['OXFORD WORK SHIRT', 160, 'JUST CUT'], ['LINEN CAMP SHIRT', 140, 'ON HAND'], ['BRUSHED FLANNEL SHIRT', 190, 'TO ORDER']];
  const lines = [['LINE 01, CLEAN COLLAR', 'Crisp cotton cut to hold one sharp line.'], ['LINE 02, EASY SLEEVE', 'Built for range of motion and cool wear.'], ['LINE 03, BONE AND ASH', 'Off white shirting from fully recycled cotton.']];
  const notes = ['AUG 2026, HOW A COLLAR HOLDS ITS SHAPE, 4 MIN READ', 'JUL 2026, CLOSING THE LOOP ON COTTON, 6 MIN READ', 'JUN 2026, RESTRAINT AS A FUNCTION, 3 MIN READ'];
  const bagIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>';
  const bag = []; let current = null, tt = 0;
  const FOOT = '<p class="foot">NAVARD 2026, SHAPE BEFORE SEASON</p>';

  function head(title, sub) {
    return '<div class="dh"><div><h2 id="dTitle">' + title + '</h2>' + (sub ? '<div class="sub">' + sub + '</div>' : '') + '</div><button class="x" data-close>Close</button></div>';
  }
  function render() {
    let h = '';
    if (current === 'atelier') {
      h = head('Workroom', 'Current pieces') + '<ul class="rows">' + pieces.map((p, i) =>
        '<li><span class="tag">' + p[2] + '</span><span class="name">' + p[0] + '</span><span>' + p[1] + '<button class="ctl" data-add="' + i + '">Add</button></span></li>').join('') + '</ul>' + FOOT;
    } else if (current === 'lines') {
      h = head('Ledger 2026', 'Season lineup') + '<ul class="rows">' + lines.map(l => '<li><span class="name">' + l[0] + '</span><p>' + l[1] + '</p></li>').join('') + '</ul>' + FOOT;
    } else if (current === 'notes') {
      h = head('Dispatches', 'Latest notes') + '<ul class="rows">' + notes.map(n => '<li><span class="name">' + n + '</span></li>').join('') + '</ul>' + FOOT;
    } else if (current === 'bag') {
      h = head('Your bag') + (bag.length
        ? '<ul class="rows">' + bag.map((b, i) => '<li><span class="name">' + b[0] + '</span><span>' + b[1] + '<button class="ctl" data-rm="' + i + '">Remove</button></span></li>').join('') + '</ul><button class="checkout" data-checkout>Checkout</button>'
        : '<div class="empty">' + bagIcon + '<span>Nothing in your bag yet.</span></div>');
    }
    drawer.innerHTML = h;
  }
  function open(name) { current = name; render(); drawer.classList.add('on'); back.classList.add('on'); drawer.setAttribute('aria-hidden', 'false'); }
  function close() { drawer.classList.remove('on'); back.classList.remove('on'); drawer.setAttribute('aria-hidden', 'true'); }
  function toast(msg) {
    toastEl.textContent = msg; toastEl.hidden = false;
    clearTimeout(tt); tt = setTimeout(() => toastEl.hidden = true, 3000);
  }
  function count() { countEl.textContent = bag.length; countEl.hidden = !bag.length; }

  document.addEventListener('click', e => {
    const o = e.target.closest('[data-open]');
    if (o) return open(o.dataset.open);
    if (e.target.closest('[data-close]') || e.target === back) return close();
    const a = e.target.closest('[data-add]');
    if (a) { const p = pieces[a.dataset.add]; bag.push([p[0], p[1]]); count(); toast('Added ' + p[0] + ' to your bag.'); return; }
    const r = e.target.closest('[data-rm]');
    if (r) { bag.splice(+r.dataset.rm, 1); count(); render(); return; }
    if (e.target.closest('[data-checkout]')) { bag.length = 0; count(); close(); toast('Order placed.'); }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();
