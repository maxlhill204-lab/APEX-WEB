# APEX WEB

Next.js website for APEX WEB with a Firestore-backed enquiry form.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

This is a Next.js project, so it will not work by opening `index.html` directly. Use `open-local.html` if you want a simple local reminder page.

## Firebase Setup

The contact form saves enquiries to Cloud Firestore in a collection named `enquiries`.

1. Go to [Firebase Console](https://console.firebase.google.com/) and create or open your project.
2. Open **Build > Firestore Database**.
3. Click **Create database**.
4. Choose **Production mode**.
5. Pick the nearest Firestore location for your audience.
6. Open **Project settings > General**.
7. Under **Your apps**, add a Web app if one does not exist.
8. Copy the Firebase web app config values into a new `.env.local` file using `.env.example` as the template.
9. Restart `npm run dev` after changing `.env.local`.

Example `.env.local`:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

## Firestore Rules

For the enquiry form to work from the public website, allow visitors to create enquiry documents. Start with rules like this, then tighten them further with App Check or a server-side API when the site is live.

```js
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /enquiries/{enquiryId} {
      allow create: if request.resource.data.keys().hasOnly([
        'name',
        'business',
        'email',
        'phone',
        'message',
        'source',
        'createdAt'
      ])
      && request.resource.data.name is string
      && request.resource.data.email is string
      && request.resource.data.message is string
      && request.resource.data.name.size() > 1
      && request.resource.data.email.size() > 5
      && request.resource.data.message.size() > 5;

      allow read, update, delete: if false;
    }
  }
}
```

To view enquiries, open **Firestore Database > Data > enquiries** in Firebase.

## Checks

```bash
npm run lint
npm run build
```
