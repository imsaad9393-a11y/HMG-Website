// =====================================================
// HMG website scripts. Plain JavaScript, no libraries.
// Part 1 runs on every page. Part 2 only runs on the Services page.
// =====================================================

// ---------- PART 1: phone menu ----------
var menuButton = document.querySelector('.menu-btn');
var menu = document.getElementById('nav');

if (menuButton && menu) {
  // Clicking "Menu" shows or hides the links on phones
  menuButton.addEventListener('click', function () {
    var isOpen = menu.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', isOpen); // tells screen readers the state
  });

  // Pressing Escape closes the menu and returns focus to the button
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && menu.classList.contains('open')) {
      menu.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.focus();
    }
  });
}

// ---------- PART 2: services search and filter ----------
var searchBox = document.getElementById('q');

if (searchBox) {
  var services = document.querySelectorAll('.svc');        // every service row
  var groups = document.querySelectorAll('.grp');          // every group section
  var filterButtons = document.querySelectorAll('.chips button');
  var countText = document.getElementById('count');        // "14 services shown"
  var noResults = document.getElementById('none');         // "No service matches"
  var activeGroup = 'all';                                 // which filter button is chosen

  // Show only the services that match the chosen group AND the search text
  function updateList() {
    var text = searchBox.value.trim().toLowerCase();
    var shown = 0;

    services.forEach(function (row) {
      var inGroup = activeGroup === 'all' || row.dataset.g === activeGroup;
      var matches = text === '' || row.dataset.t.indexOf(text) > -1;
      row.hidden = !(inGroup && matches);
      if (!row.hidden) shown++;
    });

    // Hide a whole group heading when none of its services are shown
    groups.forEach(function (group) {
      group.hidden = !group.querySelector('.svc:not([hidden])');
    });

    noResults.hidden = shown > 0;
    countText.textContent = shown + (shown === 1 ? ' service shown' : ' services shown');
  }

  // Typing in the search box updates the list
  searchBox.addEventListener('input', updateList);

  // Clicking a filter button chooses that group
  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      activeGroup = button.dataset.g;
      filterButtons.forEach(function (b) {
        b.setAttribute('aria-pressed', b === button); // highlights the chosen button
      });
      updateList();
    });
  });

  updateList(); // run once so the count shows when the page opens
}

// ---------- PART 3: scroll effects (header, page progress bar, hero animation, reveal) ----------
var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches; // visitor asked for less motion
var pageHeader = document.getElementById('top');
var hero = document.querySelector('.hero');
var counter = document.querySelector('.count');   // the "01 / 05" text

// Optional hero video: if assets/video/hero.mp4 exists, scrolling plays it like a film
var heroVideo = document.querySelector('.hero-video');
var videoTarget = 0;       // the moment of the film we want to show
var videoEasing = false;

// Moves the film a fifth of the way towards the wanted moment on every screen refresh, so it feels smooth
function easeVideo() {
  try {
    var gap = videoTarget - heroVideo.currentTime;
    if (!(Math.abs(gap) >= 0.03)) { videoEasing = false; return; }   // close enough: stop
    heroVideo.currentTime += gap * 0.2;
  } catch (error) {
    videoEasing = false;     // if the browser refuses once, do not get stuck: the next scroll starts again
    return;
  }
  requestAnimationFrame(easeVideo);
}

// p is 0 at the top of the hero and 1 at the end
function scrubVideo(p) {
  if (!hero.classList.contains('has-video') || !heroVideo.duration) return;
  videoTarget = p * heroVideo.duration;
  if (!videoEasing) { videoEasing = true; requestAnimationFrame(easeVideo); }
}

// Loads the whole film into memory first. Then jumping to any moment works instantly, even on simple
// preview servers (like the VS Code preview) that cannot send a file in pieces
function loadVideo(urls) {
  fetch(urls[0])
    .then(function (response) {
      if (!response.ok) throw new Error('not found');
      return response.blob();
    })
    .then(function (blob) { heroVideo.src = URL.createObjectURL(blob); })
    .catch(function () {
      if (urls.length > 1) loadVideo(urls.slice(1));                          // no phone file: try the main one
      else if (location.protocol === 'file:') heroVideo.src = urls[0];        // opened from a folder: use the file directly
    });
}

if (heroVideo && !reduceMotion) {
  heroVideo.addEventListener('loadeddata', function () {
    hero.classList.add('has-video');                  // the film is ready: fade it in
    var start = heroVideo.play();                      // a quick play and pause lets phones show the pictures
    if (start) start.then(function () { heroVideo.pause(); }).catch(function () {});
  });
  loadVideo(window.innerWidth <= 760 ? ['assets/video/hero-mobile.mp4', 'assets/video/hero.mp4'] : ['assets/video/hero.mp4']);
}

// Keeps a number between 0 and 1
function clamp01(n) {
  return Math.min(1, Math.max(0, n));
}

function onScroll() {
  var y = window.scrollY;

  // Header: becomes smaller with a shadow after a small scroll
  pageHeader.classList.toggle('scrolled', y > 30);

  // Page progress bar: 0 at the top of the page, 1 at the bottom
  var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  pageHeader.style.setProperty('--sp', maxScroll > 0 ? clamp01(y / maxScroll).toFixed(3) : 0);

  // Hero: p goes from 0 to 1 while the tall hero scrolls past. The CSS turns p into the chapters and the lab drawing
  if (hero && !reduceMotion) {
    var box = hero.getBoundingClientRect();
    var p = clamp01(-box.top / (box.height - window.innerHeight));
    hero.style.setProperty('--p', p.toFixed(3));
    scrubVideo(p);
    var chapter = Math.min(4, Math.round(p * 4));        // which of the 5 chapters is on screen
    if (hero.dataset.ch !== String(chapter)) {
      hero.dataset.ch = chapter;                         // lets the CSS switch on the buttons of that chapter
      counter.textContent = '0' + (chapter + 1) + ' / 05';
    }
  }
}

// Run onScroll at most once per screen refresh, so scrolling stays smooth
var waiting = false;
window.addEventListener('scroll', function () {
  if (!waiting) {
    waiting = true;
    requestAnimationFrame(function () { onScroll(); waiting = false; });
  }
}, { passive: true });
window.addEventListener('resize', onScroll);
onScroll(); // set the starting state

// Reveal: tiles, service rows, headings and footer columns fade up when they come into view
if (!reduceMotion && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('js-reveal');
  var seen = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in'); // starts the rise animation in the CSS
        seen.unobserve(entry.target);     // only animate once
      }
    });
  }, { threshold: 0.15 });

  var items = document.querySelectorAll('.tile, .svc, .svcpage, .fact, .member, .grp h2, .split > div, .steps li, .band .wrap > *, .foot-grid > *, .foot-bottom');
  items.forEach(function (item, i) {
    item.classList.add('reveal');
    item.style.setProperty('--d', (i % 4) * 90 + 'ms'); // small stagger between neighbours
    seen.observe(item);
  });
}
