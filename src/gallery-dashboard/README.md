# Gallery Dashboard: one-time setup

The Gallery Dashboard is a small private web page where school staff upload photos to the website's Gallery without touching code. It runs free on Google Apps Script and stores the photos in your Google Drive.

You only do this setup once. It takes about 10 minutes.

## 1. Create the project

1. Sign in to the Google account that should own the photos, then open https://script.google.com.
2. Click **New project**.
3. Click **Untitled project** at the top and rename it **Fr. Agnel HSS Gallery Dashboard**.

## 2. Paste the code

1. In the editor you'll see a file called `Code.gs`. Delete everything in it, then paste in the full contents of [`Code.gs`](Code.gs) from this folder.
2. Click the **+** next to **Files**, choose **HTML**, and name it exactly `Dashboard` (Google adds `.html`).
3. Delete everything in that new file and paste in the full contents of [`Dashboard.html`](Dashboard.html).
4. Click the **Save** icon.

## 3. Choose the PIN

1. Click the **gear icon** (Project Settings) on the left.
2. Scroll to **Script properties**, then click **Add script property**.
3. Property: `UPLOAD_PIN`. Value: the PIN staff will type, for example 6 digits. Don't use a password you use anywhere else.
4. Click **Save script properties**.

## 4. Create the folder and sheet, and allow access

1. Go back to the editor (the `<>` icon on the left).
2. In the function menu at the top, choose **setup**, then click **Run**.
3. Google asks for permission. Click **Review permissions** and choose your account.
4. Google shows **"Google hasn't verified this app"**. This is normal for your own private script. Click **Advanced**, then **Go to Fr. Agnel HSS Gallery Dashboard (unsafe)**, then **Allow**.
5. This creates a Drive folder called **Fr. Agnel HSS website gallery photos** and a sheet called **Fr. Agnel HSS website gallery list**.

## 5. Publish the dashboard

1. Click **Deploy** (top right), then **New deployment**.
2. Click the gear next to **Select type** and choose **Web app**.
3. Description: `Gallery dashboard`.
4. **Execute as: Me**.
5. **Who has access: Anyone**. The PIN protects uploads; the website needs this to read the photo list.
6. Click **Deploy** and copy the **Web app URL**. It ends in `/exec`.

## 6. Connect it to the website

Send the Web app URL to whoever maintains the website code. It goes in `GALLERY_API` at the top of `assets/js/gallery-uploads.js`.

Bookmark the same URL on the phones or computers of the staff who will upload photos. That link is the dashboard.

## Good to know

- **Photos are public.** Every uploaded photo is viewable by anyone with its link, because the website has to show it. Only upload photos that are fine to be on the website.
- **Changing the PIN:** edit `UPLOAD_PIN` in Script properties. No redeploy is needed.
- **Changing the code later:** paste the new code, then **Deploy > Manage deployments**, edit the existing deployment and choose **New version**. That keeps the same URL.
- **Categories** match the Gallery filter buttons: Learning, Celebrations, Culture and Faith.
- **Hide** takes a photo off the website but keeps it. **Delete** removes it from the website and moves the file to the Drive bin.
