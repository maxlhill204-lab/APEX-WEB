# APEXWEB

Custom business website, rebuilt in the existing Next.js Pages Router repository. The original Vercel project, domain, prices, demo assets and Firebase enquiry collection are retained.

## Work locally

Requires Node.js 24 and npm.

- `npm ci`
- `npm run dev`
- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`

Use `.env.example` for local configuration. Production Firebase environment variables already exist in Vercel and are sensitive; Vercel will not export their values. Do not replace them with the `[SENSITIVE]` strings produced by an environment pull.

## Business configuration

Edit `site.config.ts` for contact email, Instagram, website URL, package prices and inclusions, care plans and FAQs. Current prices are copied from the existing repository, not invented: builds $300/$550/$850 AUD and optional care $39/$79/$149 per month. Final scope and price are agreed in a quote.

## Interactive showcase

`ImmersiveShowcase.tsx` coordinates four scroll chapters. `DeviceScene.tsx` dynamically loads a real Three.js laptop and phone model, rendered with rounded geometry, metallic materials and the existing demo website textures. Scroll changes rotation and composition; buttons and mouse dragging allow manual rotation. Pause stops ambient animation. Reduced-motion users and browsers without WebGL see a static website preview. Rendering pauses when the scene is offscreen or the tab is hidden, uses capped pixel density and a maximum of 45 frames per second, and disposes graphics resources on navigation.

## Quote delivery

`/quote?package=business&source=outreach` preselects a package and preserves attribution. `/contact` retains the existing route and runs the same wizard. Five steps cover package, business, requirements/style/timing, contact and review. Back/edit preserve answers. Validation occurs in the browser and again on the server. Failed requests retain all answers. Submission has a synchronous duplicate lock and a deterministic document ID for retries.

`POST /api/quote` validates content type, origin, allowed options, field types and lengths, consent and a honeypot. In-memory IP rate limiting is a best-effort safeguard per server instance; it is not a global distributed quota. For higher traffic, add shared rate limiting or a challenge provider. No user contact details are sent to analytics.

The existing Firebase rules permit a restricted, create-only document schema. The integration deliberately retains the seven existing fields: name, business, email, phone, message, source and createdAt. The complete quote appears as a readable summary and a structured JSON record within `message`. This preserves all the new fields without loosening database access. Enquiries are available in the existing Firebase Console under **Firestore Database → Data → enquiries**. A retry targets the same document ID.

The API reports success only when Firebase has accepted the enquiry or the business notification email has been accepted by the provider. It does not claim an email was sent when email is not configured. No confirmation is sent to a customer unless the business notification was accepted first.

## Email activation — remaining configuration

The server-side Resend integration and both HTML/plain-text email templates are complete. **RESEND_API_KEY is absent from the existing Vercel project.** Set this as a sensitive server environment variable for Production and Preview after creating or connecting a Resend sending account. The default sender is `APEXWEB <enquiries@apexweb.com.au>`; verify the sender domain in Resend first, or set `EMAIL_FROM` to an already verified sender. Redeploy and test delivery to both business and customer inboxes. API acceptance and actual inbox delivery are separate checks. No email delivery is currently certified.

Email requests use Resend idempotency keys, escaped HTML, plain-text alternatives, request timeouts, and Reply-To addresses. Secret API keys never enter client bundles.

## Analytics and future lead acquisition

The site emits `apexweb:analytics` CustomEvents for quote clicks, package selection, quote starts/completions, email and Instagram clicks. No external analytics provider is enabled. Integrate an approved first-party adapter with this event if needed. Campaign source/UTM values are held in session storage and added to the enquiry. There is no outbound sending or prospect scraping system. `Lead` provides a typed boundary for a future CRM or campaign workflow.

## Deployment

Linked project: `apex-web` in `maxlhill204-labs-projects`. Existing domain: `apexweb.com.au`. Do not change DNS or the project binding. `vercel deploy --prod` deploys the site. Run commands from this repository. If a newly released CLI gives a scope error, the verified CLI for this build is `npx vercel@59.14.0` with the existing `.vercel/project.json` link and no scope override.

Preserve the GitHub source as well as the Vercel deployment to prevent future deployments of the old design. This work lives on the `codex/apexweb-complete-rebuild` branch for review.

## Tests and limits

`npm test` covers lead validation, HTML escaping, request guards, storage failure, successful acceptance and retry identity. Those tests mock external services. `tests/browser-qa.cjs` attaches to an agent-browser Chromium session; set `CDP_URL` to the current endpoint. It tests nine widths, accessibility, menu, model controls, package links, wizard validation/back/review, and explicitly mocked success/failure states. Real server delivery is checked separately against Vercel. Browser screenshots and the handover report live outside the source checkout in the workspace outputs.

Privacy wording is a concise description of the implemented data flow, not a professionally reviewed legal policy. No client testimonials or commercial outcomes have been fabricated.
