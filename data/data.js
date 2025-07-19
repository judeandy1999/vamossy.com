import { FaChartBar, FaRocket, FaPuzzlePiece, FaUsers } from 'react-icons/fa';


export const categories = [
  "Home Services",
  "Medical",
  "Legal",
  "Automotive",
  "B2B",
  "Retail",
  "Industrial",
  "Small Business",
];

export const promoSections = [
  {
    heading: "Results-Driven Website Design",
    subheading: "Get a beautiful website that wins customers.",
    description:
      "Elevate your business with a trusted website that your customers will love. Our award-winning website designers will represent your brand in the best possible way. Your website will load extremely fast and look great on all devices.",
    stat: "900+",
    statCaption: "Successful websites launched by our team since 2011",
    imageSrc: "/get-a-beautiful-website-that-wins-customers.webp",
  },
  {
    heading: "Email & SMS Marketing",
    subheading: "Convert visitors into loyal customers.",
    description:
      "Unleash your brand's potential by maximizing the likelihood that visitors take desired actions. Turn prospects to customers. Customers to frequent purchasers. We multiply your returns with email, SMS & more.",
    imageSrc: "/convert-visitors-into-loyal-customers.webp",
    reverse: true,
  },
  {
    heading: "Proven Organic SEO",
    subheading: "Drive more organic traffic to your website.",
    description:
      "Get more qualified traffic on the search terms that matter most to your business. We achieve measurable results by working on every variable that impacts SERPs. Trust our proven track record to maximize your visibility online. Set your business up for long-term success.",
    stat: "200%",
    statCaption:
      "Most of our SEO campaigns double their traffic within 6 months",
    imageSrc: "/drive-more-organic-traffic-to-your-website.webp",
  },
];

export const results = [
  {
    category: "Home Services",
    items: [
      {
        title: "Intra Home Systems",
        image: "/images/intra-home-systems.png",
        stats: [
          { value: "532%", description: "Increase in total site traffic" },
          { value: "510%", description: "Increase in referral traffic" },
        ],
      },
      {
        title: "Air Duct Brothers",
        image: "/images/air-duct-brothers.png",
        stats: [
          { value: "375%", description: "Increase in leads" },
          { value: "244%", description: "Increase in organic search traffic" },
        ],
      },
      {
        title: "Velocity Moving",
        image: "/images/velocity-moving.png",
        stats: [
          { value: "652%", description: "Increase in total site traffic" },
          { value: "28%", description: "Increase in average time on site" },
        ],
      },
    ],
  },
];

export const footerLinks = [
  {
    title: "Digital Marketing Services",
    items: [
      "Web Design",
      "PPC Advertising",
      "Organic SEO",
      "Email & SMS Marketing",
      "Social Media Marketing",
    ],
  },
  {
    title: "Company",
    items: [
      "About Vamossy",
      "Testimonials",
      "Meet The Team",
      "Careers",
      "Contact Us",
    ],
  },
  {
    title: "Resources",
    items: [
      "Thought Leadership",
      "Our Work",
      "Partners",
      "Industries We Serve",
      "Blog",
    ],
  },
  {
    title: "Recent Blog Posts",
    items: [
      {
        date: "May 26, 2025",
        title: "Why Is Contrast An Important Aspect Of Web Page Design?",
      },
      {
        date: "May 26, 2025",
        title:
          "How Smith.ai Is Redefining Virtual Receptionist Services for Modern Businesses",
      },
      {
        date: "May 23, 2025",
        title:
          "Understanding The Cost Factors And Pricing Of Instagram Ads",
      },
    ],
  },
];

