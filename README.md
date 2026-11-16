# HMG Diagnostic & Research Center website (Phase 1)

Plain HTML, CSS and JavaScript. No tools or installs needed.

## Files
- index.html     Home page
- services.html  Services page (with search and filter)
- contact.html   Contact page
- assets/css/styles.css   All styling, numbered sections with comments
- assets/js/main.js       Phone menu and services filter
- assets/images/          Logo and favicon

## How to preview
Double-click index.html, or run `python -m http.server` in this folder.

## How to edit
Each section in the HTML starts with a comment such as <!-- HERO: ... -->. Edit the text directly.
- Phone number: search for 923340008729 and +92 334 0008729 in all three HTML files.
- Colours: change the values under "1. DESIGN TOKENS" in styles.css.
- Header and footer are repeated in every HTML file. Change them in all three.

## Status
Service descriptions are general and pending clinical review. Logo is cut from a JPEG (a vector file would be sharper).
No enquiry form (needs a secure backend). System fonts, light theme only. Not yet tested in a browser.
Not yet included: photos, opening hours, sitemap and canonical tags, Phase 2-3 pages.
- Scroll animation: the hero lab scene is driven by --p in main.js (Part 3) and the stage rules in styles.css.
