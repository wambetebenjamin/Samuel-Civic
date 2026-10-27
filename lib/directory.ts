export const counties = [
  "Baringo",
  "Bomet",
  "Bungoma",
  "Busia",
  "Elgeyo-Marakwet",
  "Embu",
  "Garissa",
  "Homa Bay",
  "Isiolo",
  "Kajiado",
  "Kakamega",
  "Kericho",
  "Kiambu",
  "Kilifi",
  "Kirinyaga",
  "Kisii",
  "Kisumu",
  "Kitui",
  "Kwale",
  "Laikipia",
  "Lamu",
  "Machakos",
  "Makueni",
  "Mandera",
  "Marsabit",
  "Meru",
  "Migori",
  "Mombasa",
  "Murang'a",
  "Nairobi",
  "Nakuru",
  "Nandi",
  "Narok",
  "Nyamira",
  "Nyandarua",
  "Nyeri",
  "Samburu",
  "Siaya",
  "Taita-Taveta",
  "Tana River",
  "Tharaka-Nithi",
  "Trans Nzoia",
  "Turkana",
  "Uasin Gishu",
  "Vihiga",
  "Wajir",
  "West Pokot",
] as const;

export const officeTypes = [
  "County department",
  "Sub-county office",
  "Huduma-style info desk",
  "Other",
] as const;

export const categories = [
  {
    slug: "water-and-sanitation",
    name: "Water and Sanitation",
    short: "Water & sanitation",
    icon: "droplets",
    description: "Water supply, drainage and sanitation",
  },
  {
    slug: "roads-and-transport",
    name: "Roads and Transport",
    short: "Roads & transport",
    icon: "route",
    description: "Local roads, transport and parking",
  },
  {
    slug: "business-permits",
    name: "Business Permits",
    short: "Business permits",
    icon: "store",
    description: "Permits and business enquiries",
  },
  {
    slug: "land-and-housing",
    name: "Land and Housing",
    short: "Land & housing",
    icon: "house",
    description: "Land, planning and housing",
  },
  {
    slug: "health-facility-information",
    name: "Health facility information",
    short: "Health facilities",
    icon: "heart",
    description: "Find local health facility information",
  },
  {
    slug: "education-offices",
    name: "Education offices",
    short: "Education offices",
    icon: "book",
    description: "Early learning and education offices",
  },
  {
    slug: "waste-and-environment",
    name: "Waste and Environment",
    short: "Waste & environment",
    icon: "leaf",
    description: "Waste collection and the environment",
  },
  {
    slug: "social-services",
    name: "Social services",
    short: "Social services",
    icon: "users",
    description: "Community and social support",
  },
] as const;

export type Service = {
  slug: string;
  name: string;
  category: (typeof categories)[number]["slug"];
  summary: string;
  overview: string;
  documents: string[];
  time: string;
  officeType: (typeof officeTypes)[number];
  guideTitle: string;
  readTime: string;
  commonMistakes: string[];
  steps: string[];
};

