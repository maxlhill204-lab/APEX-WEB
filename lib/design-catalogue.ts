import type { Design, DesignTier } from './template-types';
export const designTiers: DesignTier[] = [
  {
    "slug": "starter",
    "number": 1,
    "name": "Starter Site",
    "price": 300,
    "description": "Considered, clear and confidently simple.",
    "scope": "Up to 3 custom pages. Static standard scope; custom animation is an agreed add-on."
  },
  {
    "slug": "business",
    "number": 2,
    "name": "Local Business",
    "price": 700,
    "description": "More depth, purposeful motion and useful interaction.",
    "scope": "Up to 6 custom pages, purposeful motion and one scoped integration."
  },
  {
    "slug": "growth",
    "number": 3,
    "name": "Growth Site",
    "price": 850,
    "description": "A cinematic story, with connected business tools.",
    "scope": "Up to 10 custom pages, one agreed cinematic journey and scoped connected tools."
  }
];
export const designs: Design[] = [
  {
    "id": "1.1",
    "slug": "swiss-editorial-luxury",
    "tier": "starter",
    "title": "Swiss editorial luxury",
    "summary": "Architectural typography, generous space and a monochrome editorial rhythm. A confident direction that lets strong words and imagery do the work.",
    "audience": "Design studios, consultants and premium professional services",
    "palette": [
      "#F2F2F2",
      "#111111",
      "#838282"
    ],
    "typography": "Clash Display with Satoshi, or licensed compatible alternatives",
    "signature": "Oversized typography and an asymmetric editorial image composition.",
    "chapters": [
      "The echo introduction",
      "A clear philosophy",
      "Asymmetrical showcase",
      "Services and final conversion"
    ],
    "demoUrl": null,
    "previewImage": null
  },
  {
    "id": "1.2",
    "slug": "dark-precision-technology",
    "tier": "starter",
    "title": "Dark precision technology",
    "summary": "A dark, precise interface with technical typography and structured information. Every diagram and number has a useful meaning.",
    "audience": "Technology businesses and engineering services",
    "palette": [
      "#000000",
      "#FFFFFF",
      "#52A8FF"
    ],
    "typography": "Inter Display and Geist Mono",
    "signature": "An information-led technical composition with controlled blue highlights.",
    "chapters": [
      "System introduction",
      "Interactive event stream",
      "Intelligence modules",
      "Evidence and conversion"
    ],
    "demoUrl": null,
    "previewImage": null
  },
  {
    "id": "1.3",
    "slug": "surreal-dark-editorial",
    "tier": "starter",
    "title": "Surreal dark editorial",
    "summary": "A dark creative world with sculptural forms, elegant serif typography and a restrained ember accent. Expressive without sacrificing clarity.",
    "audience": "Creative studios and expressive premium brands",
    "palette": [
      "#050505",
      "#F4EDE4",
      "#FF4500"
    ],
    "typography": "Playfair Display and Inter",
    "signature": "Sculptural imagery and surreal editorial composition.",
    "chapters": [
      "The void opens",
      "A creative philosophy",
      "Selected work",
      "A decisive invitation"
    ],
    "demoUrl": null,
    "previewImage": null
  },
  {
    "id": "1.4",
    "slug": "soft-tactile-wellness",
    "tier": "starter",
    "title": "Soft tactile wellness",
    "summary": "Warm pastel surfaces, tactile shapes and generous breathing room. A friendly, reassuring direction with clear practical content.",
    "audience": "Wellness, personal care and independent service businesses",
    "palette": [
      "#F7F1EC",
      "#393A36",
      "#B8C7B6"
    ],
    "typography": "Expressive editorial headings with highly readable body text",
    "signature": "A soft tactile composition that feels calm and human.",
    "chapters": [
      "A softer introduction",
      "Real services",
      "The people and approach",
      "An easy next step"
    ],
    "demoUrl": null,
    "previewImage": null
  },
  {
    "id": "1.5",
    "slug": "stationery-maker-editorial",
    "tier": "starter",
    "title": "Stationery maker editorial",
    "summary": "A warm maker’s editorial, built around one carefully presented product or material. Details and workmanship create the visual story.",
    "audience": "Stationery, independent makers and physical-product brands",
    "palette": [
      "#F4EBDC",
      "#342C27",
      "#B47043"
    ],
    "typography": "Warm editorial serif with restrained sans-serif UI",
    "signature": "One hero product connects an editorial sequence.",
    "chapters": [
      "Product introduction",
      "Material and detail",
      "Actual collection",
      "Enquiry or ordering process"
    ],
    "demoUrl": null,
    "previewImage": null
  },
  {
    "id": "1.6",
    "slug": "forest-technical-minimalism",
    "tier": "starter",
    "title": "Forest technical minimalism",
    "summary": "A disciplined architectural grid with forest ink, fine rules and exact alignment. Technical quality expressed through restraint.",
    "audience": "Architects, engineers and specialist consultancies",
    "palette": [
      "#EDEFE8",
      "#203A2E",
      "#77917A"
    ],
    "typography": "Technical sans-serif and restrained monospaced labels",
    "signature": "A structural mosaic that organises useful information.",
    "chapters": [
      "The structural statement",
      "Capabilities index",
      "Work and detail",
      "Direct enquiry"
    ],
    "demoUrl": null,
    "previewImage": null
  },
  {
    "id": "1.7",
    "slug": "coastal-calm",
    "tier": "starter",
    "title": "Coastal calm",
    "summary": "A quiet coastal editorial with chalk, sea ink and a photographic horizon. Spacious, practical and free of beach clichés.",
    "audience": "Accommodation, home organisers and independent services",
    "palette": [
      "#F6F4ED",
      "#18343C",
      "#607D83"
    ],
    "typography": "Fraunces for quietly expressive headings and Source Sans 3 for readable body and UI",
    "signature": "A still photographic diptych with one broad horizon image and one intimate material detail; the rhythm of shoreline, space and practical information",
    "chapters": [
      "A clear sense of place",
      "Actual services",
      "A genuine introduction",
      "Contact and locality"
    ],
    "demoUrl": null,
    "previewImage": null
  },
  {
    "id": "1.8",
    "slug": "heritage-craft",
    "tier": "starter",
    "title": "Heritage craft",
    "summary": "A contemporary interpretation of local craft: parchment, oxblood and printed-style type. Truthful materials and real workmanship lead.",
    "audience": "Bakeries, florists, artisans and neighbourhood workshops",
    "palette": [
      "#F4EBDD",
      "#542B2F",
      "#A17B48"
    ],
    "typography": "Libre Baskerville headings and Work Sans body; reserve italic for a single short editorial phrase",
    "signature": "An oversized printed-style masthead, a fine double rule and a truthful photograph of hands or materials; a considered contemporary interpretation of a local craft business",
    "chapters": [
      "The local introduction",
      "Actual specialties",
      "Workmanship and story",
      "Visit or enquire"
    ],
    "demoUrl": null,
    "previewImage": null
  },
  {
    "id": "1.9",
    "slug": "rugged-local-confidence",
    "tier": "starter",
    "title": "Rugged local confidence",
    "summary": "Strong practical typography, genuine working images and clear service information. Built for local businesses that want confidence and clarity.",
    "audience": "Roofers, mechanics, fencing and practical trades",
    "palette": [
      "#F2F0E8",
      "#242826",
      "#65705D"
    ],
    "typography": "Barlow Condensed headings with Barlow body; uppercase only for short labels",
    "signature": "Strong left-aligned typography and a genuine wide working photograph with a clear factual job/service caption; utility and workmanship rather than decorative industrial effects",
    "chapters": [
      "Trade and region",
      "Services and inclusions",
      "Genuine job evidence",
      "Request a quote"
    ],
    "demoUrl": null,
    "previewImage": null
  },
  {
    "id": "1.10",
    "slug": "quiet-luxury-hospitality",
    "tier": "starter",
    "title": "Quiet luxury hospitality",
    "summary": "An understated hospitality direction with ink, cream and an elegant editorial rhythm. Place, offering and practical visitor information stay connected.",
    "audience": "Boutique accommodation and refined hospitality",
    "palette": [
      "#F8F5EE",
      "#2C2420",
      "#B8A999"
    ],
    "typography": "Cormorant Garamond display with DM Sans body, keeping thin serif text large enough to remain legible",
    "signature": "A generous editorial photograph, an elegant small wordmark, distinct menu/service rows and warm understated hospitality",
    "chapters": [
      "The place and invitation",
      "Offering and atmosphere",
      "Useful visitor details",
      "Reservation enquiry"
    ],
    "demoUrl": null,
    "previewImage": null
  },
  {
    "id": "2.1",
    "slug": "cursor-light-sculpture",
    "tier": "business",
    "title": "Cursor light sculpture",
    "summary": "Luminous three-dimensional tubes respond to the visitor with fluid, controlled motion. A distinctive visual environment around a real business message.",
    "audience": "Design, technology and expressive contemporary brands",
    "palette": [
      "#08090C",
      "#F1F0EA",
      "#72E5D4"
    ],
    "typography": "Confident modern display type with restrained interface text",
    "signature": "Responsive light sculpture with a static fallback.",
    "chapters": [
      "Light and introduction",
      "Cursor response",
      "Capabilities and evidence",
      "Contact in a quiet frame"
    ],
    "demoUrl": null,
    "previewImage": null
  },
  {
    "id": "2.2",
    "slug": "didone-product-house-luxury",
    "tier": "business",
    "title": "Didone product-house luxury",
    "summary": "A luxurious product story with Didone typography, pinned editorial stages and carefully lit imagery. The pace feels deliberate and physical.",
    "audience": "Perfumery, beauty and boutique product houses",
    "palette": [
      "#F2EDE4",
      "#302A25",
      "#A48A64"
    ],
    "typography": "Didone-style display serif with restrained sans-serif UI",
    "signature": "A product moves through a coherent editorial sequence.",
    "chapters": [
      "The product world",
      "Form and identity",
      "Material and provenance",
      "Collection and conversion"
    ],
    "demoUrl": null,
    "previewImage": null
  },
  {
    "id": "2.3",
    "slug": "the-drawn-service-journey",
    "tier": "business",
    "title": "The drawn service journey",
    "summary": "A fine drawn line connects the business story as visitors scroll. It reverses naturally and guides attention through useful content.",
    "audience": "Service businesses and professional teams",
    "palette": [
      "#F2F0E9",
      "#26362E",
      "#7B927A"
    ],
    "typography": "Editorial headings with clear everyday body type",
    "signature": "A reversible SVG line ties the full service journey together.",
    "chapters": [
      "A single beginning",
      "Services connected",
      "Evidence and process",
      "The enquiry destination"
    ],
    "demoUrl": null,
    "previewImage": null
  },
  {
    "id": "2.4",
    "slug": "generated-light-modern",
    "tier": "business",
    "title": "Generated-light modern",
    "summary": "Generated light and dark technical luxury create an expressive product environment. The visual system remains controlled, legible and purposeful.",
    "audience": "Audio, technology and creative products",
    "palette": [
      "#090A0B",
      "#ECEDE8",
      "#D5B77C"
    ],
    "typography": "Technical display type with concise monospaced details",
    "signature": "A purposeful generated-light environment and real product interaction.",
    "chapters": [
      "The signal appears",
      "Useful product demonstration",
      "Capabilities and proof",
      "A clear conversion"
    ],
    "demoUrl": null,
    "previewImage": null
  },
  {
    "id": "2.5",
    "slug": "portal-catalogue-editorial",
    "tier": "business",
    "title": "Portal catalogue editorial",
    "summary": "Enter a visual portal, then explore an interactive collection of record sleeves. An editorial direction with genuine, tactile interaction.",
    "audience": "Record labels, artists and curated collections",
    "palette": [
      "#111014",
      "#F1EAE0",
      "#C68E6C"
    ],
    "typography": "Characterful editorial type with compact interface labels",
    "signature": "An opening portal and a responsive catalogue deck.",
    "chapters": [
      "The portal opens",
      "The label’s world",
      "A tactile sleeve collection",
      "Artists, releases and enquiry"
    ],
    "demoUrl": null,
    "previewImage": null
  },
  {
    "id": "2.6",
    "slug": "material-craft-and-the-honest-reveal",
    "tier": "business",
    "title": "Material craft and the honest reveal",
    "summary": "Materials, detail and a purposeful reveal support a complete craft-led website. Interaction makes the work easier to understand.",
    "audience": "Joinery, interiors, artisans and material specialists",
    "palette": [
      "#F0EAE1",
      "#282522",
      "#946F4E"
    ],
    "typography": "Manrope headings with Newsreader editorial accents and Source Sans 3 body",
    "signature": "One accessible before/after comparison and a material-detail reveal, grounded in real project photographs rather than a full cinematic 3D world",
    "chapters": [
      "The material introduction",
      "A useful reveal",
      "Real projects",
      "A clear project enquiry"
    ],
    "demoUrl": null,
    "previewImage": null
  },
  {
    "id": "2.7",
    "slug": "warm-table-hospitality",
    "tier": "business",
    "title": "Warm table hospitality",
    "summary": "A warm hospitality editorial that brings menu, setting and booking together. Rich imagery is balanced with practical information.",
    "audience": "Cafés, restaurants and local dining venues",
    "palette": [
      "#FFF7EA",
      "#3D2C23",
      "#BD6752"
    ],
    "typography": "Fraunces display and Nunito Sans body with restrained expressive serif use",
    "signature": "A tactile menu index and one gentle photographic reveal that suggests arriving at a welcoming table",
    "chapters": [
      "The invitation",
      "The menu and offering",
      "The setting and people",
      "Book or visit"
    ],
    "demoUrl": null,
    "previewImage": null
  },
  {
    "id": "2.8",
    "slug": "precision-professional",
    "tier": "business",
    "title": "Precision professional",
    "summary": "Precise professional typography and clear content hierarchy, with purposeful interaction. A reassuring direction for decisions that need trust.",
    "audience": "Consultancies and professional service firms",
    "palette": [
      "#F6F7F5",
      "#192E44",
      "#586978"
    ],
    "typography": "IBM Plex Sans display/body with IBM Plex Mono restricted to small factual metadata",
    "signature": "An accessible service-path selector and a restrained line progression through the real client process",
    "chapters": [
      "A precise proposition",
      "Services made clear",
      "Real evidence and process",
      "Arrange a conversation"
    ],
    "demoUrl": null,
    "previewImage": null
  },
  {
    "id": "2.9",
    "slug": "friendly-neighbourhood-care",
    "tier": "business",
    "title": "Friendly neighbourhood care",
    "summary": "An approachable neighbourhood identity with clear service paths and human imagery. Friendly design keeps everyday tasks easy.",
    "audience": "Community services, family-focused providers and local care",
    "palette": [
      "#FAF4E8",
      "#214D50",
      "#E8A17E"
    ],
    "typography": "Lora warm headings with Atkinson Hyperlegible body and labels",
    "signature": "A friendly real-photo service chooser with subtle layout transitions and a clear practical next-step flow",
    "chapters": [
      "A welcoming introduction",
      "Find the relevant service",
      "People and practical details",
      "An easy next step"
    ],
    "demoUrl": null,
    "previewImage": null
  },
  {
    "id": "2.10",
    "slug": "focused-performance",
    "tier": "business",
    "title": "Focused performance",
    "summary": "Strong typography and focused movement turn attention into a useful action. A purposeful, disciplined direction for active brands.",
    "audience": "Fitness studios, coaches and performance-focused services",
    "palette": [
      "#F0F1EB",
      "#171D1B",
      "#6B7972"
    ],
    "typography": "Archivo display and Source Sans 3 body; strong readable numbers only for confirmed factual schedules",
    "signature": "An accessible timetable/service filter and a measured scroll progress treatment tied to the real training process",
    "chapters": [
      "The purpose and introduction",
      "Choose a service",
      "Real progress and process",
      "Take the next step"
    ],
    "demoUrl": null,
    "previewImage": null
  },
  {
    "id": "3.1",
    "slug": "builders-and-trades",
    "tier": "growth",
    "title": "Builders and trades — from nothing to everything",
    "summary": "One line becomes a blueprint, then a world inside it and a finished home. A continuous architectural story grounded in real work.",
    "audience": "Builders, construction companies and specialist trades",
    "palette": [
      "#EEEAE3",
      "#262B2B",
      "#BA9867"
    ],
    "typography": "Architectural display typography and readable editorial text",
    "signature": "From nothing to everything: an explorable architectural journey.",
    "chapters": [
      "One line",
      "The blueprint",
      "A world in the drawing",
      "The structure rises",
      "Construction in motion",
      "The finished home",
      "Projects and people",
      "Your blank blueprint"
    ],
    "demoUrl": null,
    "previewImage": null
  },
  {
    "id": "3.2",
    "slug": "landscaping",
    "tier": "growth",
    "title": "Landscaping — a world beyond your door",
    "summary": "A garden grows from a quiet beginning into an explorable living world. The story reveals spaces, materials and the real landscape business.",
    "audience": "Landscapers and garden designers",
    "palette": [
      "#EAECE1",
      "#254332",
      "#A5AE79"
    ],
    "typography": "Organic editorial serif and practical sans-serif text",
    "signature": "A world beyond your door: one coherent landscape journey.",
    "chapters": [
      "The first seed",
      "The ground opens",
      "A living landscape",
      "Explore the spaces",
      "Materials and craft",
      "Real gardens",
      "People and process",
      "Your outdoor possibility"
    ],
    "demoUrl": null,
    "previewImage": null
  },
  {
    "id": "3.3",
    "slug": "car-detailing",
    "tier": "growth",
    "title": "Car detailing — the art of the reveal",
    "summary": "Move from an imperfect surface into an exacting, carefully lit reveal. A cinematic detailing story with real work and service choices.",
    "audience": "Car detailing and automotive presentation businesses",
    "palette": [
      "#0D1114",
      "#EAEFF0",
      "#8299AC"
    ],
    "typography": "Precise display type and restrained technical labels",
    "signature": "The art of the reveal: a continuous vehicle-detailing story.",
    "chapters": [
      "The first impression",
      "Enter the surface",
      "Layers and light",
      "The process",
      "The reveal",
      "Real vehicle work",
      "Services and team",
      "Your vehicle enquiry"
    ],
    "demoUrl": null,
    "previewImage": null
  },
  {
    "id": "3.4",
    "slug": "painting",
    "tier": "growth",
    "title": "Painting — a world waiting for colour",
    "summary": "A quiet architectural world gains colour, character and finish. The visitor explores the transformation, then connects it to real painting services.",
    "audience": "Painting and decorating businesses",
    "palette": [
      "#F0ECE3",
      "#343530",
      "#B67554"
    ],
    "typography": "Architectural editorial typography with legible body text",
    "signature": "A world waiting for colour: transformation through space and material.",
    "chapters": [
      "The unpainted world",
      "A colour begins",
      "Through the rooms",
      "Material and finish",
      "The transformation",
      "Real completed work",
      "The process and people",
      "Your next space"
    ],
    "demoUrl": null,
    "previewImage": null
  },
  {
    "id": "3.5",
    "slug": "plumbing",
    "tier": "growth",
    "title": "Plumbing — beneath the surface",
    "summary": "Begin with an ordinary kitchen, travel beneath its surface and discover a connected system. Return to the same room with a new understanding.",
    "audience": "Plumbers and drainage specialists",
    "palette": [
      "#E9EEEB",
      "#173C46",
      "#739EA1"
    ],
    "typography": "Calm architectural type with clear service information",
    "signature": "Beneath the surface: an explorable connected world.",
    "chapters": [
      "An ordinary moment",
      "Beneath the surface",
      "Follow the connection",
      "A system revealed",
      "Explore the building",
      "Real services and work",
      "People and process",
      "Return to the kitchen"
    ],
    "demoUrl": null,
    "previewImage": null
  },
  {
    "id": "3.6",
    "slug": "electrical-and-solar",
    "tier": "growth",
    "title": "Electrical and solar — the light that connects us",
    "summary": "A familiar home at dusk reveals the coordinated systems that bring light and useful power to everyday life. One controlled illuminated route connects the opening fixture, real services, actual work and the final invitation. This is an architectural story about dependable service, never a circuit-design tutorial or science-fiction power grid.",
    "audience": "Electricians, lighting installers and approved solar/electrical specialists",
    "palette": [
      "#171B22",
      "#F4EFE5",
      "#D9B784"
    ],
    "typography": "Sora for measured contemporary headlines, Source Sans 3 for body and restrained IBM Plex Mono annotations",
    "signature": "A familiar home at dusk reveals the coordinated systems that bring light and useful power to everyday life. One controlled illuminated route connects the opening fixture, real services, actual work and the final invitation. This is an architectural story about dependable service, never a circuit-design tutorial or science-fiction power grid.",
    "chapters": [
      "A room waiting for light",
      "The hidden connection",
      "Purpose in every room",
      "The right kind of energy",
      "Work you can verify",
      "A clear path to the job",
      "The familiar room restored",
      "Your next connection"
    ],
    "demoUrl": null,
    "previewImage": null
  },
  {
    "id": "3.7",
    "slug": "cleaning",
    "tier": "growth",
    "title": "Cleaning — room to breathe",
    "summary": "One continuous space shifts from visual distraction to clarity through measured service-specific work. A reflection on glass becomes the thread linking interior, surfaces, actual transformations and a calm final invitation. Elegance comes from light, material and order, not humiliating a customer’s home or creating exaggerated dirt.",
    "audience": "Residential cleaners, commercial cleaners, window specialists and approved property-care businesses",
    "palette": [
      "#F7F5EF",
      "#DDE6E4",
      "#24474B"
    ],
    "typography": "DM Sans headings and body with restrained Newsreader editorial moments",
    "signature": "One continuous space shifts from visual distraction to clarity through measured service-specific work. A reflection on glass becomes the thread linking interior, surfaces, actual transformations and a calm final invitation. Elegance comes from light, material and order, not humiliating a customer’s home or creating exaggerated dirt.",
    "chapters": [
      "The space around you",
      "Clarity in the details",
      "Care shaped to the space",
      "A quieter whole",
      "Actual work and actual care",
      "Know what happens next",
      "Space to return to",
      "Tell us about your space"
    ],
    "demoUrl": null,
    "previewImage": null
  },
  {
    "id": "3.8",
    "slug": "hair-and-beauty",
    "tier": "growth",
    "title": "Hair and beauty — the craft of becoming",
    "summary": "A thread of light reveals material, skilled hands, the authentic studio and a client's own choice of service. An elegant mirror provides scene continuity from first glimpse to final booking. Focus on craft and personal expression without inventing transformation results or implying medical treatments.",
    "audience": "Hair salons, barbers and non-medical beauty studios with verified services",
    "palette": [
      "#F4EFE9",
      "#312525",
      "#B88F88"
    ],
    "typography": "Bodoni Moda at readable display sizes with Manrope for practical content and controls",
    "signature": "A thread of light reveals material, skilled hands, the authentic studio and a client's own choice of service. An elegant mirror provides scene continuity from first glimpse to final booking. Focus on craft and personal expression without inventing transformation results or implying medical treatments.",
    "chapters": [
      "The first reflection",
      "Close to the craft",
      "Your service and your style",
      "The place and the people",
      "Work with a real story",
      "A comfortable first step",
      "A new perspective",
      "Make time for your next visit"
    ],
    "demoUrl": null,
    "previewImage": null
  },
  {
    "id": "3.9",
    "slug": "caf-and-dining",
    "tier": "growth",
    "title": "Café and dining — from first light to your table",
    "summary": "A single warm morning scene grows from ingredient detail to preparation, genuine food, the real place and a visitor's next visit. One table and its light anchor the entire story. The emotional theme is hospitality grounded in real menu and visiting information, never a generic flying-food advertisement.",
    "audience": "Cafés, bakeries, independent restaurants and small hospitality venues",
    "palette": [
      "#FAF3E6",
      "#38261F",
      "#455448"
    ],
    "typography": "Fraunces for expressive headlines and Source Sans 3 for menus, details and UI",
    "signature": "A single warm morning scene grows from ingredient detail to preparation, genuine food, the real place and a visitor's next visit. One table and its light anchor the entire story. The emotional theme is hospitality grounded in real menu and visiting information, never a generic flying-food advertisement.",
    "chapters": [
      "Before the first sip",
      "The ingredients of the place",
      "Made for the moment",
      "A place to spend time",
      "The real menu and the real story",
      "Plan your visit",
      "Your seat in the story",
      "We would love to hear from you"
    ],
    "demoUrl": null,
    "previewImage": null
  },
  {
    "id": "3.10",
    "slug": "fitness-and-movement",
    "tier": "growth",
    "title": "Fitness and movement — the next step",
    "summary": "One grounded movement motif develops from a quiet first step into real training formats, genuine people and a clear path to getting started. A continuous studio/floor line gives spatial continuity; the story builds confidence without promising body transformations, diagnosing health conditions or displaying fictional performance results.",
    "audience": "Personal trainers, boutique gyms, pilates studios and independent movement coaches",
    "palette": [
      "#F0F1EB",
      "#1B2321",
      "#6B8175"
    ],
    "typography": "Archivo for strong headings and Atkinson Hyperlegible for practical body text",
    "signature": "One grounded movement motif develops from a quiet first step into real training formats, genuine people and a clear path to getting started. A continuous studio/floor line gives spatial continuity; the story builds confidence without promising body transformations, diagnosing health conditions or displaying fictional performance results.",
    "chapters": [
      "A place to begin",
      "Movement with purpose",
      "Find your way to train",
      "The rhythm of the place",
      "People behind the practice",
      "Your first session",
      "Ready for the next step",
      "Start with a conversation"
    ],
    "demoUrl": null,
    "previewImage": null
  }
];
