export const site = {
  name: "APEXWEB",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://apexweb.au",
  email: "apexweb.au@gmail.com",
  instagram: "https://www.instagram.com/apexweb.au/",
  facebook: "https://www.facebook.com/profile.php?id=61591306250659",
  currency: "AUD",
  // This must be a sender verified in Resend. Until apexweb.au is verified,
  // use the Resend onboarding sender via the EMAIL_FROM environment variable.
  emailFrom: "APEXWEB <onboarding@resend.dev>",
};
export const packages = [
  {
    id: "starter",
    name: "Starter Site",
    price: 300,
    pages: "Up to 3 pages",
    description:
      "A polished, straightforward home for your business. Clear information. Easy enquiries.",
    features: [
      "Up to 3 custom pages: home, services and contact",
      "Mobile, tablet and desktop design tailored to your brand",
      "Contact form, map/social links and essential on-page SEO",
      "Static layouts: no custom animation, 3D, payments or database",
      "Pre-launch checks plus handover of your site and accounts",
    ],
    recommended: false,
    cta: "Choose Starter",
  },
  {
    id: "business",
    name: "Local Business",
    price: 700,
    pages: "Up to 6 pages",
    description:
      "A more interactive website with considered scrolling effects and useful customer features.",
    features: [
      "Everything in Starter, with up to 6 custom pages",
      "Custom layouts, service sections and interactive galleries",
      "Purposeful scroll animation and conversion-focused calls to action",
      "One scoped integration: Stripe, booking link or enquiry workflow",
      "No cinematic 3D journey or multi-system database build",
    ],
    recommended: false,
    cta: "Choose Business",
  },
  {
    id: "growth",
    name: "Growth Site",
    price: 850,
    pages: "Up to 10 pages",
    description:
      "The full experience. Cinematic 3D, scroll-driven storytelling and connected business tools.",
    features: [
      "Everything in Local Business, with up to 10 custom pages",
      "Cinematic 3D and scroll-driven storytelling built for your brand",
      "Connected workflow: Stripe plus Firebase/database integration",
      "Email or newsletter connection and a tailored launch handover",
      "Best value when you need an experience, not just an online brochure",
    ],
    recommended: true,
    cta: "Choose Growth",
  },
];
export const carePlans = [
  {
    id: "hosted",
    name: "Starter care",
    price: 39,
    annual: 351,
    description:
      "For a simple, static site: managed hosting, uptime and dependency checks, security updates and one small text/image update each month.",
  },
  {
    id: "managed",
    name: "Business care",
    price: 79,
    annual: 711,
    description:
      "For an interactive business site: Starter care coverage, with two small updates in total each month and checks on one agreed booking, Stripe or database connection.",
  },
  {
    id: "priority",
    name: "Growth care",
    price: 149,
    annual: 1341,
    description:
      "For a connected Growth site: Business care coverage, with four small updates in total each month and checks on your agreed payment, database and email connections.",
  },
];
export const featureOptions = [
  "New website",
  "Redesign",
  "Contact form",
  "Gallery",
  "Online bookings",
  "Product catalogue",
  "Ecommerce",
  "Stripe payments",
  "3D and cinematic scrolling",
  "Firebase / database",
  "Email / newsletters",
  "Instagram / social links",
  "Map / location",
  "Service pages",
  "Other",
];
export const styleOptions = [
  "Minimal",
  "Modern",
  "Luxury",
  "Bold",
  "Corporate",
  "Not sure",
];
export const faqs = [
  [
    "How much does a website cost?",
    "One-time builds start at $300 for Starter, $700 for Local Business, and $850 for Growth. Growth adds up to four more pages, a scoped 3D experience, database and email connections for $150 more than Business at the starting price. Optional care is separate. We confirm your complete scope, provider costs and final price before work begins.",
  ],
  [
    "Which package should I choose?",
    "Choose Starter for a simple information and enquiry site. Local Business suits a larger service website with one agreed booking or payment connection. Growth is the stronger value if you need more pages, a 3D experience and connected payment, database and email tools. You can choose “Help me decide” in the quote form.",
  ],
  [
    "Does a quote request commit me to anything?",
    "No. It starts a conversation. We review your requirements and confirm the scope and final price with you. Work starts only once we both agree.",
  ],
  [
    "How long will my website take?",
    "Timing depends on the scope and how ready your content is. Tell us your preferred launch date in your enquiry and we’ll confirm a realistic timeline before starting.",
  ],
  [
    "Can you redesign my existing website?",
    "Yes. Share your current website and tell us what isn’t working. We’ll plan what to keep, what to improve, and how to make the next step clearer for your customers.",
  ],
  [
    "Will it work on phones?",
    "Yes. Every build includes layouts for phones, tablets and computers, with readable content and easy-to-use navigation.",
  ],
  [
    "Can I keep my domain and update the site later?",
    "Yes. We can help connect your existing domain. Tell us how you’d like to manage future changes and we’ll agree on the right setup. Ongoing management is optional.",
  ],
  [
    "Can you connect Instagram, bookings or other features?",
    "Yes, we can plan social links and suitable integrations. Include your requirements in the quote. Paid third-party services, advanced bookings and ecommerce are scoped and priced separately where needed.",
  ],
  [
    "Is monthly hosting or management compulsory?",
    "No. The build is a one-time project. Optional care starts at $39 per month or $351 per year after approval. Annual payment saves 25% compared with twelve monthly payments. Domains, external subscriptions and the scope of updates are confirmed separately in your quote.",
  ],
  [
    "What happens after I send my enquiry?",
    "APEXWEB reviews your project and replies using your contact details. We clarify the requirements, recommend a package and confirm the final quote before any work starts.",
  ],
];