export const services: Service[] = [
  {
    slug: "business-permit-enquiry",
    name: "Business permit enquiry",
    category: "business-permits",
    summary:
      "Find out where to ask about a new or renewed county business permit.",
    overview:
      "A county business permit may be needed to operate a business from a particular location. The type of permit and process depend on your county and the activity. Start by asking the county trade or revenue office what applies to you.",
    documents: [
      "Identification document for the applicant",
      "Business registration details, if available",
      "Business location and contact details",
      "Previous permit, if renewing",
    ],
    time: "Varies by county",
    officeType: "County department",
    guideTitle: "Getting ready to ask about a business permit",
    readTime: "4 min read",
    commonMistakes: [
      "Assuming last year’s fees are still current.",
      "Going to the office without the business location or registration details.",
      "Paying an unofficial person instead of using a verified county payment channel.",
    ],
    steps: [
      "Write down your business activity and its physical location.",
      "Ask the county trade or revenue office which permit applies and which documents to bring.",
      "Confirm the current fee and payment method directly with the office before paying.",
    ],
  },
  {
    slug: "water-supply-issue",
    name: "Report a water supply issue",
    category: "water-and-sanitation",
    summary:
      "Find the right starting point for a supply interruption, leak or water enquiry.",
    overview:
      "The organisation responsible for water depends on where you live. A county office or local water provider can help you identify the right team to contact about a supply interruption or leak.",
    documents: [
      "Location or nearest landmark",
      "Water account number, if you have one",
      "A brief description and date the issue began",
      "A photograph, if it is safe and useful",
    ],
    time: "Response times vary",
    officeType: "County department",
    guideTitle: "How to report a water supply problem",
    readTime: "3 min read",
    commonMistakes: [
      "Leaving out the location or account number when available.",
      "Assuming the county office and the water utility are the same organisation.",
      "Approaching damaged infrastructure when it is unsafe.",
    ],
    steps: [
      "Note the location and describe what you have observed.",
      "Check whether your local water provider or county office is responsible.",
      "Use a verified contact and keep any reference they give you.",
    ],
  },
  {
    slug: "road-maintenance-enquiry",
    name: "Road maintenance enquiry",
    category: "roads-and-transport",
    summary:
      "Ask which office handles a damaged local road or drainage concern.",
    overview:
      "Roads may be managed by different authorities depending on their classification. Your county roads office can be a useful first contact for a local road and can advise if another authority is responsible.",
    documents: [
      "Road name and nearest landmark",
      "Description of the problem",
      "Date first noticed, if known",
      "A photograph, only if safely taken",
    ],
    time: "Response times vary",
    officeType: "County department",
    guideTitle: "Reporting a local road problem",
    readTime: "3 min read",
    commonMistakes: [
      "Giving a location that is too general.",
      "Assuming every road is maintained by the county.",
      "Putting yourself at risk to take a photograph.",
    ],
    steps: [
      "Identify the road and a nearby landmark.",
      "Describe the issue without putting yourself in danger.",
      "Ask the county roads office whether it is the responsible authority.",
    ],
  },
  {
    slug: "land-records-enquiry",
    name: "Land records enquiry",
    category: "land-and-housing",
    summary:
      "Understand where to begin with a land or property records question.",
    overview:
      "Land records, rates and planning questions can involve different offices. Begin by describing the specific record or service you need and asking which county or national office handles it.",
    documents: [
      "Plot or parcel number, if known",
      "Identification document",
      "Any relevant correspondence or previous record",
      "Property location details",
    ],
    time: "Varies by office",
    officeType: "County department",
    guideTitle: "Preparing for a land records enquiry",
    readTime: "4 min read",
    commonMistakes: [
      "Confusing land rates with title registration.",
      "Submitting original documents without confirming the process.",
      "Treating general guidance as legal advice.",
    ],
    steps: [
      "Gather the plot or parcel details you already have.",
      "Ask which office holds the relevant record.",
      "Confirm the documents, fees and official process before making an application.",
    ],
  },
  {
    slug: "health-facility-enquiry",
    name: "Find a health facility",
    category: "health-facility-information",
    summary:
      "Ask about public health facilities and available services near you.",
    overview:
      "County health offices can help with information about local public facilities and the services they provide. Call the facility or county office to confirm opening hours and availability before travelling.",
    documents: [
      "Your location or preferred area",
      "The type of service you are looking for",
      "Any referral information, if relevant",
    ],
    time: "Confirm with facility",
    officeType: "County department",
    guideTitle: "Finding health facility information",
    readTime: "3 min read",
    commonMistakes: [
      "Assuming every facility offers the same service.",
      "Waiting for an online response in an emergency.",
      "Sharing detailed medical information unnecessarily.",
    ],
    steps: [
      "Identify the area and the type of facility you need.",
      "Contact the facility or county health office to confirm services and hours.",
      "For a true emergency, call 999 rather than submitting an online request.",
    ],
  },
  {
    slug: "education-office-enquiry",
    name: "Education office enquiry",
    category: "education-offices",
    summary:
      "Find a starting point for questions about local education offices.",
    overview:
      "Different education services are managed by county and national offices. Explain the type of school or service you are asking about so the office can direct you to the right desk.",
    documents: [
      "Name and location of the school or centre, if relevant",
      "A short description of your question",
      "Relevant correspondence, if available",
    ],
    time: "Varies by office",
    officeType: "Sub-county office",
    guideTitle: "Finding the right education office",
    readTime: "3 min read",
    commonMistakes: [
      "Assuming one office handles every level of education.",
      "Leaving out the name or location of the school.",
      "Sending sensitive information about a child unnecessarily.",
    ],
    steps: [
      "Write down the school or service and where it is located.",
      "Ask your county or sub-county education office who handles the matter.",
      "Confirm what information is needed before sharing personal details.",
    ],
  },
  {
    slug: "waste-collection-enquiry",
    name: "Waste collection enquiry",
    category: "waste-and-environment",
    summary:
      "Find an office to ask about local waste collection or an environmental concern.",
    overview:
      "Waste collection arrangements vary by area and may involve a county office or a contracted provider. Ask locally about collection schedules, missed collection and safe disposal.",
    documents: [
      "Location or nearest landmark",
      "Description of the waste or collection concern",
      "Collection account or provider details, if applicable",
    ],
    time: "Response times vary",
    officeType: "County department",
    guideTitle: "Asking about waste collection",
    readTime: "3 min read",
    commonMistakes: [
      "Leaving out the collection location.",
      "Handling hazardous waste yourself.",
      "Assuming collection schedules are the same across a county.",
    ],
    steps: [
      "Note your location and the issue or question.",
      "Find out whether the county or a local provider serves your area.",
      "Ask for current collection arrangements and safe disposal guidance.",
    ],
  },
  {
    slug: "social-support-enquiry",
    name: "Community support enquiry",
    category: "social-services",
    summary:
      "Find out which local office may help with a community or social support question.",
    overview:
      "Social support programmes have different eligibility criteria and may be run by county or national offices. A local social services office can help you find the appropriate contact.",
    documents: [
      "Identification document, if requested by the office",
      "Your location and contact information",
      "A short description of the support you are seeking",
    ],
    time: "Varies by programme",
    officeType: "Sub-county office",
    guideTitle: "Starting a social support enquiry",
    readTime: "4 min read",
    commonMistakes: [
      "Assuming all programmes have the same eligibility requirements.",
      "Sending sensitive details before confirming they are needed.",
      "Paying someone who promises guaranteed access to support.",
    ],
    steps: [
      "Describe the kind of support you need in general terms.",
      "Ask the local office which programmes are available and who qualifies.",
      "Confirm the documents and application process directly with the office.",
    ],
  },
  {
    slug: "sanitation-enquiry",
    name: "Sanitation and drainage enquiry",
    category: "water-and-sanitation",
    summary:
      "Find a contact for a sanitation or drainage concern in your area.",
    overview:
      "Sanitation and drainage responsibilities differ between locations. Ask your county or local provider which team can advise on the issue.",
    documents: [
      "Location and nearest landmark",
      "A description of the concern",
      "Date first noticed, if known",
    ],
    time: "Response times vary",
    officeType: "County department",
    guideTitle: "Preparing a sanitation enquiry",
    readTime: "3 min read",
    commonMistakes: [
      "Not including the exact location.",
      "Entering an unsafe or contaminated area.",
      "Assuming the same office handles all drainage issues.",
    ],
    steps: [
      "Make a note of the location and the issue.",
      "Keep a safe distance from any hazard.",
      "Contact the county or provider to confirm who is responsible.",
    ],
  },
  {
    slug: "parking-enquiry",
    name: "County parking enquiry",
    category: "roads-and-transport",
    summary: "Find a starting point for a parking or local transport question.",
    overview:
      "County parking rules and payment channels can change. Contact the relevant county office for the current requirements in the location you are visiting.",
    documents: [
      "Vehicle registration, if relevant",
      "Parking location",
      "Receipt or previous correspondence, if relevant",
    ],
    time: "Varies by county",
    officeType: "County department",
    guideTitle: "Before you ask about county parking",
    readTime: "3 min read",
    commonMistakes: [
      "Paying through an unverified channel.",
      "Leaving out the parking location.",
      "Assuming rates are the same in every area.",
    ],
    steps: [
      "Note the parking area and the nature of your question.",
      "Confirm the current process with the county office.",
      "Keep any official receipt or reference number.",
    ],
  },
  {
    slug: "building-approval-enquiry",
    name: "Building approval enquiry",
    category: "land-and-housing",
    summary:
      "Ask about planning and building approval requirements in your county.",
    overview:
      "Building and planning approval requirements depend on the project and the county. Contact the county planning office before starting work to understand the current process.",
    documents: [
      "Property or plot details",
      "Description of the proposed work",
      "Any existing plans or correspondence",
      "Identification, if requested",
    ],
    time: "Varies by project",
    officeType: "County department",
    guideTitle: "Starting a building approval enquiry",
    readTime: "4 min read",
    commonMistakes: [
      "Starting work before checking local approval requirements.",
      "Assuming an old fee schedule is current.",
      "Submitting original documents without checking the process.",
    ],
    steps: [
      "Write down the location and intended work.",
      "Ask the planning office which approvals apply.",
      "Confirm the necessary plans, fees and submission method with the office.",
    ],
  },
  {
    slug: "permit-renewal-enquiry",
    name: "Permit renewal enquiry",
    category: "business-permits",
    summary:
      "Prepare the details you may need to ask about renewing a business permit.",
    overview:
      "Renewal requirements and dates can differ by county. Ask the trade or revenue office what applies to your business and confirm payment through an official channel.",
    documents: [
      "Previous permit, if available",
      "Business name and registration details",
      "Business location",
      "Identification document, if requested",
    ],
    time: "Varies by county",
    officeType: "County department",
    guideTitle: "Preparing for a permit renewal",
    readTime: "3 min read",
    commonMistakes: [
      "Assuming a previous permit automatically renews.",
      "Using an unverified payment channel.",
      "Not checking whether your business details have changed.",
    ],
    steps: [
      "Find your previous permit and business details.",
      "Ask the county which renewal process applies.",
      "Verify the current fee and payment channel before paying.",
    ],
  },
];

