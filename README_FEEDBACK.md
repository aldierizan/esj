# EJM website - latest client revision

Revision date: 21 September 2026
Base: Website.zip supplied for this request, not an earlier website ZIP.

## Implemented

1. Replaced all six temporary industry icons with the supplied SVG assets.
2. Added the supplied staircase photograph as gallery photo 9.
3. Rebuilt the gallery as a proportional, equal-height horizontal photo strip.
   Each card follows the original image ratio, so portrait photos do not have
   empty landscape side panels. Photos are not stretched or deliberately cropped.
   The strip supports arrows, touch scrolling, keyboard navigation and mouse drag.
4. Clicking a photo opens a full-size viewer with previous/next controls,
   photo counter, arrow keys, Home/End, Escape closing and focus restoration.
   The viewer can also close through its close button or backdrop. Touch swipe
   is implemented; native device/browser checks are still recommended.
5. All nine applicant fields are mandatory; only Question remains optional.
   Previous Work Experience and Preferred Field of Work are required in HTML,
   frontend validation and Apps Script validation. Age remains calculated.
6. Added a logo-based ICO, 16/32/48px PNGs and a 180px Apple touch icon.
   Both index.html and signup.html reference the icons using relative paths.

## Existing content retained

The latest logo, company content, service photos, existing eight gallery photos,
contact links, navy footer and two locations are retained from Website.zip.
Navigation, scrollspy, clean-homepage-URL behavior and the Google Sheets column
layout are retained. The gallery is now in its own gallery.js file.

## Run locally

Open this Website folder in VS Code and use your existing Live Server setup.
Keep index.html, style.css, main.js, gallery.js, signup.html, signup.js,
favicon.ico and assets/ at the same level as provided.

## Publish

Copy the CONTENTS of this Website folder into the existing website publishing
folder in your repository. Do not accidentally create an extra Website/ nesting
level. Preserve any existing domain/CNAME configuration in your live repository.
No CNAME or domain configuration was supplied in the base ZIP.

The ZIP supplied for this revision still uses an endpoint placeholder in
signup.html. Paste your actual /exec URL before publishing the form.
Replace the Apps Script source with google-apps-script.gs and redeploy the existing
web-app deployment to a new version. See GOOGLE_SHEETS_SETUP.md for full steps.
The response is schemaVersion 2 / validationVersion 3. The sheet layout is unchanged.

Do not send real applicant details during preview testing. Use labelled test
records and remove them after confirming the live integration.

This delivery does not change the live GitHub repository or the deployed Apps
Script. Those deployments must be performed separately by the website owner.

## Files changed or added

- index.html, signup.html: new asset references, viewer markup, required labels.
- style.css: proportional gallery, viewer styling, SVG sizing.
- main.js: existing navigation kept; gallery logic moved to gallery.js.
- gallery.js: new photo strip and viewer interactions.
- signup.js, google-apps-script.gs: matching required-field validation.
- assets/industries/*.svg: six exact supplied vectors.
- assets/gallery-9.jpg: exact supplied additional photograph.
- favicon.ico, assets/favicon-*.png, assets/apple-touch-icon.png.
- This README, ASSET_REPLACEMENTS.md, GOOGLE_SHEETS_SETUP.md and QA_REPORT.md.
