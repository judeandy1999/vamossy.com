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

export const liveCaseStudies = {
  title: "Join Our Live Case Studies!",
  subtitle: "We do our best for all of our clients, and are proud to show it! Let us make a case study with you - live, on the job! No foul play, no bought or incentivized reviews - Just honest, real feedback -before - during - and after our service!",
  caseStudies: [
    {
      id: 1,
      title: "Case study",
      description: "Sample text. Click to select the text box. Click again or double click to start editing the text."
    },
    {
      id: 2,
      title: "Case study",
      description: "Sample text. Click to select the text box. Click again or double click to start editing the text."
    },
    {
      id: 3,
      title: "Case study",
      description: "Sample text. Click to select the text box. Click again or double click to start editing the text."
    },
    {
      id: 4,
      title: "Case study",
      description: "Sample text. Click to select the text box. Click again or double click to start editing the text."
    },
    {
      id: 5,
      title: "Case study",
      description: "Sample text. Click to select the text box. Click again or double click to start editing the text."
    },
    {
      id: 6,
      title: "Case study",
      description: "Sample text. Click to select the text box. Click again or double click to start editing the text."
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
    title: "7-8 Figure Brands",
    description: "Seeking systems, not headcount",
  },
  {
    title: "Scaling Founders",
    description: "Tired of agency fluff, need strategic action",
  },
  {
    title: "CMOs & Operators",
    description: "Need leverage, not just content",
  },
  {
    title: "Retention-Challenged Brands",
    description: "Winback, subscription, loyalty fixes",
  },
  {
    title: "High-LTV Product Teams",
    description: "Want compounding automation logic",
  },
];

export const growthSteps = [
  {
    number: "1",
    title: "Audit & Map",
    description:
      "We deploy GPT-powered diagnostics to pinpoint friction, decay, and inefficiency in your funnel, content, and lifecycle.",
  },
  {
    number: "2",
    title: "Systemize & Automate",
    description:
      "Our PromptOps framework builds full-stack GPT assets: emails, hooks, audits, campaigns — all mapped to growth levers.",
  },
  {
    number: "3",
    title: "Built Self-Improvement",
    description:
      "We embed feedback loops that suggest improvement ideas, and help maintain unique competitive advantage.",
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

export const tieredServices = {
  title: "AI GROWTH ENGINE",
  subtitle: "TIERED SERVICES",
  tiers: [
    {
      id: 1,
      name: "Tier 1",
      icon: "/homepage/tier1.webp",
      idealFor: "Sample text. Click to select the Text Element.",
      coreOffer: "Sample text. Click to select the Text Element.",
      investment: "Sample text. Click to select the Text Element.",
      features: {
        "Funnel Audit (GPT-Powered)": "included",
        "Full KPI + Marketing Activity Audit": "partial"
      }
    },
    {
      id: 2,
      name: "Tier 2",
      icon: "/homepage/tier2.webp",
      idealFor: "Sample text. Click to select the Text Element.",
      coreOffer: "Sample text. Click to select the Text Element.",
      investment: "Sample text. Click to select the Text Element.",
      features: {
        "Funnel Audit (GPT-Powered)": "included",
        "Full KPI + Marketing Activity Audit": "included"
      }
    },
    {
      id: 3,
      name: "Tier 3",
      icon: "/homepage/tier3.webp",
      idealFor: "Sample text. Click to select the Text Element.",
      coreOffer: "Sample text. Click to select the Text Element.",
      investment: "Sample text. Click to select the Text Element.",
      features: {
        "Funnel Audit (GPT-Powered)": "included",
        "Full KPI + Marketing Activity Audit": "included",
        "Deep audit": "Deep audit (incl. LTV, retention)"
      }
    }
  ],
  featureRows: [
    "Ideal For",
    "Core Offer",
    "Investment", 
    "Funnel Audit (GPT-Powered)",
    "Full KPI + Marketing Activity Audit"
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
  title: "AI GROWTH ENGINE",
  subtitle: "TIERED SERVICES",
  tiers: [
    {
      id: 1,
      name: "Tier 1",
      icon: "/homepage/tier1.webp",
      idealFor: "Sample text. Click to select the Text Element.",
      coreOffer: "Sample text. Click to select the Text Element.",
      investment: "Sample text. Click to select the Text Element.",
      features: {
        "Funnel Audit (GPT-Powered)": "included",
        "Full KPI + Marketing Activity Audit": "partial"
      }
    },
    {
      id: 2,
      name: "Tier 2",
      icon: "/homepage/tier2.webp",
      idealFor: "Sample text. Click to select the Text Element.",
      coreOffer: "Sample text. Click to select the Text Element.",
      investment: "Sample text. Click to select the Text Element.",
      features: {
        "Funnel Audit (GPT-Powered)": "included",
        "Full KPI + Marketing Activity Audit": "included"
      }
    },
    {
      id: 3,
      name: "Tier 3",
      icon: "/homepage/tier3.webp",
      idealFor: "Sample text. Click to select the Text Element.",
      coreOffer: "Sample text. Click to select the Text Element.",
      investment: "Sample text. Click to select the Text Element.",
      features: {
        "Funnel Audit (GPT-Powered)": "included",
        "Full KPI + Marketing Activity Audit": "included",
        "Deep audit": "Deep audit (incl. LTV, retention)"
      }
    }
  ],
  featureRows: [
    "Ideal For",
    "Core Offer",
    "Investment", 
    "Funnel Audit (GPT-Powered)",
    "Full KPI + Marketing Activity Audit"
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
  name: "Gergo Vamosy",
  title: "Founder",
  image: "/about/founder.webp", 
  intro: `I have started this agency to fix the two biggest problems I saw in eCommerce consulting: people guessing, and people bluffing.`,
  bio: `I have built this practice after 11 years being a large eCommerce store owner/founder, and then 9 years in becoming a SEO, and an eCommerce digital marketing specialist. By adding prompt engineering to this package, I managed to create better performing marketing campaigns than ever before, and we evolved into a multidisciplinary team that combines strategic foresight, real funnel experience, and GPT-native execution systems.`,
  closing: `You're not hiring just a strategist.`
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

// About page data ends here

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
    title: 'Diagnosis',
    description: 'Deep discovery, audit, and stakeholder interviews',
  },
  {
    step: '2',
    title: 'Blueprint',
    description: 'Custom solution maps + prioritization frameworks',
  },
  {
    step: '3',
    title: 'Prototyping & Enablement',
    description: 'Guided execution or full rollout',
  },
  {
    step: '4',
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

