/* -------------------------------------------------------------------------
   Arush Cineplex, Madhuban — site behaviour.
   Ported line-for-line from the source site's app/page.tsx,
   components/cinema-media.tsx, components/showcase-controller.tsx,
   lib/youtube-player.ts and lib/cinema-playback.ts (gireeshkumarreddy/pk),
   from React + Radix to plain DOM. Timelines, selectors, easing, stagger and
   durations are unchanged; only the copy in the markup was re-skinned.
--------------------------------------------------------------------------- */
(function () {
  'use strict';

  var MEDIA = 'media/';
  var VIDEO = 'media/video/';

  /* ---- the three films (source: app/page.tsx `films`) ---- */
  var films = [
    { title: 'Holocaust', subtitle: 'THE FEATURE', id: '7Y5q41D8_hs', image: 'OG011.webp', text: 'A silence. A silhouette. A name that needs no introduction. The entrance exactly as it runs on our screen.', show: 'FIRST SHOW · 10:00 AM' },
    { title: 'The Sound', subtitle: 'THE HOUSE MIX', id: 'FbXOsVByKmk', image: 'og-dual-guns.jpg', text: 'The calm ends here. Checked at 9:15 AM, again after the interval, on the same frame every week.', show: 'SECOND SHOW · 2:30 PM' },
    { title: 'The Trailer', subtitle: 'OFFICIAL PROMOTIONAL FILM', id: '_8J8LwoVH_0', image: 'og-truck.jpg', text: 'Two minutes, twenty seconds. What the marquee has been carrying all week, at the counter, on request.', show: 'FULL HOUSE · 7:00 PM' }
  ];

  var orbitImages = ['og-dual-guns.jpg', 'OG007.webp', 'OG015.webp', 'OG009.webp', 'OG002.jpg', 'og-truck.jpg', 'OG008.webp', 'OG011.webp', 'OG013.webp', 'OG016.jpg'];
  var constellationImages = ['OG007.webp', 'OG008.webp', 'OG011.webp', 'og-dual-guns.jpg', 'OG009.webp'];
  var DIMS = {"OG002.jpg":[1000,1500],"OG007.webp":[948,1400],"OG008.webp":[1018,1400],"OG009.webp":[617,1101],"OG011.webp":[1400,584],"OG013.webp":[933,1400],"OG015.webp":[1400,1400],"OG016.jpg":[1000,1500],"og-dual-guns.jpg":[1400,788],"og-portrait.jpg":[1400,788],"og-title-original.webp":[1399,954],"og-truck.jpg":[1399,988],"omi.jpg":[1390,783],"poster-4.jpg":[934,1400],"poster-6.jpg":[934,1400],"poster-9.jpg":[933,1400],"yt-0.jpg":[1280,720]};

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var body = document.body;
  var main = document.getElementById('root');
  var state = { menu: false, selected: null, paused: false, playerError: false, showcase: false, origin: '' };
  var media = [];

  function img(file, alt, eager) {
    var el = document.createElement('img');
    el.src = MEDIA + file;
    el.alt = alt || '';
    var d = DIMS[file] || [1600, 900];
    el.width = d[0]; el.height = d[1];
    el.loading = eager ? 'eager' : 'lazy';
    el.decoding = 'async';
    el.draggable = false;
    return el;
  }


  /* ---- the hall's own content (new sections; same components, same tokens) ---- */
  var hallTiles = [
    ['poster-9.jpg', 'THE LAMP · 4K LASER', 'Calibrated on Mondays against the same frame. The eye close-up is the test: if it is soft, the show does not start.'],
    ['poster-4.jpg', 'THE CLOTH · 9.1 × 4.7 M', 'Matte white, no gain, no curve. Rain, fire and a red sky are all the same grey until the film tells them what to be.'],
    ['poster-6.jpg', 'THE ROOM · 620 SEATS', '380 stall, 240 balcony. The back row of the stall is the seat the projectionist sits in when he is bored.'],
    ['omi.jpg', 'THE AISLE · TWO EXITS', 'Both unblocked, both lit, both swept before the first show. The interval is twelve minutes and the queue for the counter uses the whole of it.'],
    ['yt-0.jpg', 'THE MARK · STATION ROAD', 'Repainted by hand the morning the show changes. Four hundred metres from the station, opposite the bus stand.']
  ];
  var hallFacts = [
    ['SCREEN', '9.1 m × 4.7 m'], ['PROJECTOR', '4K laser'], ['SOUND', 'Dolby 7.1'],
    ['SEATS', '620 — 380 stall, 240 balcony'], ['AIR', 'Central, both decks'],
    ['ACCESS', 'Ramp at the counter · bay row K'], ['INTERVAL', '12 minutes, one break'],
    ['HOUSE OUT', 'By 10:00 PM']
  ];
  var priceFacts = [
    ['BALCONY', '₹60'], ['STALL', '₹100'], ['FIRST SHOW, TUESDAY', '₹40'],
    ['GROUP OF TEN OR MORE', '₹50 each'], ['STUDENT, WITH CARD', 'Half the stall rate']
  ];
  var visitFacts = [
    ['ADDRESS', 'Station Road, Madhuban, Bihar 848202'], ['LANDMARK', 'Opposite the bus stand'],
    ['FROM THE STATION', '400 m — a six minute walk'], ['AUTO-RICKSHAW', '₹20 from the stand'],
    ['PARKING', '40 two-wheelers on the premises'], ['COUNTER HOURS', '9:00 AM — 10:00 PM']
  ];
  var houseFaq = [
    ['Do you sell tickets online?', 'No. The window is the counter and the counter is the window: cash, this show, no seat numbers. The moment that changes, this page says so first.'],
    ['Can I pick my seat?', 'There is no picking. Stall or balcony, first come. If you want the middle of the stall on the 7:00 PM, be here an hour early — ten minutes is not early.'],
    ['Can we carry food in?', 'Outside food stays outside. The counter sells packets and water and it is open the whole show; the 2:30 house buys before the doors open, the 7:00 house buys at interval.'],
    ['Is there a 3D show?', 'No. One screen, 2D, one projector — and a lamp we keep honest is not a house that cuts corners on glass.'],
    ['Children?', 'The certificate is U/A. Children may attend with an adult; the 10:00 AM house is the one families take, and on a Tuesday it is the cheapest ticket in the week.'],
    ['Wheelchair access?', 'Ramp at the counter, one bay in row K of the stall with a companion seat beside it. Say it at the window and the aisle stays clear for you.'],
    ['What if my phone rings?', 'Someone will ask you to put it face down. The show does not stop for anyone, and the balcony will let you know what it thinks.'],
    ['What about the last show?', 'Doors at 6:40, projector at 7:00, house out by ten. The shutter comes down on the hour and the marquee light goes with it.']
  ];
  /* the site's pages — one place to edit the cross-page navigation */
  var PAGES = [
    ['index.html', 'The show', 'Holocaust, on our screen'],
    ['about.html', 'The complex', 'What Arush Cineplex is'],
    ['hall.html', 'The room', 'The lamp, the cloth, the seats'],
    ['shows.html', 'The week', 'Show times and the counter'],
    ['visit.html', 'Coming', 'Getting here and the house rules']
  ];

  var weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  var weekShows = [
    { time: '10:00 AM', note: 'FIRST SHOW', full: [] },
    { time: '2:30 PM', note: 'SECOND SHOW', full: [5] },
    { time: '7:00 PM', note: 'FULL HOUSE', full: [4, 5, 6] }
  ];

  /* =======================================================================
     youtube player + transport (source: lib/youtube-player.ts,
     lib/cinema-playback.ts)
     ======================================================================= */
  var ytPromise;
  function loadYouTubePlayer() {
    if (window.YT && window.YT.Player) return Promise.resolve(window.YT);
    if (ytPromise) return ytPromise;
    ytPromise = new Promise(function (resolve, reject) {
      var previous = window.onYouTubeIframeAPIReady;
      var script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      var timeout = setTimeout(function () { reject(new Error('Film player timed out')); }, 15000);
      window.onYouTubeIframeAPIReady = function () {
        clearTimeout(timeout);
        if (previous) previous();
        if (window.YT && window.YT.Player) resolve(window.YT);
        else reject(new Error('Film player unavailable'));
      };
      script.onerror = function () { clearTimeout(timeout); reject(new Error('Film player unavailable')); };
      document.head.appendChild(script);
    });
    return ytPromise;
  }

  // Only issue transport commands when intent changes. In particular, a startup
  // timestamp of zero while buffering must never trigger another seek request.
  function cinemaPlayback(player, start, end) {
    var ready = false, wanted = false, seeking = false;
    function apply() { if (!ready) return; if (wanted) player.playVideo(); else player.pauseVideo(); }
    function loop() {
      if (!ready || !wanted || seeking) return;
      seeking = true;
      player.seekTo(start, true);
      player.playVideo();
    }
    return {
      ready: function () { ready = true; player.mute(); apply(); },
      visibility: function (next) { if (wanted === next) return; wanted = next; apply(); },
      state: function (s) { if (s === 0) loop(); },
      sample: function () {
        if (!ready) return { state: -1, time: 0 };
        var s = player.getPlayerState(), t = player.getCurrentTime();
        if (seeking && s === 1 && t < end - 1) seeking = false;
        if (s === 1 && t >= end) loop();
        return { state: s, time: t };
      },
      resume: function () { if (ready && wanted) player.playVideo(); }
    };
  }

  /* =======================================================================
     CinemaMedia — poster + local muted loop + official YouTube excerpt
     (source: components/cinema-media.tsx)
     ======================================================================= */
  function CinemaMedia(root) {
    var self = this;
    this.root = root;
    var id = root.dataset.id || '';
    this.id = id;
    this.hasStream = !!id;
    this.priority = root.dataset.priority === 'true';
    this.aperture = Number(root.dataset.aperture || 2.39);
    var start = root.dataset.start ? Number(root.dataset.start) : null;
    var end = root.dataset.end ? Number(root.dataset.end) : null;
    this.loopStart = start !== null ? start : (id === '_8J8LwoVH_0' ? 100 : id === 'FbXOsVByKmk' ? 52 : 42);
    this.loopEnd = end !== null ? end : this.loopStart + 21;
    this.localSource = root.dataset.clip || (id === 'FbXOsVByKmk' ? 'firestorm' : (this.priority || id === '_8J8LwoVH_0') ? 'katana' : 'entrance');
    this.visible = false;
    this.paused = false;
    this.active = false;
    this.playing = false;
    this.localPlaying = false;
    this.transport = null;

    /* --- poster --- */
    var poster = img(root.dataset.image, root.dataset.label, this.priority);
    poster.fetchPriority = this.priority ? 'high' : 'auto';
    root.appendChild(poster);

    /* --- local clip --- */
    var video = document.createElement('video');
    video.className = 'cinema-local-video';
    video.src = VIDEO + this.localSource + '.mp4';
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('aria-hidden', 'true');
    video.preload = this.priority ? 'auto' : 'metadata';
    root.appendChild(video);
    this.video = video;

    /* --- youtube host --- */
    var host = document.createElement('div');
    host.className = 'cinema-player';
    root.appendChild(host);
    this.host = host;

    /* --- cinema crop for the embedded player --- */
    function sizeVideo() {
      var planeWidth = Math.max(root.clientWidth, root.clientHeight * self.aperture);
      root.style.setProperty('--film-width', planeWidth + 'px');
      root.style.setProperty('--film-height', Math.round(planeWidth * 9 / 16) + 'px');
    }
    this.sizeVideo = sizeVideo;
    if (window.ResizeObserver) new ResizeObserver(sizeVideo).observe(root);
    sizeVideo();

    this.setFlag('priority', this.priority ? 'true' : null);
    this.paint();
    this.sync();

    if (reduced) return;

    if (this.priority) this.setActive(true);
    var observer = new IntersectionObserver(function (entries) {
      var entry = entries[0];
      self.visible = entry.isIntersecting && entry.intersectionRatio >= 0.08;
      if (self.visible) self.setActive(true);
      self.sync();
    }, { threshold: [0, 0.08] });
    // Cue nearby players, but autoplay only the visible film. Distant sections
    // no longer create six competing video downloads at page load.
    var prepare = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) self.setActive(true);
    }, { rootMargin: '100% 0px' });
    observer.observe(root);
    prepare.observe(root);

    /* --- local loop transport (source: cinema-media.tsx second effect) --- */
    var lastTime = 0;
    video.addEventListener('timeupdate', function () {
      if (!video.paused && video.currentTime !== lastTime) {
        self.setLocalPlaying(true);
        if (!self.playing) root.dataset.filmTime = video.currentTime.toFixed(2);
      }
      lastTime = video.currentTime;
    });
    ['pause', 'waiting'].forEach(function (evt) {
      video.addEventListener(evt, function () { self.setLocalPlaying(false); });
    });
    document.addEventListener('visibilitychange', function () { self.sync(); });
    window.addEventListener('og-showcase-play', function () { self.sync(); if (self.transport) self.transport.resume(); });
    setInterval(function () { self.sync(); }, 250);
  }

  CinemaMedia.prototype.setFlag = function (name, value) {
    if (value === null) this.root.removeAttribute('data-' + name);
    else this.root.setAttribute('data-' + name, value);
  };
  CinemaMedia.prototype.setPlaying = function (on) {
    this.playing = on;
    this.paint();
  };
  CinemaMedia.prototype.setLocalPlaying = function (on) {
    this.localPlaying = on;
    this.paint();
  };
  CinemaMedia.prototype.setState = function (s) { this.root.dataset.mediaState = s; };
  CinemaMedia.prototype.paint = function () {
    var r = this.root;
    r.dataset.playing = (this.playing || this.localPlaying) ? 'true' : 'false';
    r.dataset.streamPlaying = this.playing ? 'true' : 'false';
    r.dataset.localPlaying = this.localPlaying ? 'true' : 'false';
    r.dataset.paused = this.paused ? 'true' : 'false';
  };
  CinemaMedia.prototype.setActive = function (on) {
    if (this.active && !on) return;
    this.active = on;
    if (on) { this.mountPlayer(); this.sync(); }
  };
  CinemaMedia.prototype.setPaused = function (on) { this.paused = on; this.paint(); this.sync(); };
  CinemaMedia.prototype.sync = function () {
    if (!this.active) return;
    var video = this.video;
    var shouldPlay = this.visible && !this.paused && !this.playing && !document.hidden &&
      getComputedStyle(this.root).visibility !== 'hidden';
    if (shouldPlay && video.paused) {
      var p = video.play();
      if (p && p.catch) p.catch(function () {});
    } else if (!shouldPlay) {
      if (!video.paused) video.pause();
    }
    if (this.transport) this.transport.visibility(this.visible && !this.paused);
  };

  CinemaMedia.prototype.mountPlayer = function () {
    var self = this;
    if (!this.hasStream) { this.setState('local'); return; }
    if (this.mounted || reduced) return;
    this.mounted = true;
    this.setState('loading');
    loadYouTubePlayer().then(function (YT) {
      var player = new YT.Player(self.host, {
        videoId: self.id,
        playerVars: {
          autoplay: 0, mute: 1, playsinline: 1, controls: 0, disablekb: 1,
          rel: 0, start: self.loopStart, iv_load_policy: 3, origin: window.location.origin
        },
        events: {
          onReady: function (event) {
            var control = cinemaPlayback(event.target, self.loopStart, self.loopEnd);
            self.transport = control;
            control.visibility(self.visible && !self.paused);
            control.ready();
            self.setState('ready');
            var lastTime = 0, movingSamples = 0;
            // API readiness alone is not proof that decoded footage is moving.
            setInterval(function () {
              control.visibility(self.visible && !self.paused &&
                getComputedStyle(self.root).visibility !== 'hidden' && !document.hidden);
              var sample = control.sample();
              self.root.dataset.filmTime = sample.time.toFixed(2);
              if (sample.state === 1 && sample.time > lastTime + 0.08) movingSamples++;
              else movingSamples = 0;
              lastTime = sample.time;
              var moving = movingSamples >= 3 && self.visible && !self.paused;
              if (moving) { self.setPlaying(true); self.setState('playing'); }
              else if (sample.state !== 1) {
                self.setPlaying(false);
                self.setState(sample.state === 3 ? 'buffering' : sample.state === 2 ? 'paused' : 'ready');
              }
            }, 250);
            var iframe = self.host.querySelector('iframe');
            if (iframe) {
              iframe.title = self.root.dataset.label + ' — muted background film';
              iframe.tabIndex = -1;
              iframe.setAttribute('aria-hidden', 'true');
              iframe.setAttribute('allow', 'autoplay; encrypted-media');
              iframe.referrerPolicy = 'strict-origin-when-cross-origin';
            }
          },
          onStateChange: function (event) {
            if (self.transport) self.transport.state(event.data);
            if (event.data !== 1) self.setPlaying(false);
            if (event.data === 3) self.setState('buffering');
          },
          onError: function () { self.setPlaying(false); self.setState('unavailable'); },
          onAutoplayBlocked: function () { self.setPlaying(false); self.setState('blocked'); }
        }
      });
    }).catch(function () { self.setState('unavailable'); });
  };

  /* =======================================================================
     render the data-driven sections
     ======================================================================= */
  /* Pages share one script, so a section that a page does not have must not
     break it: host() hands back a detached node instead of null. */
  function host(id) { return document.getElementById(id) || document.createElement('div'); }
  var self_page = (window.location.pathname.split('/').pop() || 'index.html');
  if (self_page === '' || self_page === 'index.html') self_page = window.location.pathname === '/' ? 'index.html' : self_page;

  var mosaic = host('mosaic');
  orbitImages.forEach(function (image, i) {
    var angle = i / orbitImages.length * Math.PI * 2 - Math.PI / 2;
    var x = 50 + Math.cos(angle) * 43;
    var y = 50 + Math.sin(angle) * 43;
    var w = i % 3 === 0 ? 18 : 14;
    var tile = document.createElement('div');
    tile.className = 'mosaic-tile tile-' + i;
    tile.dataset.x = x;
    tile.dataset.y = y;
    tile.style.left = x + '%';
    tile.style.top = y + '%';
    tile.style.width = w + '%';
    tile.appendChild(img(image, '', i < 5));
    mosaic.appendChild(tile);
  });

  var constellation = host('constellation');
  constellationImages.forEach(function (image, i) {
    var tile = document.createElement('div');
    tile.className = 'world-tile world-tile-' + i;
    tile.dataset.index = i;
    tile.appendChild(img(image, ''));
    constellation.appendChild(tile);
  });

  var chapters = host('filmChapters');
  films.forEach(function (film, i) {
    var article = document.createElement('article');
    article.className = 'film-chapter';
    article.innerHTML =
      '<div class="chapter-topline"><span>0' + (i + 1) + '</span><span>' + film.subtitle + '</span><span>' + film.show + '</span></div>' +
      '<h2 class="chapter-title">' + film.title + '</h2>' +
      '<button class="film-image" type="button" data-open-film="' + i + '" aria-label="Play ' + film.title + '"><span class="chapter-play"><span class="play-icon"></span>PLAY FILM</span></button>' +
      '<div class="chapter-caption"><p>' + film.text + '</p><button class="text-link" type="button" data-open-film="' + i + '">WATCH <span class="play-icon"></span></button></div>';
    var panel = article.querySelector('.film-image');
    var mediaEl = document.createElement('div');
    mediaEl.className = 'cinema-media';
    mediaEl.dataset.image = film.image;
    mediaEl.dataset.id = film.id;
    mediaEl.dataset.label = film.title;
    mediaEl.setAttribute('aria-label', film.title);
    panel.insertBefore(mediaEl, panel.firstChild);
    chapters.appendChild(article);
  });

  var menuNav = host('menuNav');
  var here = [];
  main.querySelectorAll('[data-sheet]').forEach(function (sec) {
    here.push([sec.id, sec.dataset.sheet]);
  });
  /* fall back to the index list if a page forgot to mark its sections */
  if (!here.length && document.getElementById('home')) {
    here = [['home', 'The show'], ['about', 'About this page'], ['story', 'His world'], ['world', 'The fragments'],
      ['films', 'Show times'], ['hall', 'The hall'], ['schedule', 'The week'], ['visit', 'Getting here']];
  }
  here.forEach(function (item, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.dataset.nav = item[0];
    b.innerHTML = '<span>0' + (i + 1) + '</span>' + item[1];
    menuNav.appendChild(b);
  });

  var others = PAGES.filter(function (p) { return p[0] !== self_page; });
  if (others.length) {
    var divider = document.createElement('div');
    divider.className = 'menu-divider';
    divider.textContent = 'THE OTHER PAGES';
    menuNav.appendChild(divider);
    others.forEach(function (p, i) {
      var a = document.createElement('a');
      a.href = p[0];
      a.title = p[2];
      a.innerHTML = '<span>0' + (i + 1) + '</span>' + p[1];
      menuNav.appendChild(a);
    });
  }


  function rows(list, id, cls) {
    var el = host(id);
    list.forEach(function (row) {
      var li = document.createElement('li');
      if (cls) li.className = cls;
      li.innerHTML = '<span>' + row[0] + '</span><b>' + row[1] + '</b>';
      el.appendChild(li);
    });
  }

  var tilesHost = host('hallTiles');
  hallTiles.forEach(function (tile) {
    var fig = document.createElement('figure');
    var box = document.createElement('span');
    box.appendChild(img(tile[0], tile[1]));
    var cap = document.createElement('figcaption');
    cap.innerHTML = '<b>' + tile[1] + '</b><br>' + tile[2];
    fig.appendChild(box);
    fig.appendChild(cap);
    tilesHost.appendChild(fig);
  });

  rows(hallFacts, 'hallFacts');
  rows(priceFacts, 'priceFacts');
  rows(visitFacts, 'visitFacts');

  var grid = host('scheduleGrid');
  var todayIdx = (new Date().getDay() + 6) % 7;   // 0 = Monday
  weekDays.forEach(function (day, di) {
    var col = document.createElement('div');
    if (di === todayIdx) col.className = 'today';
    var head = document.createElement('div');
    head.className = 'day';
    head.textContent = day + (di === todayIdx ? ' · TODAY' : '');
    col.appendChild(head);
    weekShows.forEach(function (show) {
      var cell = document.createElement('div');
      var isFull = show.full.indexOf(di) > -1;
      cell.className = 'show' + (isFull ? ' full' : '');
      cell.innerHTML = '<em>' + show.time + '</em><span>' + (isFull ? 'HOUSE FULL' : 'AVAILABLE') + '</span>';
      col.appendChild(cell);
    });
    grid.appendChild(col);
  });

  var faq = host('faq');
  houseFaq.forEach(function (item, i) {
    var details = document.createElement('details');
    details.innerHTML = '<summary>' + item[0] + '<span class="num">0' + (i + 1) + '</span></summary><p>' + item[1] + '</p>';
    faq.appendChild(details);
  });

  document.querySelectorAll('.cinema-media').forEach(function (el) { media.push(new CinemaMedia(el)); });
  function refreshMedia() {
    var blocked = state.paused || state.selected !== null;
    media.forEach(function (m) { m.setPaused(blocked); });
  }

  /* =======================================================================
     navigation, overlays
     ======================================================================= */
  function navigate(id) {
    setMenu(false);
    setTimeout(function () {
      var el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    }, 120);
  }

  var menuRoot = document.getElementById('menuRoot');
  var menuOverlay = menuRoot.querySelector('[data-slot="sheet-overlay"]');
  var menuPanel = menuRoot.querySelector('[data-slot="sheet-content"]');
  var lastMenuFocus = null;

  function setMenu(on) {
    if (state.menu === on) return;
    state.menu = on;
    if (on) {
      lastMenuFocus = document.activeElement;
      menuRoot.hidden = false;
      menuOverlay.dataset.state = menuPanel.dataset.state = 'open';
      body.dataset.overlay = 'open';
      var first = menuPanel.querySelector('h2');
      if (first) { first.setAttribute('tabindex', '-1'); first.focus(); }
    } else {
      menuOverlay.dataset.state = menuPanel.dataset.state = 'closed';
      body.removeAttribute('data-overlay');
      setTimeout(function () { if (!state.menu) menuRoot.hidden = true; }, reduced ? 0 : 320);
      if (lastMenuFocus && lastMenuFocus.focus) lastMenuFocus.focus();
    }
  }
  document.getElementById('menuToggle').addEventListener('click', function () { setMenu(!state.menu); });
  menuRoot.addEventListener('click', function (e) {
    if (e.target === menuOverlay || e.target.closest('[data-slot="sheet-close"]')) setMenu(false);
  });

  var dialogRoot = document.getElementById('dialogRoot');
  var dialogOverlay = dialogRoot.querySelector('[data-slot="dialog-overlay"]');
  var dialogPanel = dialogRoot.querySelector('[data-slot="dialog-content"]');
  var filmTitle = document.getElementById('filmTitle');
  var filmHost = document.getElementById('filmHost');
  var filmFallback = document.getElementById('filmFallback');
  var lastDialogFocus = null;

  function openFilm(index) {
    state.playerError = false;
    state.selected = index;
    lastDialogFocus = document.activeElement;
    var film = films[index];
    filmTitle.textContent = film.title;
    filmFallback.href = 'https://www.youtube.com/watch?v=' + film.id;
    filmFallback.textContent = 'Open official film on YouTube';
    filmHost.innerHTML = '';
    var frame = document.createElement('iframe');
    frame.title = film.title;
    frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    frame.allowFullscreen = true;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.src = 'https://www.youtube.com/embed/' + film.id +
      '?autoplay=1&rel=0&playsinline=1&origin=' + encodeURIComponent(window.location.origin);
    frame.addEventListener('error', function () {
      state.playerError = true;
      filmFallback.textContent = 'Player unavailable — watch on YouTube';
    });
    filmHost.appendChild(frame);
    dialogRoot.hidden = false;
    dialogOverlay.dataset.state = dialogPanel.dataset.state = 'open';
    body.dataset.overlay = 'open';
    dialogPanel.querySelector('[data-slot="dialog-close"]').focus();
    refreshMedia();
  }

  function closeFilm() {
    if (state.selected === null) return;
    state.selected = null;
    dialogOverlay.dataset.state = dialogPanel.dataset.state = 'closed';
    if (!state.menu) body.removeAttribute('data-overlay');
    setTimeout(function () {
      if (state.selected === null) { dialogRoot.hidden = true; filmHost.innerHTML = ''; }
    }, reduced ? 0 : 220);
    if (lastDialogFocus && lastDialogFocus.focus) lastDialogFocus.focus();
    refreshMedia();
  }
  dialogRoot.addEventListener('click', function (e) {
    if (e.target === dialogOverlay || e.target.closest('[data-slot="dialog-close"]')) closeFilm();
  });

  document.addEventListener('click', function (e) {
    var nav = e.target.closest('[data-nav]');
    if (nav) { navigate(nav.dataset.nav); return; }
    var open = e.target.closest('[data-open-film]');
    if (open) openFilm(Number(open.dataset.openFilm));
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (state.selected !== null) closeFilm();
    else if (state.menu) setMenu(false);
  });

  var pauseButton = document.getElementById('pauseFilms');
  pauseButton.addEventListener('click', function () {
    state.paused = !state.paused;
    pauseButton.setAttribute('aria-label', state.paused ? 'Resume background films' : 'Pause background films');
    pauseButton.innerHTML = (state.paused ? 'PLAY MOTION' : 'PAUSE FILMS') +
      '<span aria-hidden="true">' + (state.paused ? '▷' : 'Ⅱ') + '</span>';
    refreshMedia();
  });

  /* ---- intro mark (source: the `introDone` timer) ---- */
  var intro = document.getElementById('intro');
  setTimeout(function () {
    if (intro && intro.parentNode) intro.remove();
  }, reduced ? 0 : 2600);

  /* =======================================================================
     animation timeline (source: app/page.tsx `useEffect`)
     ======================================================================= */
  gsap.registerPlugin(ScrollTrigger);
  var mobile = window.innerWidth < 700;

  var context = gsap.context(function () {
    if (reduced) return;

    /* The journey timeline belongs to the index page only; the secondary pages
       keep the reveal vocabulary but not the scroll sequence. */
    if (document.getElementById('home')) {

    var introTl = gsap.timeline();
    introTl.fromTo('.intro-mark', { y: 28, opacity: 0, clipPath: 'inset(100% 0 0 0)' }, { y: 0, opacity: 1, clipPath: 'inset(0% 0 0 0)', duration: 0.9, ease: 'power3.out' }, 0.1)
      .to('.intro-line', { scaleX: 1, duration: 1.2, ease: 'power2.inOut' }, 0.35)
      .to('.intro-mark', { scale: 0.2, y: function () { return -window.innerHeight * 0.5 + 43; }, duration: 0.9, ease: 'power3.inOut' }, 1.2)
      .to('.intro', { clipPath: 'inset(0 0 100% 0)', duration: 0.85, ease: 'power3.inOut' }, 1.65);

    gsap.set('.mosaic-tile', {
      scale: 2.1,
      x: function (_, element) { return (Number(element.dataset.x) - 50) * 10; },
      y: function (_, element) { return (Number(element.dataset.y) - 50) * 8; },
      opacity: 0
    });
    gsap.set(['.center-mark', '.manifesto', '.storm-line', '.portrait-scene'], { autoAlpha: 0 });
    gsap.set('.red-field', { clipPath: 'circle(0% at 50% 50%)' });
    gsap.set('.red-crescent', { autoAlpha: 0, scale: 0.6, rotation: -70 });

    var tl = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      scrollTrigger: { trigger: '.journey', start: 'top top', end: 'bottom bottom', scrub: 0.55, invalidateOnRefresh: true }
    });
    tl.to('.hero-copy, .hero-footer', { opacity: 0, y: -35, duration: 0.55 }, 0.15)
      .to('.opening-panel', { clipPath: 'circle(44vmin at 50% 50%)', scale: mobile ? 0.61 : 0.47, x: 0, y: 0, duration: 1.5 }, 0.35)
      .to('.opening-panel', { scale: 0.1, autoAlpha: 0, rotation: -28, duration: 0.8 }, 1.7)
      .to('.opening-panel .image-shade', { opacity: 0, duration: 0.9 }, 0.7)
      .to('.mosaic-tile', { scale: 1, x: 0, y: 0, opacity: 1, stagger: 0.025, duration: 1.55 }, 0.55)
      .to('.center-mark', { autoAlpha: 1, scale: 1, duration: 0.7 }, 1.9)
      .to('.mosaic', { rotation: -210, rotationX: 10, duration: 2.3, ease: 'none' }, 1.3)
      .to('.mosaic-tile', { rotationY: function (i) { return i % 2 === 0 ? 22 : -22; }, rotationZ: function (i) { return i % 2 === 0 ? 14 : -14; }, duration: 2.3, ease: 'none' }, 1.3)
      .to('.center-mark .wordmark', { rotation: -360, duration: 1.9, ease: 'power2.inOut' }, 1.9)
      .to('.red-crescent', { autoAlpha: 1, scale: 1, duration: 0.5 }, 1.8)
      .to('.red-crescent', { rotation: 360, scale: 1.6, duration: 1.8, ease: 'power2.inOut' }, 2.0)
      .to('.red-crescent', { autoAlpha: 0, duration: 0.5 }, 3.1)
      .to('.red-field', { clipPath: 'circle(150% at 50% 50%)', duration: 1.0, ease: 'power2.inOut' }, 2.65)
      .to('.center-mark', { opacity: 0.12, scale: 1.2, duration: 0.7 }, 3.1)
      .fromTo('.manifesto', { y: 35 }, { y: 0, autoAlpha: 1, duration: 0.7 }, 2.75)
      .to('.mosaic-tile', { scale: 0.65, duration: 1.2, stagger: 0.015 }, 2.6)
      .to('.mosaic-tile', {
        y: function (_, el) { return (Number(el.dataset.y) > 50 ? 1 : -1) * window.innerHeight * 0.8; },
        opacity: 0, duration: 1.05, stagger: 0.025
      }, 3.65)
      .to('.manifesto', { autoAlpha: 0, y: -20, duration: 0.5 }, 4.0)
      .to('.storm-line', { autoAlpha: 1, duration: 0.5 }, 4.25)
      .to('.storm-line, .center-mark', { autoAlpha: 0, duration: 0.5 }, 4.85)
      .to('.red-field', { clipPath: 'circle(0% at 50% 25%)', duration: 1 }, 5.1)
      .fromTo('.portrait-scene', { y: '55vh' }, { y: 0, autoAlpha: 1, duration: 1 }, 5.1)
      .fromTo('.frame-outline', { y: -70 }, { y: -24, duration: 1 }, 5.8)
      .to('.portrait-mask', { yPercent: -101, duration: 0.85 }, 6.65)
      .fromTo('.portrait-words span', { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.22, duration: 0.65 }, 7.0)
      .to('.portrait-first', { opacity: 0, duration: 0.55 }, 8.0)
      .to('.portrait-words', { y: -20, duration: 0.8 }, 8.0)
      .to({}, { duration: 0.35 }, 8.65);

    var header = document.getElementById('siteHeader');
    var journey = document.getElementById('home');
    var wide = document.getElementById('story');
    var ending = document.getElementById('end');
    var about = document.getElementById('about');
    var closing = document.getElementById('thanks');
    function updateHeader() {
      var y = window.scrollY;
      var phase = y / Math.max(1, journey.offsetHeight - window.innerHeight) * 9;
      var dark = (phase >= 1.0 && phase < 2.6) || phase >= 5.7;
      if (y >= about.offsetTop - 75 && y < wide.offsetTop - 75) dark = false;   // hall addition
      if (y >= wide.offsetTop - 75) dark = false;
      if (y >= ending.offsetTop - 75 && y < closing.offsetTop - 75) dark = true; // hall addition
      header.style.color = dark ? '#11100f' : '#eeeae4';
      header.dataset.tone = dark ? 'dark' : 'light';
    }
    if (journey && about && wide && ending && closing) {   // secondary pages have no journey to read
      ScrollTrigger.create({ trigger: main, start: 'top top', end: 'bottom bottom', onUpdate: updateHeader, onRefresh: updateHeader });
      updateHeader();
    }

    gsap.fromTo('.wide-media', { clipPath: 'inset(35% 0 0 0)', scale: 0.94 }, { clipPath: 'inset(0% 0 0 0)', scale: 1, ease: 'none', scrollTrigger: { trigger: '.wide-scene', start: 'top bottom', end: 'top top', scrub: 0.5 } });
    gsap.fromTo('.wide-copy', { y: 60, opacity: 0 }, { y: 0, opacity: 1, scrollTrigger: { trigger: '.wide-scene', start: 'top 45%', end: 'top top', scrub: 0.5 } });
    gsap.fromTo('.wide-media', { y: 0 }, { y: 80, ease: 'none', scrollTrigger: { trigger: '.wide-scene', start: 'top top', end: 'bottom top', scrub: true } });

    var world = gsap.timeline({ scrollTrigger: { trigger: '.world', start: 'top top', end: 'bottom bottom', scrub: 0.65 } });
    world.to('.world-copy', { opacity: 0, y: -70, duration: 0.5 }, 0.5)
      .to('.world-tile', {
        left: '50%', top: function (_, el) { return (22 + Number(el.dataset.index) * 12) + '%'; },
        width: mobile ? '68%' : '40%', xPercent: -50, rotation: 0, rotationY: 0,
        duration: 1.5, stagger: 0.08, ease: 'power2.inOut'
      }, 0.15)
      .to('.world-tile', { y: 90, opacity: 0, duration: 0.65, stagger: 0.05 }, 1.7);

    gsap.utils.toArray('.film-chapter').forEach(function (section) {
      gsap.fromTo(section.querySelector('.film-image'), { scale: 0.88, y: 50 }, { scale: 1, y: 0, ease: 'none', scrollTrigger: { trigger: section, start: 'top 90%', end: 'top 25%', scrub: 0.6 } });
      gsap.fromTo(section.querySelector('.chapter-title'), { y: 65 }, { y: -30, ease: 'none', scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 0.6 } });
    });

    gsap.fromTo('.end-car-card', { clipPath: 'inset(18% 8% 18% 8%)', y: 75 }, { clipPath: 'inset(0% 0% 0% 0%)', y: 0, ease: 'none', scrollTrigger: { trigger: '.end-car-card', start: 'top 95%', end: 'top 35%', scrub: 0.6 } });
    gsap.fromTo('.end-mark', { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.end-card', start: 'top 65%' } });
    }   // end of the index page's journey timeline

    gsap.to('.progress-line', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: main, start: 'top top', end: 'bottom bottom', scrub: true } });

    /* ---- hall additions: same reveal vocabulary (fromTo + scrub, power2) ---- */
    var hallCopy = ['.hall-lead>.eyebrow', '.hall-lead>.hall-title', '.hall-lead>.hall-note', '.hall-clip'];
    hallCopy.forEach(function (sel) {
      gsap.utils.toArray(sel).forEach(function (el) {
        var section = el.closest('section');
        gsap.fromTo(el, { y: 46, opacity: 0 }, {
          y: 0, opacity: 1, ease: 'none',
          scrollTrigger: { trigger: section, start: 'top 82%', end: 'top 34%', scrub: 0.6 }
        });
      });
    });
    gsap.utils.toArray('.hall-blocks').forEach(function (host) {
      gsap.fromTo(host.children, { y: 58, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.7, stagger: 0.09, ease: 'power2.out',
        scrollTrigger: { trigger: host, start: 'top 80%' }
      });
    });
    gsap.utils.toArray('.hall-tiles figure, .hall-facts>li, .counter-notes li').forEach(function (el) {
      gsap.fromTo(el, { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 92%', end: 'top 70%', scrub: 0.6 }
      });
    });
    gsap.utils.toArray('.schedule>div').forEach(function (col, i) {
      gsap.fromTo(col, { y: 62, opacity: 0 }, {
        y: 0, opacity: 1, ease: 'none', delay: 0,
        scrollTrigger: { trigger: '.schedule', start: 'top ' + (92 - i * 2) + '%', end: 'top ' + (60 - i * 2) + '%', scrub: 0.6 }
      });
    });
    gsap.utils.toArray('.faq details').forEach(function (el, i) {
      gsap.fromTo(el, { y: 34, opacity: 0 }, {
        y: 0, opacity: 1, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 94%', end: 'top 76%', scrub: 0.6 }
      });
    });
    gsap.utils.toArray('.hall-title').forEach(function (title) {
      gsap.fromTo(title, { y: 60 }, { y: -30, ease: 'none', scrollTrigger: { trigger: title.closest('section'), start: 'top bottom', end: 'bottom top', scrub: 0.6 } });
    });
    gsap.utils.toArray('.hall-clip').forEach(function (clip) {
      gsap.fromTo(clip, { y: 0 }, { y: 70, ease: 'none', scrollTrigger: { trigger: clip, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    gsap.fromTo('.closing .end-mark', { y: 70, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.closing', start: 'top 68%' } });
    gsap.fromTo('.closing-nav button, .closing-nav a', { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: 'power2.out', scrollTrigger: { trigger: '.closing-nav', start: 'top 86%' } });
  }, main);

  window.addEventListener('load', function () { ScrollTrigger.refresh(); media.forEach(function (m) { m.sizeVideo(); }); });

  /* =======================================================================
     55-second guided showcase + optional recorder
     (source: components/showcase-controller.tsx)
     ======================================================================= */
  var DURATION = 55;
  if (new URLSearchParams(window.location.search).get('showcase') === '1' && document.getElementById('home')) {
    state.showcase = true;
    document.documentElement.classList.add('showcase-mode');
    var link = document.querySelector('.playback-control > a');
    if (link) link.remove();            // source: {!showcase && <a href="?showcase=1">}
    showcase();
  }

  function showcase() {
    var root = document.getElementById('showcaseRoot');
    var status = 'loading', message = '', frame = 0, startTimer = null;
    var recorder = null, stream = null, objectUrl = null, download = null, run = 0;
    var controls;

    function cueTimeline() {
      var h = window.innerHeight;
      function top(selector) { return document.querySelector(selector).getBoundingClientRect().top + window.scrollY; }
      var journey = document.getElementById('home');
      var worldEl = document.getElementById('world');
      var journeySpan = journey.offsetHeight - h;
      var max = document.documentElement.scrollHeight - h;
      var chapterEls = Array.prototype.slice.call(document.querySelectorAll('.film-chapter'));
      var cues = [
        { time: 0, y: 0 }, { time: 3, y: 0 }, { time: 7, y: journeySpan * 0.045 },
        { time: 11, y: journeySpan * 0.24 }, { time: 16, y: journeySpan * 0.40 },
        { time: 19, y: journeySpan * 0.57 }, { time: 22, y: journeySpan * 0.74 },
        { time: 25, y: journeySpan }, { time: 27, y: top('.wide-scene') },
        { time: 31, y: top('.wide-scene') + h * 0.3 },
        { time: 35, y: worldEl.offsetTop + worldEl.offsetHeight - h }
      ].concat(chapterEls.map(function (el, i) {
        return { time: 37 + i * 4, y: el.getBoundingClientRect().top + window.scrollY - 75 };
      })).concat([
        { time: 49, y: top('.end-card') },
        { time: DURATION, y: max }
      ]);
      var previous = 0;
      return cues.map(function (cue, i) {
        var y = Math.max(previous, Math.min(max, cue.y));
        previous = y;
        return { time: cue.time, y: y };
      });
    }

    // Monotone cubic interpolation keeps velocity continuous across section boundaries.
    function position(cues, t) {
      var slopes = cues.slice(1).map(function (cue, i) { return (cue.y - cues[i].y) / (cue.time - cues[i].time); });
      var tangents = cues.map(function (_, i) {
        if (!i || i === cues.length - 1) return 0;
        var a = slopes[i - 1], b = slopes[i];
        return a > 0 && b > 0 ? 2 * a * b / (a + b) : 0;
      });
      var found = cues.findIndex(function (cue) { return cue.time >= t; });
      var i = Math.max(0, found - 1);
      var a = cues[i], b = cues[i + 1], dt = b.time - a.time;
      var u = Math.min(1, Math.max(0, (t - a.time) / dt));
      return (2 * u ** 3 - 3 * u * u + 1) * a.y + (u ** 3 - 2 * u * u + u) * dt * tangents[i] +
        (-2 * u ** 3 + 3 * u * u) * b.y + (u ** 3 - u * u) * dt * tangents[i];
    }

    function stop() {
      if (startTimer) clearTimeout(startTimer);
      cancelAnimationFrame(frame);
      if (recorder && recorder.state === 'recording') recorder.stop();
      else if (stream) stream.getTracks().forEach(function (track) { track.stop(); });
      status = 'stopped';
      paint();
    }

    function begin() {
      if (startTimer) clearTimeout(startTimer);
      message = '';
      window.scrollTo({ top: 0, behavior: 'instant' });
      ScrollTrigger.refresh();
      window.dispatchEvent(new CustomEvent('og-showcase-play'));
      run++;
      status = 'running';
      paint();
      if (recorder && recorder.state === 'inactive' && stream && stream.active) recorder.start(1000);
      var cues = cueTimeline(), started = performance.now();
      cancelAnimationFrame(frame);
      (function tick(now) {
        var seconds = Math.min(DURATION, (now - started) / 1000);
        window.scrollTo({ top: position(cues, seconds), behavior: 'instant' });
        if (seconds < DURATION) frame = requestAnimationFrame(tick);
        else {
          if (recorder && recorder.state === 'recording') recorder.stop();
          status = 'done';
          paint();
        }
      })(performance.now());
    }

    function play() {
      if (startTimer) clearTimeout(startTimer);
      cancelAnimationFrame(frame);
      status = 'loading';
      message = '';
      window.scrollTo({ top: 0, behavior: 'instant' });
      window.dispatchEvent(new CustomEvent('og-showcase-play'));
      var requested = performance.now();
      (function prepare() {
        var opening = document.querySelector('.cinema-media[data-priority="true"]');
        if (opening && opening.dataset.playing === 'true') { begin(); return; }
        if (performance.now() - requested >= 15000 || (opening && opening.dataset.mediaState === 'unavailable')) {
          if (stream) stream.getTracks().forEach(function (track) { track.stop(); });
          recorder = null;
          status = 'stopped';
          message = "The opening film hasn't loaded. Retry playback or explore the website while it connects.";
          paint();
          return;
        }
        startTimer = setTimeout(prepare, 250);
      })();
    }

    function record() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia || typeof MediaRecorder === 'undefined') {
        message = 'Recording is available in desktop Chrome or Edge. The showcase still plays here.';
        paint();
        return;
      }
      stop();
      navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: { ideal: 60 }, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false, preferCurrentTab: true, selfBrowserSurface: 'include'
      }).then(function (capture) {
        message = '';
        stream = capture;
        var mime = ['video/mp4;codecs=avc1.42E01E', 'video/webm;codecs=vp9', 'video/webm;codecs=vp8']
          .filter(function (type) { return MediaRecorder.isTypeSupported(type); })[0];
        var options = { videoBitsPerSecond: 16000000 };
        if (mime) options.mimeType = mime;
        var recording = new MediaRecorder(capture, options);
        recorder = recording;
        var chunks = [];
        recording.ondataavailable = function (event) { if (event.data.size) chunks.push(event.data); };
        recording.onstop = function () {
          var type = recording.mimeType;
          capture.getTracks().forEach(function (track) { track.stop(); });
          if (objectUrl) URL.revokeObjectURL(objectUrl);
          objectUrl = URL.createObjectURL(new Blob(chunks, { type: type }));
          download = { url: objectUrl, name: 'Arush-Cineplex-55-Second-Showcase.' + (type.indexOf('mp4') > -1 ? 'mp4' : 'webm') };
          paint();
        };
        capture.getVideoTracks()[0].addEventListener('ended', stop, { once: true });
        play();
      }).catch(function (error) {
        message = error instanceof DOMException && error.name === 'NotAllowedError'
          ? 'Recording cancelled. You can replay the showcase whenever you like.'
          : 'This browser could not start recording. You can still replay the showcase.';
        paint();
      });
    }

    function paint() {
      if (controls) controls.remove();
      var introEl = document.querySelector('.showcase-intro');
      if (introEl) introEl.remove();
      if (status === 'running') {
        var veil = document.createElement('div');
        veil.className = 'showcase-intro';
        veil.setAttribute('aria-hidden', 'true');
        veil.innerHTML = '<span class="wordmark" role="img" aria-label="Arush Cineplex">AC</span>';
        root.appendChild(veil);
      }
      controls = document.createElement('div');
      controls.className = 'showcase-controls' + (status === 'running' ? ' is-running' : '');
      controls.setAttribute('role', 'region');
      controls.setAttribute('aria-label', '55-second showcase controls');
      controls.dataset.duration = DURATION;
      var html = '';
      if (status === 'loading') html = '<span>PREPARING THE FILMS…</span><button type="button" data-act="record">RECORD 55-SECOND VIDEO</button>';
      else if (status === 'running') html = '<button type="button" data-act="stop">STOP SHOWCASE</button>';
      else {
        html = '<button type="button" data-act="play">REPLAY 55 SECONDS</button><button type="button" data-act="record">RECORD 55-SECOND VIDEO</button>';
        if (download) html += '<a href="' + download.url + '" download="' + download.name + '">DOWNLOAD VIDEO</a>';
        html += '<a href="' + window.location.pathname + '">EXPLORE THE WEBSITE</a>';
      }
      if (message) html += '<p role="status">' + message + '</p>';
      controls.innerHTML = html;
      root.appendChild(controls);
      controls.addEventListener('click', function (e) {
        var act = e.target.closest('[data-act]');
        if (!act) return;
        if (act.dataset.act === 'play') play();
        else if (act.dataset.act === 'record') record();
        else stop();
      });
    }

    paint();
    play();
    window.addEventListener('keydown', function (e) { if (e.key === 'Escape') stop(); });
    ['wheel', 'touchstart'].forEach(function (evt) {
      window.addEventListener(evt, stop, { passive: true });
    });
  }
})();
