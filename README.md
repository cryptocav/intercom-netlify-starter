# Intercom Netlify Starter (cavpatrol.xyz)

A minimal, deploy-ready static site to test Intercom Messenger.

## Quick Start (Netlify)

1. **Set the App ID**
   - Copy `js/config.sample.js` → `js/config.js`
   - Paste your Intercom **App ID** into `APP_ID`.

2. **Deploy**
   - Drag & drop this folder into Netlify: https://app.netlify.com → *Add new site* → *Deploy manually*.
   - You’ll get a live URL like `https://intercom-test-site.netlify.app`.

3. **(Optional) Map your subdomain**
   - In Netlify **Domain settings**, add a custom domain: `testing.cavpatrol.xyz`.
   - In your DNS, create a CNAME record for `testing` → target the Netlify site domain.

4. **Test**
   - Open the site → click **Load Anonymous** or **Load Identified**.
   - The Intercom bubble should appear (bottom-right).

## Identity Verification (Optional)

For basic tests, you *don’t* need `user_hash`. If you want secure mode:
- Create a tiny server endpoint that signs `{ user_id }` with your Intercom secret.
- Set `user_hash` in `intercomSettings` before booting.

Docs: https://www.intercom.com/help/en/articles/183-enable-identity-verification-for-web

## Local Preview

Any static server works:
```bash
python3 -m http.server 9000
# then open http://localhost:9000
```

## Files

- `index.html` – simple UI to trigger anonymous/identified boots
- `js/config.js` – your App ID (copied from `config.sample.js`)
- `js/intercom.js` – Intercom loader + controls
- `css/styles.css` – basic styling
- `netlify.toml` – headers/cache
