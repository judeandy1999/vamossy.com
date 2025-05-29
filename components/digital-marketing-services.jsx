// components/DigitalMarketingServices.jsx

const services = [
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

export default function DigitalMarketingServices() {
  return (
    <section className="bg-[#02355A] text-white py-20">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-[68px] mb-12">Digital Marketing Services</h2>
        <div className="grid md:grid-cols-5 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-transparent border border-white/25 text-left p-6 rounded-lg hover:shadow-lg hover:-translate-y-1 transition"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-yellow-400">
                  <h3 className="text-[20px] text-white font-semibold">
                    {service.title}
                  </h3>
                </div>
                <hr className="border-t border-white/25 ml-[-24px] w-[calc(100%+48px)] my-2" />
                <ul className="pt-4 text-gray-400 text-[18px] space-y-1">
                  {service.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <a
                  href="#"
                  className="text-yellow-400 font-light text-[16px] inline-flex items-center gap-1 hover:underline"
                >
                  {service.link} <span>&rarr;</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
