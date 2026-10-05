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

Edit `site.config.ts` for contact email, Instagram, website URL, package prices and inclusions, care plans and FAQs. September 2026 pricing: builds start at $300/$700/$850 AUD; Growth is $150 above Business. Optional care remains $39/$79/$149 per month, or $351/$711/$1,341 annually (25% saving). Annual billing opens first and displays the effective monthly price. Final scope and price are agreed in a quote.

## Cinematic landing page

`ImmersiveShowcase.tsx` follows a continuous native-scroll timeline: a closed laptop on reflective marble opens and rotates; the camera approaches its blue globe screen; the same globe fills the viewport; Mars, Jupiter and Neptune pass with individual brand statements; the universe shrinks away; a desk and laptop return for an illustrated deployment; the real quote wizard follows immediately. Transparent navigation has a centred wordmark, and the fixed bottom CTA jumps directly to the inline enquiry. Package details and other supporting information follow the form.

`DeviceScene.tsx` uses Three.js with physical materials, planar reflections, photographic marble maps, NASA-derived planetary maps and a custom globe shader. Dragging and left/right arrow keys rotate the scene without visible controls. Scroll is never hijacked; the scrollbar is visually hidden. No ambient loops need a pause control: the renderer redraws on progress, interaction or asset changes, and suspends rendering offscreen or in a hidden tab. Pixel density is capped at 1.5. The studio radiance map is precomputed; both viewport and reflection shader variants are prepared asynchronously. A basic shadow map lights the floor without making every laptop surface receive expensive shadow filtering. This reduced the measured local mobile Lighthouse blocking time from 2,120 ms to 110 ms (performance 68 to 95 in this environment). Graphics resources are disposed on navigation.

Reduced-motion and WebGL-failure presentations use still frames from the actual scene. A responsive opening poster is visible while the 3D code and textures load. `pages/credits.tsx` documents the Solar System Scope CC BY 4.0 and Poly Haven CC0 assets. Poster generation hides the HTML interface before capturing the canvas region.

## Quote delivery

The home page embeds the same five-step wizard. `/quote?package=business&source=outreach` preselects a package and preserves attribution. `/contact` retains the existing route and runs the same wizard. Five steps cover package, business, requirements/style/timing, contact and review. Back/edit preserve answers. Validation occurs in the browser and again on the server. Failed requests retain all answers. Submission has a synchronous duplicate lock and a deterministic document ID for retries.

`POST /api/quote` validates content type, origin, allowed options, field types and lengths, consent and a honeypot. In-memory IP rate limiting is a best-effort safeguard per server instance; it is not a global distributed quota. For higher traffic, add shared rate limiting or a challenge provider. No user contact details are sent to analytics.

The existing Firebase rules permit a restricted, create-only document schema. The integration deliberately retains the seven existing fields: name, business, email, phone, message, source and createdAt. The complete quote appears as a readable summary and a structured JSON record within `message`. This preserves all the new fields without loosening database access. Enquiries are available in the existing Firebase Console under **Firestore Database → Data → enquiries**. A retry targets the same document ID.

The API reports success only when the business notification email has been accepted by the provider. A Firestore backup alone is not reported as successful delivery. No confirmation is sent to a customer unless the business notification was accepted first.

## Email configuration

Resend's Marketplace resource `apexweb-email` is connected to this project. `RESEND_API_KEY` is provisioned for Production, Preview and Development. `EMAIL_FROM=APEXWEB <enquiries@apexweb.au>` is configured for Production and Preview. On 6 October 2026, Resend reported `apexweb.au` verified. One owner-authorised live QA enquiry (`AW-d9d35042da5486801020b9c5`) was stored in Firestore, and both business/customer emails were accepted. Resend separately reported the business notification delivered; inbox-folder placement is not established. Failed submissions preserve answers and offer a prefilled email and downloadable brief.

Email requests use Resend idempotency keys, escaped HTML, plain-text alternatives, request timeouts, and Reply-To addresses. Secret API keys never enter client bundles.

`INTERNAL_EMAIL_FALLBACK_FROM` is configured to an existing verified sender in the same Resend account. It is used only for notifications to `apexweb.au@gmail.com`, and only when Resend explicitly rejects the primary domain as unverified. Customer confirmations never use this alternate domain. The primary sender automatically takes over when DNS verification succeeds. An internal delivery test was confirmed as `delivered` by Resend on September 23; mailbox-folder placement is not established by that event.

## Analytics and future lead acquisition

The site emits `apexweb:analytics` CustomEvents for quote clicks, package selection, quote starts/completions, email and Instagram clicks. No external analytics provider is enabled. Integrate an approved first-party adapter with this event if needed. Campaign source/UTM values are held in session storage and added to the enquiry. There is no outbound sending or prospect scraping system. `Lead` provides a typed boundary for a future CRM or campaign workflow.

