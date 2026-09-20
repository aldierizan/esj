# Connect the EJM Sign Up Form to Google Sheets

The website is already prepared. You only need to create the Google Sheet and paste the deployed Apps Script URL into `signup.html`.

## 1. Create the Google Sheet

1. Create a new Google Sheet in the Google account that should own the applicant database.
2. You do not need to create columns manually. The script creates a tab named `Sign Ups` and adds the headers automatically on the first submission.

The columns will be:

- Submitted At
- Nama / Name
- Tempat Lahir / Birthplace
- Tanggal Lahir / Birthday
- Umur / Age
- Jenis Kelamin / Gender
- WhatsApp No
- Alamat / Address
- Pertanyaan / Question
- Source

## 2. Add the Apps Script

1. From the Google Sheet, open **Extensions > Apps Script**.
2. Delete the default sample code.
3. Copy everything from `google-apps-script.gs` into the Apps Script editor.
4. Save the project. You can name it `EJM Website Sign Up`.

Important: create the script from inside the Google Sheet. The provided backend uses `SpreadsheetApp.getActiveSpreadsheet()` so it stays connected to that Sheet without storing a Spreadsheet ID in the website.

## 3. Deploy as a Web App

1. In Apps Script, click **Deploy > New deployment**.
2. Select **Web app**.
3. Execute as: **Me**.
4. Who has access: **Anyone**.
5. Click **Deploy** and complete the authorization steps.
6. Copy the Web App URL. It normally ends in `/exec`.

## 4. Connect the website

Open `signup.html` and find:

```html
<form id="signup-form" data-endpoint="PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE" novalidate>
```

Replace only `PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE` with your deployed Web App URL.

Example:

```html
<form id="signup-form" data-endpoint="https://script.google.com/macros/s/EXAMPLE/exec" novalidate>
```

Save the file.

## 5. Test

1. Run the website with VS Code Live Server.
2. Open `signup.html`.
3. Fill fields 1-7 and submit.
4. Open the Google Sheet and check the `Sign Ups` tab.

## Notes

- Fields 1-7 are required on the website.
- The backend validates required fields again before saving.
- `Umur / Age` is calculated automatically from `Tanggal Lahir / Birthday` in both the website and backend.
- `Pertanyaan / Question` is optional.
- A hidden honeypot field is included as basic bot protection.
- User input is escaped before insertion to reduce spreadsheet formula-injection risk.
- The public website does not contain Google account credentials or a Google API key.
