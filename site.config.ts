export const site = {
  name: "APEXWEB",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://apex-web-beta.vercel.app",
  email: "apexweb.au@gmail.com",
  instagram: "https://www.instagram.com/apexweb.au/",
  facebook: "https://www.facebook.com/profile.php?id=61591306250659",
  currency: "AUD",
  emailFrom: "APEXWEB <enquiries@apexweb.com.au>",
};
export const packages = [
  {
    id: "starter",
    name: "Starter Site",
    price: 300,
    pages: "1–3 pages",
    description:
      "A polished, straightforward home for your business. Clear information. Easy enquiries.",
    features: [
      "Custom responsive design · 1–3 pages",
      "Contact form and essential SEO",
      "Static layouts — no animation or 3D",
      "Launch checks and handover",
    ],
    recommended: false,
    cta: "Choose Starter",
  },
  {
    id: "business",
    name: "Local Business",
    price: 550,
    pages: "Scoped to your content",
    description:
      "A more interactive website with considered scrolling effects and useful customer features.",
    features: [
      "Custom layouts and scroll animations",
      "Interactive galleries and service sections",
      "Stripe payment integration available",
      "Moderate motion — no cinematic 3D journey",
    ],
    recommended: true,
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
      "Cinematic 3D and scroll sequences",
      "Up to 10 custom pages",
      "Stripe and Firebase / database integration",
      "Email and newsletter connections",
    ],
    recommended: false,
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
      "Hosting, uptime and dependency checks for a simple site. Essential support with agreed update allowances.",
  },
  {
    id: "managed",
    name: "Business care",
    price: 79,
    annual: 711,
    description:
      "Hosting and maintenance for an interactive site, including checks on agreed Stripe or database connections.",
  },
  {
    id: "priority",
    name: "Growth care",
    price: 149,
    annual: 1341,
    description:
      "Care for a more connected site: database, payment and email integrations, with agreed monitoring and update allowances.",
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
    "One-time builds start at $300 for Starter, $550 for Local Business, and $850 for Growth. The final quote depends on design complexity, motion and integrations. Optional hosting is separate, with monthly or discounted annual billing. We confirm the complete price before work begins.",
  ],
  [
    "Which package should I choose?",
    "Choose Starter for a static site, Local Business for moderate interactive motion and Stripe, or Growth for cinematic 3D and database or email integrations. If you’re unsure, choose “Help me decide” in the quote form.",
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