export type Office = {
  slug: string;
  name: string;
  county: string;
  type: (typeof officeTypes)[number];
  address: string;
  phone: string;
  email: string;
  hours: string;
  directions: string;
  source: string;
};

export const offices: Office[] = [
  {
    slug: "nairobi-general-enquiries",
    name: "Nairobi County general enquiries",
    county: "Nairobi",
    type: "Other",
    address: "Nairobi City Hall, City Hall Way, Nairobi",
    phone: "+254 725 624 489",
    email: "info@nairobi.go.ke",
    hours: "Confirm with the office",
    directions:
      "Ask for the department responsible for your service when you contact the county.",
    source: "https://nairobi.go.ke/contacts",
  },
  {
    slug: "mombasa-general-enquiries",
    name: "Mombasa County general enquiries",
    county: "Mombasa",
    type: "Other",
    address:
      "Mombasa County offices, Mombasa. Confirm the service location before visiting.",
    phone: "1599",
    email: "info@mombasa.go.ke",
    hours: "Monday to Friday, 7:45 am to 4:30 pm. Confirm before visiting.",
    directions:
      "Contact the county first to confirm the right office and physical location.",
    source: "https://web.mombasa.go.ke/contact-us/",
  },
  {
    slug: "kisumu-general-enquiries",
    name: "Kisumu County general enquiries",
    county: "Kisumu",
    type: "Other",
    address: "Prosperity House, former Nyanza Provincial Headquarters, Kisumu",
    phone: "057 202 5366",
    email: "info@kisumu.go.ke",
    hours: "Confirm with the office",
    directions:
      "Ask the county to confirm the department and entrance before your visit.",
    source: "https://www.kisumu.go.ke/contact-us/",
  },
  {
    slug: "nakuru-general-enquiries",
    name: "Nakuru County general enquiries",
    county: "Nakuru",
    type: "Other",
    address: "P37C+P6, Biashara Moi, Nakuru",
    phone: "051 221 4142",
    email: "info@nakuru.go.ke",
    hours: "Monday to Friday, 8:00 am to 5:00 pm. Confirm before visiting.",
    directions:
      "Ask for the department that handles your enquiry before travelling.",
    source: "https://www.nakuru.go.ke/contact-us/",
  },
  {
    slug: "kiambu-general-enquiries",
    name: "Kiambu County general enquiries",
    county: "Kiambu",
    type: "Other",
    address:
      "Kiambu County, Kiambu. Confirm the physical office before visiting.",
    phone: "0742 000 888",
    email: "info@kiambu.go.ke",
    hours: "Confirm with the office",
    directions:
      "Call the county hotline to ask for the relevant office and directions.",
    source: "https://kiambu.go.ke/contacts/",
  },
  {
    slug: "uasin-gishu-general-enquiries",
    name: "Uasin Gishu County general enquiries",
    county: "Uasin Gishu",
    type: "Other",
    address:
      "County Government headquarters, Eldoret. Confirm before visiting.",
    phone: "053 201 6000",
    email: "info@uasingishu.go.ke",
    hours: "Confirm with the office",
    directions:
      "Contact the county to confirm the appropriate department and directions.",
    source: "https://uasingishu.go.ke/index.php/contact",
  },
];

export const getCategory = (slug: string) =>
  categories.find((item) => item.slug === slug);
export const getService = (slug: string) =>
  services.find((item) => item.slug === slug);
export const getOffice = (slug: string) =>
  offices.find((item) => item.slug === slug);
export const disclaimer =
  "Samuel Civic is an independent information and request-tracking tool. It is not an official county or national government website. Always verify fees, documents, and procedures with the relevant office.";
const whatsappDigits = (
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "254112272061"
).replace(/\D/g, "");
export const whatsappNumber = /^\d{10,15}$/.test(whatsappDigits)
  ? whatsappDigits
  : "254112272061";
export const whatsappDisplay =
  whatsappNumber === "254112272061" ? "+254 112 272 061" : `+${whatsappNumber}`;
export const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hi%20Samuel%20Civic%2C%20I%20need%20help%20finding%20a%20county%20service`;
