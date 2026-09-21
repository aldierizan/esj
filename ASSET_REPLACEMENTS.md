# Asset status - 21 September 2026 revision

Base: the supplied Website.zip. The supplied logo and service photos are retained.
The old pending-asset list from the earlier PDF revision is no longer current.

## Completed in this delivery

- All six industry icons now use the exact SVG files from vector industries logo.zip.
  Location: assets/industries/. No replacement icons were invented.
- The supplied additional photograph is assets/gallery-9.jpg.
  Its original bytes are preserved. The carousel now contains nine different photos.
- Favicon files are generated from the logo already present in assets/logo.png.
  The original logo file itself is unchanged.
- Existing gallery photos 1-8, hero, About photo, testimonials and service photos
  are retained from the latest supplied base.

## Updating a gallery photo later

Each figure has --photo-ratio matching its original width / height. When replacing
an image, update the image width/height attributes and this ratio. The full-size
link should point to the same original photo. No hardcoded photo count is needed
in JavaScript: gallery.js derives it from the actual links.

The six SVGs are referenced as images, preserving their original blue artwork.
Do not replace them with emoji or inline placeholders.
