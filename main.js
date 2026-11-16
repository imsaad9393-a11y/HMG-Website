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

  // Hero: --p goes from 0 to 1 while the tall hero scrolls past. The CSS turns --p into the 4 lab stages
  if (hero && !reduceMotion) {
    var box = hero.getBoundingClientRect();
    hero.style.setProperty('--p', clamp01(-box.top / (box.height - window.innerHeight)).toFixed(3));
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

  var items = document.querySelectorAll('.tile, .svc, .svcpage, .fact, .grp h2, .split > div, .steps li, .band .wrap > *, .foot-grid > *, .foot-bottom');
  items.forEach(function (item, i) {
    item.classList.add('reveal');
    item.style.setProperty('--d', (i % 4) * 90 + 'ms'); // small stagger between neighbours
    seen.observe(item);
  });
}