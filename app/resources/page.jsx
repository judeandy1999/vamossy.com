'use client';
import { motion } from 'framer-motion';
import { BookOpen, Download, FileText, BarChart, Target, Award, ArrowRight, Search } from 'lucide-react';
import { useState } from 'react';

export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

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
    hidden: { opacity: 0, y: 30 },
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

  const categories = ['All', 'E-books', 'Guides', 'Templates', 'Reports'];

  const allResources = [
    {
      id: 1,
      title: "DTC Growth Ebook",
      description: "Complete guide to scaling your direct-to-consumer supplement business with proven strategies and real case studies.",
      category: "E-books",
      icon: BookOpen,
      color: "#85bd41",
      featured: true,
      downloadCount: "2.5k+"
    },
    {
      id: 2,
      title: "SEO Audit Checklist",
      description: "Step-by-step checklist to audit your website's SEO performance and identify improvement opportunities.",
      category: "Templates",
      icon: FileText,
      color: "#025965",
      featured: true,
      downloadCount: "1.8k+"
    },
    {
      id: 3,
      title: "Conversion Rate Optimization Guide",
      description: "Proven tactics to increase your website conversion rates and maximize revenue from existing traffic.",
      category: "Guides",
      icon: Target,
      color: "#85bd41",
      featured: true,
      downloadCount: "3.2k+"
    },
    {
      id: 4,
      title: "Industry Benchmark Report 2024",
      description: "Latest industry benchmarks and trends in the DTC supplement market with actionable insights.",
      category: "Reports",
      icon: BarChart,
      color: "#025965",
      featured: false,
      downloadCount: "1.2k+"
    },
    {
      id: 5,
      title: "Email Marketing Templates",
      description: "High-converting email templates specifically designed for supplement and health brands.",
      category: "Templates",
      icon: FileText,
      color: "#85bd41",
      featured: false,
      downloadCount: "2.1k+"
    },
    {
      id: 6,
      title: "Customer Journey Mapping Toolkit",
      description: "Tools and frameworks to map and optimize your customer journey for better retention.",
      category: "Templates",
      icon: Target,
      color: "#025965",
      featured: false,
      downloadCount: "1.5k+"
    },
    {
      id: 7,
      title: "AI Content Strategy Guide",
      description: "How to leverage AI tools effectively for content creation and marketing automation.",
      category: "Guides",
      icon: Award,
      color: "#85bd41",
      featured: false,
      downloadCount: "1.9k+"
    },
    {
      id: 8,
      title: "Social Media Content Calendar",
      description: "Pre-planned content calendar with 30 days of social media posts for supplement brands.",
      category: "Templates",
      icon: FileText,
      color: "#025965",
      featured: false,
      downloadCount: "2.3k+"
    }
  ];

  const filteredResources = allResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredResources = allResources.filter(resource => resource.featured);

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="relative bg-gray-50 pt-32 pb-16 overflow-hidden">
        {/* Dotted Background Pattern */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle, #63676cff 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 12px 12px'
          }}
        ></div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 bg-[#025965] text-white px-6 py-2 rounded-full text-sm font-semibold mb-8 shadow-lg"
            >
              <BookOpen className="w-4 h-4" />
              Free Resources
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#222222] mb-6 leading-[1.1] tracking-tight"
            >
              Growth <span className="text-[#025965]">Resources</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl text-[#3A3A3A] leading-relaxed max-w-3xl mx-auto mb-8"
            >
              Free guides, templates, and resources to help you grow your DTC supplement business faster
            </motion.p>

            {/* Search and Filter */}
            <motion.div
              variants={itemVariants}
              className="max-w-2xl mx-auto"
            >
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#85bd41] focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap justify-center gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                      selectedCategory === category
                        ? 'bg-[#85bd41] text-white'
                        : 'bg-white text-[#3A3A3A] border border-gray-200 hover:border-[#85bd41]'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Resources Section */}
      <section className="py-16 bg-[#13322E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="space-y-8"
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold text-white text-center"
            >
              Featured Resources
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredResources.map((resource, index) => (
                <motion.div
                  key={resource.id}
                  variants={cardVariants}
                  className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl group cursor-pointer relative overflow-hidden"
                >
                  {/* Price Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-[#85bd41] text-white px-3 py-1 rounded-full text-sm font-bold">
                      FREE
                    </div>
                  </div>
                  
                  {/* Icon */}
                  <div className="flex justify-center mb-6">
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${resource.color}15` }}
                    >
                      <resource.icon 
                        size={32} 
                        style={{ color: resource.color }}
                      />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold text-[#222222] mb-3">
                    {resource.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {resource.description}
                  </p>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                      className="cursor-pointer bg-[#85bd41] hover:bg-[#548816] flex-1 inline-flex items-center justify-center gap-2 text-white px-4 py-3 rounded-lg font-semibold text-sm hover:shadow-lg transition-all duration-200"
                    >
                      <BookOpen size={16} />
                      Explore Now
                    </button>
                    <button 
                      className="cursor-pointer border-2 border-[#85bd41] text-[#85bd41] hover:bg-[#85bd41] hover:text-white flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-200"
                    >
                      <Download size={16} />
                      Download
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* All Resources Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="space-y-8"
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold text-[#222222] text-center"
            >
              All Resources ({filteredResources.length})
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredResources.map((resource, index) => (
                <motion.div
                  key={resource.id}
                  variants={cardVariants}
                  className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-lg group cursor-pointer transition-all duration-200 relative overflow-hidden"
                >
                  {/* Price Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-[#85bd41] text-white px-2 py-1 rounded-full text-xs font-bold">
                      FREE
                    </div>
                  </div>
                  
                  {/* Icon */}
                  <div className="flex justify-center mb-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${resource.color}15` }}
                    >
                      <resource.icon 
                        size={24} 
                        style={{ color: resource.color }}
                      />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-lg font-bold text-[#222222] mb-2">
                    {resource.title}
                  </h3>
                  <p className="text-gray-600 mb-3 text-sm leading-relaxed">
                    {resource.description}
                  </p>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button 
                      className="cursor-pointer bg-[#85bd41] hover:bg-[#548816] flex-1 inline-flex items-center justify-center gap-1 text-white px-3 py-2 rounded-lg font-semibold text-xs hover:shadow-lg transition-all duration-200"
                    >
                      <BookOpen size={14} />
                      Explore
                    </button>
                    <button 
                      className="cursor-pointer border border-[#85bd41] text-[#85bd41] hover:bg-[#85bd41] hover:text-white inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg font-semibold text-xs transition-all duration-200"
                    >
                      <Download size={14} />
                      Download
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredResources.length === 0 && (
              <motion.div
                variants={itemVariants}
                className="text-center py-12"
              >
                <p className="text-gray-500 text-lg">No resources found matching your criteria.</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
            className="space-y-6"
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold text-[#222222]"
            >
              Need Personalized Help?
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-lg text-[#3A3A3A] leading-relaxed"
            >
              While our resources are great, sometimes you need customized strategies. Let's talk about your specific growth goals.
            </motion.p>

            <motion.div
              variants={itemVariants}
            >
              <button
                data-cal-link="dev-vamossy/consultation"
                data-cal-namespace="consultation"
                data-cal-config='{"layout":"month_view"}'
                className="cursor-pointer inline-flex items-center gap-3 bg-[#85bd41] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-[#548816] transition-all duration-200"
              >
                Schedule a Free Consultation
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}