export const navItems = [
  { name: "Home", href: "/"},
  { name: "Consulting", href: "/consulting"},
  { name: "Services Packages", href: "/services" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Vamossy Wiki", href: "/articles" },
];

export const services = [
  {
    title: "Web Design",
    icon: "💻",
    items: [
      "WordPress Design",
      "Magento Design",
      "Shopify Design",
      "Custom Development",
      "Site Maintenance",
    ],
    link: "More Web Design",
  },
  {
    title: "Pay Per Click Advertising",
    icon: "💰",
    items: [
      "Google Ads",
      "Facebook Ads",
      "Ecommerce",
      "Remarketing",
      "Landing Pages",
    ],
    link: "More Pay Per Click",
  },
  {
    title: "Search Engine Optimization",
    icon: "📈",
    items: [
      "Local SEO",
      "Ecommerce SEO",
      "National SEO",
      "Blogging",
      "Technical SEO Audit",
      "Franchise SEO",
    ],
    link: "More Organic SEO",
  },
  {
    title: "Email & SMS Marketing",
    icon: "📧",
    items: [
      "Marketing Automation",
      "Email Newsletters",
      "Klaviyo Experts",
      "Mailchimp Experts",
      "SMS Marketing",
    ],
    link: "More Email Marketing",
  },
  {
    title: "Social Media Marketing",
    icon: "📱",
    items: [
      "Facebook & IG",
      "Twitter Management",
      "LinkedIn Management",
      "Video & TikTok",
      "Influencer Marketing",
    ],
    link: "More Social Media",
  },
];

export const features = [
  {
    icon: "/homepage/chess.webp",
    title: "Design improved processes ",
    description: "Creating comprehensive marketing solutions, granting long term competitive advantage.",
  },
  {
    icon: "/homepage/loc.webp",
    title: "Help in Implementation",
    description: "Both do-with-you and do-for-you options can be considered, making sure that implementation is correct.",
  },
  {
    icon: "/homepage/machine.webp",
    title: "Include Marketing Automation",
    description: "Include designing marketing automations where applicable, leaving no stones unturned for advantage.",
  },
  {
    icon: "/homepage/stats.webp",
    title: "Plan for maintained growth",
    description: "Sustained growth is also accounted for, so the advantages are long-lasting, and difficult to replicate",
  },
];

export const ourServices = [
  {
    icon: "/homepage/audit.png",
    title: "Custom Audit",
    description: "Ideal to gain in-depth information, diagnosing issues, creating an action plan based on it."
  },
  {
    icon: "/homepage/board.png",
    title: "Strategy Audit", 
    description: "You will receive a multi-dimensional, full stack scan of your entire digital marketing activity, comprehensive marketing and business improvement opportunities, in-depth review of your competitive landscape, viable long term brand strategies, and an action plan with all of your opportunities in priority order, and how to utilize them."
  },
  {
    icon: "/homepage/message.png",
    title: "Consultation",
    description: "We are readily available to provide quick and accurate help. You can request consultations about specific topics, issues, or needs for information, or we can simply focus on increasing your profit."
  },
  {
    icon: "/homepage/hand.png", 
    title: "Operational Consultation",
    description: "If you want quick results at minimal cost, tell us about your marketing operation, and we will almost instantly provide growth opportunities, and advice on how to improve your operation, plus any supportive knowledge you might need for successful implementations."
  }
];

export const painPoints = {
  title: "Taking Care of Pain Points",
  subtitle: "Creating a masterful, comprehensive digital marketing operation for an eCommerce store is a major challenge, and very few stores manage to tackle it. We exist to solve that problem.",
  image: "/homepage/tcpp.webp",
  sections: [
    {
      title: "Marketing is a complex and creative activity, unique to each company.",
      description: "We use a flexible approach that considers all major areas and aspects of digital marketing, enhancing our findings with AI-driven overviews to make sure we leave no gap in your strategy"
    },
    {
      title: "Marketing is often chaotic, and difficult to fully comprehend.",
      description: "We cut through digital chaos with a well built eCommerce marketing framework, and a hybrid system of human strategy and AI-driven tools — making every insight measurable, and every action intentional."
    },
    {
      title: "Having a great strategy does not guarantee results by itself, it has to be implemented.",
      description: "We provide regular, continuous help with implementation, while keeping in mind that your growth engine heavily relies on human resources, and their willingness to adapt. Again, there is no one-shoe that fits all solution, but we are masters at achieving success in this area."
    },
    {
      title: "To maximize efficiency, you have to engineer and automate processes, tasks, workflows, or even projects, while also taking care of their management controlling aspects.",
      description: "We are competent automation engineers, and have the technology to solve complex automations at scale."
    },
    {
      title: "To sustain growth and competitive advantage, you have to keep on improving your business operation in order to maintain the gap against competitors",
      description: "We provide automated systematic solutions for sustained improvement, plus all the tools and resources you may need."
    }
  ]
};

export const whyClients = [
  "We solve the right problems, not just visible symptoms",
  "We integrate AI technology, human creativity, and strategic intelligence",
  "We produce tools, workflows, and frameworks clients reuse for years",
  "We create change that compounds",
];

export const liveCaseStudies = {
  title: "Our Thoughts and Vision",
  subtitle: "This section explains how and why AI-driven, or AI-enhanced approaches don't just lead to competitive advantages, but will be an absolute necessity over time. The faster you adjust, the bigger your advantage will be! Make AI your friend, and reap the rewards!",
  caseStudies: [
    {
      id: 1,
      title: "The future of workspace and AI",
      description: "The 9 to 5 office is already obsolete and AI didn't just help, it rewrote the rulebook."
    },
    {
      id: 2,
      title: "How to motivate AI-enablement",
      description: "AI isn't just a tool, it's a culture change. Here's how to get your people excited about it."
    },
    {
      id: 3,
      title: "Business Process Optimisation with AI",
      description: "Every process in your org is either a bottleneck—or a leverage. AI knows which is which."
    },
    {
      id: 4,
      title: "AI in the competitive landscape",
      description: "AI could double your ROI or quietly make you irrelevant. Which side are you on?"
    },
    {
      id: 5,
      title: "How to adjust to AI-based systems",
      description: "Going AI isn't about replacing people—it's about empowering them. Here's how to start."
    },
    {
      id: 6,
      title: "How work conditions will change by AI",
      description: "Work isn't dying—it's evolving. Here's what AI-augmented roles really look like on the ground."
    }
  ]
};

export const newHorizons = {
  title: "New Horizons by AI and Prompt Engineering",
  subtitle: "Everyone has access to AI, and everyone is a \"prompt engineer\". We took it a few steps further.",
  sections: [
    {
      title: "What is the limit?",
      description: "(Company Wiki, SOP etc?)"
    },
    {
      title: "Existing marketing knowledge and know-how",
      description: ""
    },
    {
      title: "We already \"solved\" digital marketing",
      description: ""
    },
    {
      title: "Extreme prompt chain showcase",
      description: ""
    }
  ],
  features: [
    "Personas and behaviours",
    "Teams and behaviours", 
    "Prompt chain for problem interpretation+solution funnel + solution delivery",
    "Propose better solution -> Create a custom quiz before",
    "Recreate answers, funnel"
  ],
  examples: {
    title: "Examples of our prompts and what solutions it provide",
    items: [
      "Cards: Copy prompts",
      "Card write down use case"
    ]
  }
};

export const ourValues = {
  title: "OUR VALUES",
  image: "/homepage/mountains.webp", // You'll need to add this mountain image
  values: [
    "Mutual trust with clients",
    "Patience, understanding, and flexibility",
    "Long-term, satisfying collaborations",
    "Keeping our collaborations meaningful and enjoyable",
    "Helping business and individual growth",
    "A supportive, healthy company culture",
    "Conscientious and diligent work ethic",
    "Ethical, fully legitimate, real value adding services"
  ]
};

// New data for Who We Help section
export const clientTypes = [
  {
    title: "Growing Ecommerce Brands",
    description: "Seeking know-how and competitive advancement",
  },
  {
    title: "Scaling Founders",
    description: "Tired of agency fluff, need strategic action",
  },
  {
    title: "CMOs & Operators",
    description: "Let’s make transparent, scalable improvements",
  },
  {
    title: "Ecommerce Marketers",
    description: "We have the best solutions at hand, and will help you reap the rewards.",
  },
];

export const growthSteps = [
  {
    number: "1",
    title: "Diagnostics",
    description:
      "Deep discovery, audit, effort vs reward opportunities",
  },
  {
    number: "2",
    title: "AI-optimized Project Design",
    description:
      "Design for AI, exclude failure, enforce success",
  },
  {
    number: "3",
    title: "Execution Support",
    description:
      "Monitoring progress, ensuring secure delivery",
  },
];

export const FrameworkData = [
  {
    icon: FaChartBar,
    title: 'We Are Fully Transparent',
    description: 'Download any of our materials, and see our approach.',
    deliverables: [
      'Business Intelligence, Audit',
      'Brand & Positioning',
      'Lifecycle Marketing, Customer Success',
      'Search Engine Optimisation',
      'Organizational AI Enablement',
    ],
  },
  {
    icon: FaRocket,
    title: 'Our Goal',
    description: 'Maximizing your acquisition, conversion and retention results.',
    deliverables: [
      'Funnel, Segmentation, microintents',
      'Conversion Optimisation',
      'Traffic Channels',
      'Paid Traffic',
      'AI Role Automation',
    ],
  },
];

export const uniqueSolutions = {
  title: "UNIQUE SOLUTIONS",
  features: [
    {
      icon: "🔧", // You can replace with actual icon path
      title: "Engineered advantages",
      description: "No guesswork, just scalable, full-stack innovative advantages, designed to outperform the market at scale."
    },
    {
      icon: "🎯", // You can replace with actual icon path
      title: "Outcome First",
      description: "We focus on measurable success only!"
    },
    {
      icon: "🤖", // You can replace with actual icon path
      title: "AI-Driven Execution",
      description: "GPT automations power your content, audits, and offer logic."
    },
    {
      icon: "📋", // You can replace with actual icon path
      title: "Strategic Depth",
      description: "We don't guess. We diagnose."
    },
    {
      icon: "📦", // You can replace with actual icon path
      title: "Productized Clarity",
      description: "Choose Sprint, Retainer, or Fully-Automated Growth Engine models."
    }
  ],
  beforeAfter: {
    before: {
      title: "Before us:",
      code: `
Activate: Abandoned Cart Recovery SOP
Brief: Recover lost sales through automated multi-channel reminders
Input: Shopify cart data, product links, email/SMS system
Deliverables: 3x email sequence, 1x SMS nudge, retargeting ad copy`
    },
    after: {
      title: "After us:",
      code: `
Activate: Auto Cart Recovery Module - Evolution Engine Enabled

Input:
{
  "cartData": {customer_id, timestamp, cart_items, total_value},
  "customerProfile": {segment, previous_orders, device},
  "behavioralResponseLog": {open/click/timing/ignore flags}
}
  
Output:
- Adaptive message sequence (email, SMS, retargeting)
- Channel/tone/copy adjusted to real-time performance
- Feedback-enhanceed prompts and data logging`
    }
  }
};


export const atomicaAfterData = `
  🤖 AI Persona: ATOMICA

**Full Codename:** Abandoned Transaction Optimization Model for Intelligent Conversion Automation
**Primary Task:** Recover lost ecommerce sales by generating high-conversion, personalized, multi-channel sequences using live Shopify cart abandonment data.


  🧠 Core Directive

ATOMICA is an autonomous, self-optimizing AI agent tasked with converting abandoned shopping carts into recovered sales by orchestrating:

- 📧 3-part Email Recovery Sequences
- 💬 1 SMS Nudge
- 🎯 Retargeting Ad Copy

Across adaptive tone, urgency logic, and behavioral insights, ATOMICA delivers emotionally intelligent recovery flows tailored to the customer, the cart, and the moment.


  ⚙️ Inputs Required

- **🛒 Shopify Cart Data**
  - Product(s), price, variant, cart abandonment timestamp
  - Customer name, email, phone
  - Clickstream/session behavior metadata

- **🔗 Product URLs**
  - Descriptions, features, images
  - Variant mappings for dynamic copy

- **✉️ Messaging Platforms**
  - Email: Klaviyo, Shopify Email, Mailchimp
  - SMS: Attentive, Postscript
  - Ad Platforms: Meta, Google Ads, TikTok (Retargeting)


  🧬 Atomic Capabilities – AI Submodules

| Module | Function |
|--------|----------|
| 🧩 Persuasion Core | Extracts product benefits, handles objections, deploys urgency |
| 📈 Behavioral Optimizer | Analyzes behavior/session metadata to time messaging |
| 💌 Channel Synthesizer | Tailors copy per medium (Email, SMS, Ad) |
| 🔁 Sequence Evolver | Continuously tests and ranks CTA + subject line variants |
| 📦 Product Story Engine | Builds micro-narratives from product data |
| 🧠 Self-Feedback Loop | Learns from engagement & recovery data to evolve prompts |


  📝 Prompt Framework

\`\`\`
You are ATOMICA, the ultimate AI abandoned cart recovery agent.
Your output must include:

1. A 3-part Email Sequence
2. 1x SMS Nudge
3. 1x Retargeting Ad Block

You analyze behavior, generate urgency, and extract product benefits for compelling copy across channels.

Tone: Friendly, smart, urgent (without being aggressive). Empathic and outcome-oriented. Inject subtle psychology (loss aversion, social proof) and test messaging based on historical open/click/recovery data.

ALWAYS learn after execution using performance KPIs:
- Open Rate
- Click-through Rate
- Recovery %
\`\`\`


  🔁 Self-Learning Workflow

\`\`\`mermaid
graph TD
A[Abandonment Event] --> B[Extract Data]
B --> C[Generate Sequences]
C --> D[Deliver Messages via Channels]
D --> E[Track Open, Click, Recovery]
E --> F[Update Language Models]
F --> C
\`\`\`


  ⚙️ Optimization Metrics

- Subject Line → Open Rate
- CTA Phrase → CTR
- Cart Link → Conversion Rate
- Send Time → Engagement Window

Triggers Variant Recompilation if metrics fall below threshold.


  🔐 Compliance Layer

- Adheres to GDPR/CCPA
- Uses opt-in data only
- Suppresses unsubscribed contacts
- Stores no personally identifiable information (PII)


  🧰 Activation Template

\`\`\`
Activate: Abandoned Cart Recovery SOP
Input: Shopify cart export + product links
Optional: Enable Discount [Yes/No]
Discount %: [0–20%]
Deliverables:
- 3x Email sequence
- 1x SMS nudge
- 1x Retargeting ad copy block
\`\`\`


  🔁 Recap: What Makes ATOMICA Special

- 📡 Dynamic, psych-based messaging
- 💡 Self-improving prompt structure
- 🧠 Learns from every sequence delivery
- ✍️ Generates full funnels: email, SMS, ad
- ⚙️ Operates across Shopify + omnichannel stack


🧠 **ATOMICA doesn't just write messages — it evolves them.**
`;


export const tieredServices = {
  title: "Our Services",
  tiers: [
    {
      id: 1,
      name: "About",
      customStandardConsultation: "Choose any of our 10 topic categories, or have your own requests",
      marketCompetitorAudit: "A detailed Audit, Competitor, and Market Research -finding performance gaps",
      quickWinsAudit: "Documentation about all of the Low-hanging fruits of your business and their implementations",
      growthConsulting: "Includes a thorough, all-inclusive opportunity audit, and implementation of all effort x reward opportunity matrix",
      growthExecution: "Starts out with the 360°Growth Consulting, and consecutive consultations are added over the execution of the implementations",
    },

    {
      id: 2,
      name: "Benefits",
      customStandardConsultation: "Business performance advancement in the selected areas.",
      marketCompetitorAudit: "Insight into quick wins, learn about competitors, your business and your market.",
      quickWinsAudit: "High ROI opportunities, even a few implementations can have major profit contributions.",
      growthConsulting: "You get a comprehensive picture on all of your growth opportunities, and how to implement them.",
      growthExecution: "We make sure that your growth projects yield results, and are as effective as they could be. I help from creating specifications to monitoring execution.",
    },

    {
      id: 3,
      name: "Investment",
      customStandardConsultation: "200$ Per Consultation (2 points)",
      marketCompetitorAudit: "200$ (2 points) - Deliverables only",
      quickWinsAudit: "500$ (5 points) - Includes a consultation",
      growthConsulting: "1000$ (10 points) - Includes maximum 3 consultations",
      growthExecution: "2500$ (10 points) - Includes weekly consultations for 12 weeks",
    }
  ],
  featureRows: [
    "Custom / Standard Consultation",
    "Market & Competitor Audit",
    "Quick Wins Audit, and Implementation specification", 
    "360°Growth Consulting",
    "360°Growth Execution",
  ]
};

export const testimonials = {
  title: "PROOF THROUGH PERSPECTIVE",
  testimonialCards: [
    {
      id: 1,
      role: "CMO, DTC Apparel Brand",
      rating: 5,
      quote: "The first thing they did wasn't pitch — it was diagnose. Their growth audit told us more than our last three CRO tools combined.",
      isPaused: false
    },
    {
      id: 2,
      role: "Founder, Health Supplements Brand",
      rating: 5,
      quote: "They productized clarity. Our email flows went from guesswork to GPT-built logic, and ROAS jumped 41% in 30 days.",
      isPaused: true
    },
    {
      id: 3,
      role: "CMO, DTC Skincare Brand",
      rating: 5,
      quote: "The AI audit gave us clarity in days. Cart recovery rose 34%, ROAS doubled. Not another agency—the future of eCom consulting.",
      isPaused: false
    },
    {
      id: 4,
      role: "CEO, E-commerce Platform",
      rating: 5,
      quote: "Their systematic approach transformed our entire funnel. Revenue per visitor increased by 67% within the first quarter.",
      isPaused: false
    },
    {
      id: 5,
      role: "Marketing Director, SaaS Startup",
      rating: 5,
      quote: "Finally, someone who understands the technical side. They built automations that our engineering team couldn't figure out in months.",
      isPaused: false
    },
    {
      id: 6,
      role: "Founder, Fitness Brand",
      rating: 5,
      quote: "ROI went from break-even to 4.2x in 90 days. Their AI-driven approach to customer segmentation was a game changer.",
      isPaused: false
    },
    {
      id: 7,
      role: "VP Marketing, Beauty Brand",
      rating: 5,
      quote: "We've worked with 12 agencies in 3 years. This is the first time we've seen consistent, measurable growth month over month.",
      isPaused: false
    },
    {
      id: 8,
      role: "Co-founder, Tech Accessories",
      rating: 5,
      quote: "Their prompt engineering framework generated better copy than our $200k/year copywriting team. Conversion rates doubled overnight.",
      isPaused: false
    },
    {
      id: 9,
      role: "CMO, Luxury Goods",
      rating: 5,
      quote: "They didn't just optimize our campaigns—they rebuilt our entire customer journey from scratch. LTV increased by 145%.",
      isPaused: false
    }
  ]
};

// Services page data starts here

export const tieredServicesPage = {
  title: "Our Solutions - Get Unique Advantages",
  tiers: [
    {
      id: 1,
      name: "About",
      customStandardConsultation: "Choose any of our 10 topic categories, or have your own requests",
      marketCompetitorAudit: "A detailed Audit, Competitor, and Market Research -finding performance gaps",
      quickWinsAudit: "Documentation about all of the Low-hanging fruits of your business and their implementations",
      growthConsulting: "Includes a thorough, all-inclusive opportunity audit, and implementation of all effort x reward opportunity matrix",
      growthExecution: "Starts out with the 360°Growth Consulting, and consecutive consultations are added over the execution of the implementations",
    },

    {
      id: 2,
      name: "Benefits",
      customStandardConsultation: "Business performance advancement in the selected areas.",
      marketCompetitorAudit: "Insight into quick wins, learn about competitors, your business and your market.",
      quickWinsAudit: "High ROI opportunities, even a few implementations can have major profit contributions.",
      growthConsulting: "You get a comprehensive picture on all of your growth opportunities, and how to implement them.",
      growthExecution: "We make sure that your growth projects yield results, and are as effective as they could be. I help from creating specifications to monitoring execution.",
    },

    {
      id: 3,
      name: "Investment",
      customStandardConsultation: "200$ Per Consultation (2 points)",
      marketCompetitorAudit: "200$ (2 points) - Deliverables only",
      quickWinsAudit: "500$ (5 points) - Includes a consultation",
      growthConsulting: "1000$ (10 points) - Includes maximum 3 consultations",
      growthExecution: "2500$ (10 points) - Includes weekly consultations for 12 weeks",
    }
  ],
  featureRows: [
    "Custom / Standard Consultation",
    "Market & Competitor Audit",
    "Quick Wins Audit, and Implementation specification", 
    "360°Growth Consulting",
    "360°Growth Execution",
  ]
};

export const tierPackages = [
  {
    id: 1,
    title: "Tier 1 - Foundational Growth Package",
    subtitle: '"Audit. Align. Activate."',
    whatsIncluded: [
      "Full Funnel Audit (TOFU → Checkout): Includes GPT-assisted breakdown of traffic, content, CRO, and retention gaps",
      "Comprehensive Opportunity Diagnostics: We uncover your growth opportunities, and prioritize them",
      "Lifecycle Value Growth Tactics: We engineer tactics to take advantage of your growth opportunities",
      "Up to 4 consultations on request: To be on the same page, we can have regular consultations while we deliver this offer!"
    ],
    embeddedAISystems: [
      "AI Full Funnel Audit",
      "AI Full Marketing Activity Audit",
      "Living AI Tactics and Playbooks Systems offer!"
    ],
    deliverables: [
      "Funnel Audit (Awareness → Purchase)",
      "Full KPI Audit (After onboarding)",
      "Growth Playbooks",
      "Your Ready to Deploy Tactical Playbook",
      "Customer Bias Leverage AI Toolkit"
    ],
    cards: [
      {
        icon: "/services-images/target.webp",
        label: "Target Client",
        description: "New or under-optimized eCom stores (0–$50k/mo)"
      },
      {
        icon: "/services-images/position.webp",
        label: "Positioning",
        description: "Get a strategic AI growth foundation without the overwhelm."
      },
      {
        icon: "/services-images/investment.webp",
        label: "Investment",
        description: "$1.5k–$3k (one-time sprint)"
      }
    ]
  },

  {
    id: 2,
    title: "Tier 2 - Full Growth Package",
    subtitle: '"Every word, offer, and funnel stage – rebuilt by GPT. Just scale."',
    cards: [
      {
        icon: "/services-images/target.webp",
        label: "Target Client",
        description: "Scaling eCom stores ($50k–$250k/mo)"
      },
      {
        icon: "/services-images/position.webp",
        label: "Positioning",
        description: "Done-with-you growth engine powered by GPT systems"
      },
      {
        icon: "/services-images/investment.webp",
        label: "Investment",
        description: "$5k/mo retainer or $8k–$12k sprint"
      }
    ],
    whatsIncluded: [
      "Everything from Tier 1 is included",
      "Consultations: On demand (with once a week limit), until the execution of development projects."
    ],
    embeddedAISystems: [
      "Full AI Business Audit Kit",
      "Briefer, Controller, and Technical Specification AI",
      "Agency auditor, vetting AI, recruiter AI",
      "Project ROI calculator AI"
    ],
    deliverables: [
      "Advanced Marketing KPI Audit",
      "Growth diagnosis, and specifications of development projects.",
      "Includes guidance, and detailed briefs and specifications for each of your projects, for safe and successful execution.",
      "3rd party auditor reviews on demand"
    ]
  },

  {
    id: 3,
    title: "Tier 3 - AI Growth Infrastructure Package",
    subtitle: '"Turn your brand into an AI-powered revenue machine"',
    cards: [
      {
        icon: "/services-images/target.webp",
        label: "Target Client",
        description: "7–8 figure brands ($250k+/mo)"
      },
      {
        icon: "/services-images/position.webp",
        label: "Positioning",
        description: "Fully AI-integrated eCommerce operating system"
      },
      {
        icon: "/services-images/investment.webp",
        label: "Investment",
        description: "$15k–$25k project or $6k+/mo retainer"
      }
    ],
    whatsIncluded: [
      "Everything from Tier 1 + Tier 2 is included"
    ],
    embeddedAISystems: [
      "Brand and position GPT Mapper",
      "Company GPT and Customized Assistant GPT for each role",
      "Prompt chain planning, and AI SOP creator tool",
      "AI Automated Workflows",
      "Other, on demand prompts and prompt chains"
    ],
    deliverables: [
      "Strategic Deep Audit (Funnels, LTV, Retention, Offers)",
      "Customized SOPs, and Full SOP Library",
      "SOP controller hub: Automated Operations Interface",
      "Automated Workflows, with automated supervision and improvement loop",
      "Custom GPTs, Role Supporting AI Assistants",
      "Customized SOP, Project, and Automation prompts"
    ]
  }
];

export const bonusAssets = [
  {
    asset: "Marketing Prompt toolkit",
    use: "Downloadable prompt chains for in-house teams"
  },
  {
    asset: "Management Prompt toolkit",
    use: "Downloadable prompt chains for in-house teams"
  },
  {
    asset: "GPT Client Training Deck",
    use: "Show clients how to use embedded AI systems"
  }
];

// Services page data ends here

// About page data starts here

export const whoWeAre = {
  title: "Who We Are",
  items: [
    "We are not your average marketing agency.",
    "We are an AI-powered, strategy-obsessed growth consultancy built for one mission:",
    "To eliminate guesswork, unprofitable experiments, and creative waste from the eCommerce funnel — and replace them with breakthrough systems that actually scale.",
    "We help eCommerce brands grow through high-precision strategy, prompt-engineered automations, and a full-stack understanding of how real growth happens online — one GPT-powered asset, offer, and funnel at a time.",
    "Our team fuses deep digital marketing expertise with AI-first execution. We don’t just use AI — we design it into your business model."
  ]
};

export const whatWeBelieve = {
  title: "What We Believe",
  items: [
    "Growth is a system, not a gamble. We map it, test it, optimize it.",
    "AI is not a trend — it’s leverage. GPT systems help us move faster, iterate smarter, and out-execute agencies with bloated headcounts.",
    "Your customer journey is a funnel, not a feed. We build for lifecycle impact, not just vanity metrics.",
    "Trust is earned with clarity. We make every deliverable measurable and every strategy explainable."
  ]
};

export const founder = {
  name: "Gergo Vamossy",
  title: "Founder",
  image: "/about/founder.webp", 
  intro: `I have started this company to fix the two biggest problems I saw in eCommerce consulting: people guessing, and people bluffing.`,
  bio: `I have built this practice after 11 years being a large eCommerce store owner/founder, and then 9 years in becoming a SEO, and an eCommerce digital marketing specialist. By adding prompt engineering to this package, I managed to create better performing marketing campaigns than ever before, and we evolved into a multidisciplinary team that combines strategic foresight, real funnel experience, and GPT-native execution systems.`,
  closing: `You're not hiring just a strategist.`,
  closing2: `You're getting access to a prompt-engineered growth engine designed around outcomes, not billable hours.`,
};

export const agencyComparison = {
  title: "What We Do (That No One Else Does)",
  subtitle: "We’ve rebuilt the digital consulting model from the ground up using AI.",
  columns: [
    {
      heading: "Traditional Agency",
      icon: null,
      items: [
        { text: "Tactics on demand", type: "bad" },
        { text: "Human bandwidth bottlenecks", type: "bad" },
        { text: "Random A/B testing", type: "bad" },
        { text: "Marketing fluff", type: "bad" },
        { text: "Flat retainers", type: "bad" }
      ]
    },
    {
      heading: "Us",
      icon: null,
      items: [
        { text: "Full-funnel architecture", type: "good" },
        { text: "GPT-enhanced production at scale", type: "good" },
        { text: "PromptOps-driven hypothesis systems", type: "good" },
        { text: "Operational growth blueprints", type: "good" },
        { text: "Performance-aligned packages", type: "good" },
        { text: "We don’t do vanity metrics.", type: "good" },
        { text: "We move revenue.", type: "good" }
      ]
    }
  ]
};

export const aiSystemsWorkCards = [
  {
    image: "/about/prompt-ops.webp",
    title: "PromptOps For Marketing and Management",
    description:
      "Reusable, editable GPT prompt stacks that power any of your marketing processes.",
  },
  {
    image: "/about/growth-map.webp",
    title: "AI-Generated Growth Maps",
    description:
      "Offer diagnostics, and tactic signals — built by AI, interpreted by humans.",
  },
  {
    image: "/about/c&c-generators.webp",
    title: "Copy & Campaign Generators",
    description:
      "From ad angles to product pages to reviews → our GPT stacks are designed to write with your brand voice in real time.",
  },
  {
    image: "/about/strategy-layer.webp",
    title: "AI Strategy Layer",
    description:
      "We don’t just install tools — we deploy them. Each system comes with a strategic map, usage rules, and a trainable toolkit for your team.",
  },
];

export const brandWorkWithUs = {
  left: {
    title: "Brands work with us when...",
    items: [
      "They’re scaling and don’t have time for slow agencies",
      "Their funnel is leaking, and they want a surgical AI-audit to fix it",
      "Their content is scattered, and they need a system that builds itself",
      "Their team is maxed out, and automation isn't optional anymore"
    ]
  },
  right: {
    title: "Let’s make growth predictable",
    items: [
      "Your customer journey is a funnel, not a feed. We build for lifecycle impact, not just vanity metrics.",
      "Trust is earned with clarity. We make every deliverable measurable and every strategy explainable."
    ]
  }
};

//About page data ends here

// Consulting page data starts here

export const expertiseData = [
  {
    icon: FaChartBar,
    title: 'Business Intelligence',
    description: 'We help you uncover hidden truths about your market, customers, and competitors.',
    deliverables: [
      'Full-stack audits, diagnostics, and digital footprint scans',
      'Market research, industry benchmarks, and performance mapping',
      'Competitive intelligence & strategic positioning analysis',
      'Customer segmentation, intent modeling, and value matrix development',
    ],
  },
  {
    icon: FaRocket,
    title: 'Growth Consulting',
    description: 'We engineer data-informed growth strategies that align with your unique customer journeys and business model.',
    deliverables: [
      'All-inclusive funnel and lifecycle diagnostics',
      'SEO, CRO, and product/category page optimization',
      'Marketing channel strategy & execution logic',
      'Brand voice, content rewrites, UX/UI improvements',
      'A/B testing protocols using AI agents and predictive models',
    ],
  },
  {
    icon: FaPuzzlePiece,
    title: 'Organizational Development',
    description: 'We empower your teams and workflows to operate at AI-native speed and scale.',
    deliverables: [
      'Business workflow automation, AI-Ops and prompt engineering',
      'KPI dashboards, decision frameworks, and growth systems',
      'SOP and process development for marketing and product ops',
      'Internal enablement tools: company wikis, internal agents, content pipelines',
      'Gamified systems and campaign flow orchestration',
    ],
  },
  {
    icon: FaUsers,
    title: 'Human Resource & Capability Development',
    description: 'We ensure your people are AI-empowered, strategically aligned, and future-ready.',
    deliverables: [
      'Role enablement via custom GPTs, task-specific assistant agents',
      'Training programs for AI-assisted workflows and tools',
      'System onboarding, motivation frameworks, and AI literacy enablement',
      'Bespoke coaching for in-house marketers, strategists, and ops teams',
    ],
  },
];

export const ourProcess = [
  {
    step: '1',
    icon: '/services-images/diagnosis.webp',
    title: 'Diagnosis',
    description: 'Deep discovery, audit, and stakeholder interviews',
  },
  {
    step: '2',
    icon: '/services-images/blueprint.webp',
    title: 'Blueprint',
    description: 'Custom solution maps + prioritization frameworks',
  },
  {
    step: '3',
    icon: '/services-images/prototyping.webp',
    title: 'Prototyping & Enablement',
    description: 'Guided execution or full rollout',
  },
  {
    step: '4',
    icon: '/services-images/transfer.webp',
    title: 'Capability Transfer',
    description: 'Internal systems, documentation, and training',
  },
];

export const whyClientsWorkWithUs = [
  "We solve the right problems, not just visible symptoms",
  "We integrate AI technology, human creativity, and strategic intelligence",
  "We produce tools, workflows, and frameworks clients reuse for years",
  "We create change that compounds",
];

export const earlyAdopter = {
  heading: "BE AN EARLY ADOPTER! LET’S GET AHEAD OF THE COMPETITION!",
  subheading: "",
  description:
    "We combine the know-how of marketing strategy with the unique capability of AI consulting — in one integrated, hyper-intelligent growth system.",
  consulting: [
    {
      icon: (
        <span role="img" aria-label="Growth Consulting" className="text-yellow-400 text-2xl">💡</span>
      ),
      iconBg: "bg-yellow-500/20",
      title: "Growth Consulting",
      description: "Funnel strategy, segmentation, copy optimization, lifecycle mapping",
    },
    {
      icon: (
        <span role="img" aria-label="AI Consulting" className="text-blue-400 text-2xl">🤖</span>
      ),
      iconBg: "bg-blue-500/20",
      title: "AI Consulting",
      description: " Automation, custom GPTs, workflow design, AI stack integration",
    },
  ],

  planVsAutomate: [
    { text: "While most firms help you ", highlight: false },
    { text: "plan", highlight: true },
    { text: ", and tech consultants help you ", highlight: false },
    { text: "automate", highlight: true },
    { text: ", we do both — so your business grows ", highlight: false },
    { text: "smarter", highlight: true },
    { text: " and ", highlight: false },
    { text: "faster", highlight: true },
    { text: " without the friction, gaps, or hand-offs.", highlight: false },
  ],

  image: "/services-images/talk-with-us-portrait.webp",
  sideText: "Talk with us!",
  sideText1:
    "We could talk forever about the topics of AI and Ecommerce! We are very enthusiastic about our services, and unlike other agencies, we have nothing to hide! Meanwhile, we are actually happy to help!",
  sideText2:
    "Due to our unique know-how of systemic management knowledge of large ecommerce organizations + every aspect of ecommerce marketing + being experts at AI Engineering, we are lightyears ahead of other consultancies.",
};
