'use client';
import { motion } from 'framer-motion';
import { Check, Search, Settings, FileText, Link, Smartphone, BarChart, Target, Brain, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

export default function HomePage() {
  const [showCalendar, setShowCalendar] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const handleBookNowClick = (e) => {
    e.preventDefault();
    setShowCalendar(true);
  };

  const handleCloseCalendar = () => {
    setShowCalendar(false);
  };

  // Core Services Data
  const coreServices = [
    {
      icon: Search,
      title: "Keyword Research",
      description: "Discover the exact search terms your audience is using. We create data-driven keyword strategies that bring qualified traffic to your site.",
      iconColor: "#10b981"
    },
    {
      icon: Settings,
      title: "Technical SEO",
      description: "We optimize your website's backend—site speed, indexing, crawlability, and more—so search engines can easily find and rank you.",
      iconColor: "#10b981"
    },
    {
      icon: FileText,
      title: "On-Page SEO",
      description: "From meta tags to internal linking, we fine-tune every element of your pages to align with SEO best practices.",
      iconColor: "#10b981"
    },
    {
      icon: Link,
      title: "Off-Page SEO",
      description: "Build trust and authority with strategic link-building and outreach campaigns that elevate your site's credibility.",
      iconColor: "#10b981"
    },
    {
      icon: FileText,
      title: "Content SEO",
      description: "We craft optimized content prompts that attract both readers and search engines, turning clicks into loyal customers.",
      iconColor: "#10b981"
    },
    {
      icon: ShoppingCart,
      title: "Ecommerce SEO",
      description: "Boost product visibility and sales with SEO strategies tailored for online stores, marketplaces, and product catalogs.",
      iconColor: "#10b981"
    },
    {
      icon: Smartphone,
      title: "Mobile SEO",
      description: "Optimize your site for a mobile-first world—ensuring fast, seamless, and responsive experiences on any device.",
      iconColor: "#10b981"
    },
    {
      icon: BarChart,
      title: "SEO Performance Tracking",
      description: "Stay informed with real-time performance reports that track your keyword rankings, traffic growth, and ROI.",
      iconColor: "#10b981"
    },
    {
      icon: Brain,
      title: "Semantic SEO",
      description: "Go beyond keywords. We implement intent-based SEO that matches what your audience is truly searching for.",
      iconColor: "#10b981"
    }
  ];

  const trustFeatures = [
    "Personalized SEO prompt consulting, not generic templates",
    "Actionable strategies you can implement immediately",
    "Expert support to help you understand and optimize your SEO",
    "Scalable solutions for businesses of all sizes"
  ];

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center bg-gray-50 pt-16 overflow-hidden">
        {/* Dotted Background Pattern */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle, #63676cff 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 12px 12px'
          }}
        ></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              <motion.h1
                variants={itemVariants}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
              >
                SEO Prompt Consulting{' '}
                <span className="text-[#85bd41]
">
                  for Profitable Results
                </span>
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-lg md:text-xl text-gray-600 leading-relaxed"
              >
                Tired of generic SEO strategies? Our proprietary approach uses precise audience targeting, clear strategic alignment, and measurable optimization to deliver results marketing leaders trust and businesses depend on.
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="pt-4"
              >
                <button
                  onClick={handleBookNowClick}
                  className="inline-flex items-center gap-3 bg-[#85bd41] text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:bg-blue-700 transition-all duration-300"
                >
                  Request a Proposal
                </button>
              </motion.div>
            </motion.div>

            {/* Right Column - Visual Element */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="relative"
            >
              <div className="w-full h-[80%] flex items-center justify-center">
                <img 
                  src="/graph.svg" 
                  alt="SEO Performance Analytics Chart"
                  className="w-full h-full object-contain"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section id="about" className="py-20 bg-teal-800 relative overflow-hidden transform -skew-y-2">
        {/* Slanted Container */}
        <div className="transform skew-y-2">
          {/* Diagonal Geometric Line Patterns */}
          <div className="absolute inset-0">
            {/* Left side diagonal lines */}
            <svg className="absolute left-0 top-2/3 transform -translate-y-1/2 w-74 h-74" viewBox="0 0 256 256">
              <g stroke="rgba(255,255,255,0.1)" strokeWidth="1.2" fill="none">
                <path d="M20 20 L80 20 L100 40 L160 40 L180 60 L240 60"/>
                <path d="M20 40 L60 40 L80 60 L140 60 L160 80 L220 80"/>
                <path d="M20 60 L40 60 L60 80 L120 80 L140 100 L200 100"/>
                <path d="M20 80 L60 80 L80 100 L140 100 L160 120 L220 120"/>
                <path d="M20 100 L80 100 L100 120 L160 120 L180 140 L240 140"/>
                <path d="M20 120 L60 120 L80 140 L140 140 L160 160 L220 160"/>
                <path d="M20 140 L40 140 L60 160 L120 160 L140 180 L200 180"/>
                <path d="M20 160 L60 160 L80 180 L140 180 L160 200 L220 200"/>
                <path d="M20 180 L80 180 L100 200 L160 200 L180 220 L240 220"/>
              </g>
            </svg>
            
            {/* Right side geometric lines */}
            <svg className="absolute right-0 top-1/2 transform -translate-y-1/2 w-74 h-74" viewBox="0 0 256 256">
              <g stroke="rgba(255,255,255,0.1)" strokeWidth="1.2" fill="none">
                <path d="M236 20 L176 20 L156 40 L96 40 L76 60 L16 60 "/>
                <path d="M236 40 L196 40 L176 60 L116 60 L96 80 L36 80"/>
                <path d="M236 60 L216 60 L196 80 L136 80 L116 100 L56 100"/>
                <path d="M236 80 L196 80 L176 100 L116 100 L96 120 L36 120"/>
                <path d="M236 100 L176 100 L156 120 L96 120 L76 140 L16 140"/>
                <path d="M236 120 L196 120 L176 140 L116 140 L96 160 L36 160"/>
                <path d="M236 140 L216 140 L196 160 L136 160 L116 180 L56 180"/>
                <path d="M236 160 L196 160 L176 180 L116 180 L96 200 L36 200"/>
                <path d="M236 180 L176 180 L156 200 L96 200 L76 220 L16 220"/>
              </g>
            </svg>
          </div>
        
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={containerVariants}
              className="text-center space-y-8"
            >
              <motion.h2
                variants={itemVariants}
                className="text-4xl md:text-5xl font-bold text-white"
              >
                What We Do
              </motion.h2>
              <motion.p
                variants={itemVariants}
                className="text-xl text-gray-200 leading-relaxed"
              >
                At SEO Prompt Consulting, we specialize in transforming how you approach SEO. Whether you're a small business owner, an eCommerce store, or a content creator, our SEO prompt consulting ensures your site stays ahead of the competition.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>     
      
      {/* Core Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="space-y-16"
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-5xl font-bold text-gray-900 text-center"
            >
              Our Core Services
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {coreServices.map((service, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group"
                >
                  <div className="flex items-start space-x-4">
                    <div 
                      className="p-3 rounded-lg bg-gray-50"
                    >
                      <service.icon 
                        size={32} 
                        style={{ color: service.iconColor }} 
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-[#85bd41] transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section 
        style={{
            backgroundImage: `radial-gradient(circle, #575757ff 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 12px 12px'
          }}
        className="py-20 bg-[#13322E]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
            className="space-y-12"
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-5xl font-bold text-white text-center"
            >
              Why Choose Us?
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <motion.div
                variants={itemVariants}
                className="space-y-6"
              >
                {trustFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-6 h-6 bg-[#274844] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Check size={16} className="text-white" />
                    </div>
                    <p className="text-lg text-white leading-relaxed">{feature}</p>
                  </div>
                ))}
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bg-white rounded-lg p-8 border border-gray-200 shadow-sm"
              >
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-[#274844] rounded-full flex items-center justify-center mx-auto mb-4">
                      <BarChart size={32} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                      Results-Driven Approach
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      We don't just provide advice—we deliver measurable results that grow your business and improve your search rankings.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section id="contact" className="py-20 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
            className="space-y-8"
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-5xl font-bold text-gray-900"
            >
              Ready to take your SEO to the next level?
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            >
              We'll help you craft SEO strategies that actually work. Let's build your online visibility, together.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="pt-8"
            >
              <button
                onClick={handleBookNowClick}
                className="inline-flex items-center gap-3 bg-[#85bd41] text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:bg-blue-700 transition-all duration-300"
              >
                <Check size={24} />
                Book Your Free Consultation
              </button>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-gray-500 text-sm"
            >
              No obligation • Free 30-minute consultation • Get started today
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Simple Calendar Modal Placeholder */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Book Your Consultation</h3>
            <p className="text-gray-600 mb-6">
              Thank you for your interest! Please contact us at hello@seopromptconsulting.com to schedule your free consultation.
            </p>
            <button
              onClick={handleCloseCalendar}
              className="w-full bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
