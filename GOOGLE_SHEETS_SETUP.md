# EJM registration: update Google Sheets safely

This revision makes every applicant field mandatory except Question.
The sheet columns remain on schema 2; required-field rules are validation version 3.
Deploy the updated frontend and matching backend together.

## Existing website / existing Sheet

1. Back up your Google Sheet before changing the script.
2. Open the applicant Sheet, then **Extensions > Apps Script**.
3. Replace the backend code with `google-apps-script.gs` from this folder and save.
4. Select **setup** in the editor's function dropdown and run it once. Approve the
   Google authorization request using the Sheet owner's account.
5. `setup()` stores the target Sheet's ID in private Script Properties. It creates
   `Sign Ups` when absent and appends missing headers. It does not delete old rows.
6. Open **Deploy > Manage deployments**, edit your existing web-app deployment,
   select a **New version**, and deploy. Editing the existing deployment preserves
   its URL. Confirm **Execute as: Me** and public **Anyone** access where your
   account's administrator permits it.
7. Open `signup.html` and replace the endpoint placeholder with your deployed URL
   ending in `/exec`. Keep your existing real URL when updating the same deployment.
8. Upload the updated website files. Do not publish the applicant Sheet itself.
9. Submit a clearly labelled test application and verify every column in the Sheet.

The uploaded ZIP contains the placeholder below, not a configured live endpoint:

```html
<form id="signup-form"
      data-endpoint="PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE"
      novalidate>
```

Use the deployed URL, not a `/dev` test URL:

```html
<form id="signup-form"
      data-endpoint="https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"
      novalidate>
```

## New Sheet / first deployment

Create a private Google Sheet in the account that will own the applicant database.
Open its Apps Script editor, paste `google-apps-script.gs`, and run `setup()`.
Then use **Deploy > New deployment > Web app**, execute as the owner, and allow
anonymous submissions with **Anyone** access when permitted. Paste the `/exec`
URL into `signup.html` as above.

Creating a new deployment changes the deployment URL. Editing the version of an
existing deployment is the update route when you need to keep the same URL.

## Columns and existing records

For a sheet with the original A:J layout, the columns become:

| Column | Header |
| --- | --- |
| A | Submitted At |
| B | Nama / Name |
| C | Tempat Lahir / Birthplace |
| D | Tanggal Lahir / Birthday |
| E | Umur / Age |
| F | Jenis Kelamin / Gender |
| G | WhatsApp No |
| H | Alamat / Address |
| I | Pertanyaan / Question |
| J | Source |
| K | Pengalaman Kerja Sebelumnya / Previous Work Experience |
| L | Bidang Pekerjaan yang Diminati / Preferred Field of Work |
| M | Submission ID |

Existing A:J records are not moved or rewritten. Older records remain blank in
new columns. If the sheet already contains extra staff-maintained columns, new
headers go after those columns; the backend matches values by header name rather
than assuming K/L/M. Do not rename the form-managed headers casually. A populated
sheet with unrecognized or duplicate headers is rejected instead of overwritten.

Submission ID is an internal reference generated in the browser. It is not an
extra applicant question. The backend uses it to recognize a retry of the same
request. It is not an authentication mechanism and does not expose applicant data.

## Required and optional fields

All nine applicant fields other than Question are required, including previous
work experience and preferred field of work. Age is recomputed on the server from birthday;
a supplied browser age is not trusted. Date boundaries use Asia/Jakarta on the
server. No new minimum-age or eligibility rule has been introduced.

Only Question is optional. Previous work experience and preferred field of work
cannot be blank or whitespace-only. Applicants without experience may enter
"Belum ada pengalaman". Both fields retain their length limits. No document
upload or additional personal-data field has been added.

## Confirmation and errors

A completed network request alone cannot establish that a row was saved.
The frontend uses a form-encoded POST, follows redirects, and checks a
readable JSON response with `success: true`, `schemaVersion: 2`, `validationVersion: 3`, and the matching
submission ID before clearing the form or showing success.

If access settings, a login redirect, CORS restrictions, a timeout, or an outdated
backend prevent confirmation, the form retains the entries and shows an error.
A lost response may occur after a save: check the Sheet and Apps Script executions
before repeating the application. Retrying unchanged fields in the same loaded
page keeps the same submission ID. Reloading the page generates a new ID.

Do not restore `no-cors` just to hide an error; that would remove save confirmation.
The runtime integration still needs a live test in your deployed environment.

## Live test checklist

- Fill all nine required fields, leave Question empty, and verify the saved values.
- Leave work experience or preferred field of work blank; confirm submission is rejected.
- Leave a required field blank; the frontend should stop before posting.
- Verify age near a birthday, WhatsApp leading zeroes, and question text.
- Open the deployed /exec URL: the health response must show schemaVersion 2 and validationVersion 3.
- An earlier validation version is not sufficient for this frontend.
- Check that an existing application row is unchanged after the upgrade.
- Verify the form from the actual GitHub Pages/custom-domain site, not only local.
- Remove your labelled test records after verification.

No actual Google Sheet writes were performed during development of this revision.

## Privacy and operational notes

The Sheet and its applicant data should remain private. No Sheet-reading endpoint,
Google account credentials, or private API token is exposed in the frontend. The
web app endpoint is public so visitors can submit. A honeypot is only basic bot
filtering, not comprehensive abuse protection. Review who can access the Sheet,
retention, consent wording, and abuse controls before accepting real applications.
No applicant data is saved into localStorage or embedded in a page URL.

## Official technical references

Bound script limitations (active-container methods are not available as web apps):
`https://developers.google.com/apps-script/guides/bound`

Versioned deployment updates:
`https://developers.google.com/apps-script/concepts/deployments`

Web app request parameters and access model:
`https://developers.google.com/apps-script/guides/web`

Content Service JSON responses and redirects:
`https://developers.google.com/apps-script/guides/content`

Fetch and opaque no-cors responses:
`https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch`
