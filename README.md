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
- Phase 2: genetic-counselling.html, genetic-testing.html, laboratory-diagnostics.html (general wording, pending clinical review).
- Phase 3 (part 1): privacy.html, 404.html, SEO tags, sitemap.xml. Logo reduced to 600px wide. Privacy wording is a draft needing review.
- Team page: team.html (4 dummy profiles + M. Saad). Add assets/images/saad.jpg. Remove noindex and add to sitemap.xml when real.
- Added opening hours, social links, FAQ (home), og-image.png. The supplied SVG logo is a wrapped picture, not a true vector, so the PNG logo is kept.
- Appointment buttons (WhatsApp) replace Call/WhatsApp buttons. Top bar with phone + social icons. Hero plays assets/video/hero.mp4 on scroll if the file exists.
- Hero: old drawing removed, film loads into memory (fixes stuck scrolling). Top bar green. Footer: 5 services, contact list with icons, social icons.
