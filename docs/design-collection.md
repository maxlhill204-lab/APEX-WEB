# APEXWEB design collection

Public entry: https://apexweb.au/templates. Each package contains ten stable references, matching the private local files in the APEXWEB/client-system prompt library. Full prompts, client documents and client information are deliberately outside the public website bundle.

## Add a completed demonstration

Edit the matching record in `lib/design-catalogue.ts`: set `demoUrl` to the actual HTTPS demonstration URL, then build and deploy. Keep its `id`, `slug` and tier unchanged so links and client choices remain stable. Do not describe a demonstration as client work. Use genuine licensed assets or explicitly fictional demonstration content. Check its mobile, accessibility and provider states before linking it. The public page automatically changes its status and displays the live-demo action.

`previewImage` is reserved metadata and is currently unused. Current previews are intentionally labelled illustrative typography/palette studies, not representations of completed implementations. Adding a real screenshot later requires implementation in DesignPreview, meaningful alt text and appropriate image dimensions.

The complete master prompts reside in `../client-system/prompts/`, where 1.1–1.10 correspond to Starter, 2.1–2.10 to Local Business and 3.1–3.10 to Growth. Supply real client facts and account invitations to the selected master prompt. Do not store customer data in this public catalogue. A client's quote links include `source=template-ID`, preserving their selection in the enquiry source field.

## Checks

Run `npm ci`, `npm run test`, `npm run lint` and `npm run build`. Validate new demo URLs and client handoff in the browser. Update public/sitemap.xml when adding a public indexable route, using only canonical apexweb.au URLs. Existing directions have static pre-rendered pages; unknown tier/design combinations return 404.

## Operational limits

Production scripts are restricted to this origin. Style attributes remain permitted for existing motion and palette variables. Do not enable unsafe-eval or broadly add external script hosts to make an integration work. Review and allow only the actual provider requirement.

The quote API has an in-process eight-per-ten-minute IP limiter, explicit production origin checking, cross-site fetch rejection, bounded JSON bodies, server validation and HTML escaping. The in-process limiter is defence in depth, not a distributed limit across all Vercel instances. Add a verified platform-wide rule or persistent limiter for distributed abuse control. Existing provider credentials, Firebase rules and account MFA require provider-level verification; code headers alone do not certify them.

Do not perform a real email send or charge while doing automated browser QA unless the specific test and recipient/payment are authorised. The unit tests mock provider requests. The deployment does not change DNS mail records, provider accounts, billing, SMTP/outreach pipelines or historical leads.