## Deployment

Linked project: `apex-web` in `maxlhill204-labs-projects`, project ID `prj_S837q3BVkLEYdklfyOPTWfhYoOOP`. The live origin `https://apexweb.au` serves the site over HTTPS. On 6 October 2026 the apex resolved to `216.198.79.65` and `216.198.79.1`; the former parking-domain instructions are obsolete. `NEXT_PUBLIC_SITE_URL=https://apexweb.au` is set for Production and Preview, and sitemap/robots use that domain. Deploy using the existing GitHub repository `maxlhill204-lab/APEX-WEB` and Vercel project; do not create another project or overwrite existing mail/DNS records.

Preserve the GitHub source as well as the Vercel deployment to prevent future deployments of the old design. The finished source is pushed to `main`, with a matching `codex/apexweb-complete-rebuild` branch retained.

## Tests and limits

`npm test` covers lead validation, HTML escaping, request guards, storage failure, successful acceptance and retry identity. Those tests mock external services. `tests/browser-qa.cjs` can attach to an agent-browser Chromium session (`CDP_URL`) or use a dedicated headless Chrome context (`QA_HEADLESS=1`). It tests nine widths, accessibility, menu, model controls, package links, wizard validation/back/review, and explicitly mocked success/failure states. Real server delivery is checked separately against Vercel. Browser screenshots and the handover report live outside the source checkout in the workspace outputs.

Privacy wording is a concise description of the implemented data flow, not a professionally reviewed legal policy. No client testimonials or commercial outcomes have been fabricated.

## Cinematic acceptance checks

`node tests/cinema-qa.cjs` checks 65 timeline frames across 320, 390, 768, 1440 and 1920 px, heading bounds, page overflow, keyboard rotation, the direct enquiry CTA, texture loading and reduced-motion accessibility. Set `BASE_URL` and `QA_OUTPUT_DIR` to test a production deployment. `tests/browser-qa.cjs` additionally covers nine responsive widths and the complete quote flow with mocked network outcomes. These tests do not prove email delivery.

The real Firebase enquiry path and verified sender were checked against production on 6 October 2026. Automated browser tests use Chromium; they do not establish universal browser compatibility or every possible customer scenario.

## Billing and GST

The enquiry remains free and is not a checkout. Agree on scope and final price first, then create a customer-specific Stripe hosted invoice. Build catalogue amounts are starting prices, not a promise that every project costs that amount. Optional care starts after launch and agreement, using Stripe-hosted subscription Payment Links. Monthly and annual prices match the site; the Customer Portal supports invoice history, payment details and cancellation at period end. Plan changes are handled manually to confirm fit.

The October readiness work created a complete APEXWEB catalogue, six care Payment Links and a portal in the connected **sandbox only**. Never share sandbox links with paying customers. Live account access, verification, payout details, the corresponding live catalogue and recovery settings must be checked before real payment launch. A successful sandbox checkout does not establish live payment or payout readiness.

`/api/stripe/webhook` verifies the raw request with the official Stripe SDK and endpoint-specific server secrets. `STRIPE_WEBHOOK_SECRET` accepts live events; `STRIPE_TEST_WEBHOOK_SECRET` accepts sandbox events. Configure endpoints on API version `2026-08-26.dahlia` for subscription created/updated/deleted and invoice paid/payment-failed/payment-action-required. Sandbox notifications are labelled. Provider failure returns 503 so Stripe retries. No card data or API key is required by this notification-only handler.

This service business fulfils and reconciles payments manually in Stripe Dashboard. There is no app entitlement/account database. APEXWEB catalogue and invoice metadata (`business=apexweb.au`) provides the explicit ownership boundary; invoice events inherit subscription metadata through `parent.subscription_details`. Stamp that metadata on manual APEXWEB invoices. Events from unrelated businesses are ignored. The handler sends notifications without changing service state; check current Stripe status before acting because events can be replayed or arrive out of order. Resend's idempotency window prevents duplicate emails for 24 hours; later replays may produce another alert, so an email is not a new order or automatic fulfilment instruction. Stripe remains the billing record of truth.

The owner reported approximately A$250 actual business turnover and A$1,000 expected over the next 12 months, with an ABN and no GST registration. GST collection is disabled. This is below the ordinary A$75,000 GST registration threshold, subject to total turnover across businesses under the entity and applicable exceptions. Do not add a GST registration or advertise GST-inclusive tax amounts without checking registration. Business income/expense recordkeeping and income tax remain separate obligations. Legal business identity, ABN number and billing address must come from the owner, never invented test details.

`npm test` includes signed webhook tests for environment separation, invoice ownership, lifecycle notifications, provider retry, unrelated events and payload limits. Production dependencies passed `npm audit --omit=dev`; remaining audit findings in the lint toolchain must be reviewed separately rather than forcing an incompatible downgrade.
