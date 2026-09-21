# QA report - 21 September 2026 revision

## Basis and method

Base: Website.zip supplied with the five latest revision requests.
Assets: six exact SVG files from vector industries logo.zip and the supplied
additional JPEG. No original base image assets were changed.

Testing used Chromium with an offline harness that inlines the shipped HTML,
CSS, JavaScript and exact image bytes into a test page. This was necessary because
the browser environment blocks localhost navigation. Output website files keep
normal relative file references; the test harness is not part of the website.
Google Maps was replaced by a placeholder only in the test harness, not in the
shipped HTML. No live Google Sheet submissions were performed.

## Results

- 104 static-asset and browser assertions passed.
- 19 Apps Script validation/storage assertions passed in a Node VM with mocked services.
- 18 final targeted regression assertions passed, including emulated touch and regular smooth motion.
- No JavaScript runtime errors were recorded in the browser checks.

## Verified

Gallery:
- Nine original photos are linked; the additional photograph is byte-for-byte intact.
- All card aspect ratios match the original photo ratios at desktop/mobile widths.
- No forced landscape side panels; no stretched photos.
- Previous/next scroll buttons, mouse dragging, keyboard Home/End and arrow navigation.
- Mouse dragging does not accidentally open the viewer.
- Photo selection, viewer count, next/previous wrapping, Escape and close button.
- Backdrop close, keyboard focus cycling and return to the original photo link.
- Viewer fits 320px, 390px and 768px viewports; regular 1440px desktop checked.
- Emulated one-finger swipe advances the viewer.
- Viewer stays hidden without JavaScript; fallback links point to existing original images.

Assets and layout:
- All six provided SVG files match their uploaded bytes and display in the correct sectors.
- All 18 original image assets from Website.zip are unchanged.
- Home/signup layouts have no horizontal page overflow at 320px, 390px, 768px and desktop.
- ICO includes 16/32/48px images; PNG and Apple icon references exist on both pages.
- Relative favicon paths resolve under a domain root and a project subdirectory.
- Scrollspy highlights Gallery and the mobile menu closes after navigation.
- Navigation/clean-URL implementation is unchanged from the supplied base.

Form and backend:
- Exactly nine applicant fields have required attributes; Question remains optional.
- Empty form flags all nine required fields.
- Work experience and preferred field reject blank/whitespace-only responses.
- Age remains calculated and read-only; the backend calculates the stored age itself.
- A blank optional Question is accepted by the mocked confirmed-success path.
- Both new required fields are included in the submission payload.
- Unconfigured or outdated endpoints do not show a false success.
- Entries remain intact when confirmation fails.
- Server mocks checked required fields, valid dates, phone text formatting,
  formula escaping, retry deduplication and preservation of old rows/staff columns.

## Live checks still required

- Replace the endpoint placeholder in signup.html with the actual /exec URL.
- Deploy the supplied Apps Script backend (schema 2 / validation 3).
- Test one labelled submission from the deployed site and verify the actual Sheet row.
- Check real phone/browser touch behavior and browser favicon caching after publishing.
- Existing external maps/contact destinations were retained, not independently verified.
- No GitHub push, domain change or live backend deployment was performed here.
