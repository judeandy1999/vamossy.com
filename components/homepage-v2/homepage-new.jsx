'use client';
import { motion } from 'framer-motion';
import { Check, BarChart, ArrowRight, Star, CheckCircle, Shield, Clock, Award, TrendingUp, Bot, Target, Package, BookOpen, Download } from 'lucide-react';
import { useState } from 'react';
import { 
  coreServices, 
  trustFeatures, 
  heroContent, 
  aboutSection, 
  whyChooseUsSection, 
  ctaSection, 
  modalContent,
  processSection,
  resourcesSection
} from '@/data/homepage-v2-data';

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
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Premium Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-[#025965] text-white px-6 py-2 rounded-full text-sm font-semibold mb-8 shadow-lg"
          >
            <Award className="w-4 h-4" />
            The #1 Growth Partner for DTC Supplement & Vitamin Stores
          </motion.div>


          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold text-[#222222] mb-6 leading-[1.1] tracking-tight"
          >
            Dominate the DTC{' '}
            <span className="relative text-[#025965]">
              Supplement Market
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 1.2 }}
                className="absolute bottom-2 left-0 right-0 h-4 bg-[#B5C9B8] -z-10 rounded-full"
              />
            </span>
            <br />
            <span className="text-[#3A3A3A]">The Proven AI, SEO & Marketing Partner for Food & Vitamin Brands</span>
          </motion.h1>

          {/* Value Proposition */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-xl sm:text-2xl text-[#3A3A3A] mb-8 max-w-4xl mx-auto leading-relaxed font-light"
          >
            We help DTC supplement stores outsmart competitors, attract more customers, and
            <span className="font-semibold text-[#222222]"> grow faster — without wasting money</span>, 
            on the wrong agencies or outdated strategies.
          </motion.p>

          {/* Key Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 max-w-4xl mx-auto"
          >
            {[
              { icon: Bot, text: "AI Expertise", color: "text-[#85bd41]" },
              { icon: TrendingUp, text: "Proven Growth Frameworks", color: "text-[#85bd41]" },
              { icon: Target, text: "Results-Driven Approach", color: "text-[#85bd41]" },
              { icon: Package, text: "DTC Niche Specialists", color: "text-[#85bd41]" }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 1.2 + index * 0.1 }}
                className="flex flex-col items-center text-center p-4 bg-[#F5F5F5] rounded-xl border border-gray-200"
              >
                <benefit.icon className={`w-6 h-6 ${benefit.color} mb-2`} />
                <span className="text-sm font-semibold text-[#3A3A3A]">
                  {benefit.text}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <motion.button
              whileTap={{ scale: 0.98 }}
              className="cursor-pointer group bg-[#85bd41] hover:bg-[#548816] text-white px-10 py-5 rounded-xl font-bold text-lg flex items-center gap-3 shadow-xl hover:shadow-2xl w-full sm:w-auto"
            >
              View Your Free DTC Growth Ebook
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1" />
            </motion.button>
            
            <motion.button
              whileTap={{ scale: 0.98 }}
              className="cursor-pointer border-2 border-[#025965] hover:border-[#548816] text-[#025965] hover:text-[#548816] px-10 py-5 rounded-xl font-bold text-lg w-full sm:w-auto bg-white"
            >
              View Portfolio
            </motion.button>
          </motion.div>
        </div>
      </div>
      </section>

      {/* What We Do Section */}
      <section id="about" className="mt-[-3rem] py-20 bg-[#13322E] relative overflow-hidden transform -skew-y-2">
        {/* Slanted Container */}
        <div className="transform skew-y-2">
          {/* Diagonal Geometric Line Patterns */}
          <div className="absolute inset-0">
            {/* Left side diagonal lines */}
            <svg className="mt-[1rem] absolute left-0 top-1/2 transform -translate-y-1/2 w-74 h-74" viewBox="0 0 256 256">
              <g stroke="rgba(255,255,255,0.1)" strokeWidth="1.2" fill="none">
                <path d="M20 236 L80 236 L100 216 L160 216 L180 196 L240 196"/>
                <path d="M20 216 L60 216 L80 196 L140 196 L160 176 L220 176"/>
                <path d="M20 196 L40 196 L60 176 L120 176 L140 156 L200 156"/>
                <path d="M20 176 L60 176 L80 156 L140 156 L160 136 L220 136"/>
                <path d="M20 156 L80 156 L100 136 L160 136 L180 116 L240 116"/>
                <path d="M20 136 L60 136 L80 116 L140 116 L160 96 L220 96"/>
                <path d="M20 116 L40 116 L60 96 L120 96 L140 76 L200 76"/>
                <path d="M20 96 L60 96 L80 76 L140 76 L160 56 L220 56"/>
                <path d="M20 76 L80 76 L100 56 L160 56 L180 36 L240 36"/>
              </g>
            </svg>

            {/* Right side geometric lines */}
            <svg className="mt-[-1rem] absolute right-0 top-1/2 transform -translate-y-1/2 w-74 h-74" viewBox="0 0 256 256">
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
                {aboutSection.title}
              </motion.h2>
              <motion.p
                variants={itemVariants}
                className="text-xl text-gray-200 leading-relaxed"
              >
                {aboutSection.description}
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>     
      
      {/* 3-Step Process Section */}
      <section className="mt-[-2rem] py-20 bg-gray-50">
        <div className="mt-[2rem] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="text-center space-y-8"
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-5xl font-bold text-[#222222]"
            >
              {processSection.title}
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {processSection.steps.map((step, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  className="relative"
                >
                  
                  <div className="relative md:min-h-[15rem] bg-white rounded-2xl p-8 shadow-lg border border-gray-100 group">
                    {/* Step Number */}
                    <div className="absolute -top-4 left-8">
                      <div 
                        className="bg-[#025965] w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg"
                      >
                        {step.number}
                      </div>
                    </div>
                    
                    {/* Icon */}
                    <div className="flex justify-center mb-4 mt-4">
                      <div 
                        className="w-16 h-16 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${step.color}15` }}
                      >
                        <step.icon 
                          size={32} 
                          style={{ color: step.color }}
                        />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-xl font-bold text-[#222222] mb-2 group-hover:text-[#025965]">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-[1.2]">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Resources Section */}
      <section className="py-20 bg-[#13322E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="text-center space-y-8"
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-5xl font-bold text-white"
            >
              {resourcesSection.title}
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {resourcesSection.resources.map((resource, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl group cursor-pointer"
                >
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
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {resource.description}
                  </p>
                  
                  {/* Download Button */}
                  <button 
                    className="cursor-pointer bg-[#85bd41] hover:bg-[#548816] inline-flex items-center gap-2 text-white px-6 py-3 rounded-lg font-semibold text-sm hover:shadow-lg group-hover:scale-105"
                  >
                    Explore Now
                  </button>
                </motion.div>
              ))}
            </div>

            {/* View All Resources CTA */}
            <motion.div
              variants={itemVariants}
              className="pt-4"
            >
              <button className="bg-[#85bd41] hover:bg-[#548816] inline-flex items-center gap-3 text-white px-8 py-4 rounded-xl font-bold text-lg cursor-pointer shadow-lg">
                {resourcesSection.ctaText}
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
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
                  className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"
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
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
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
              {whyChooseUsSection.title}
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
                      {whyChooseUsSection.resultsDriven.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {whyChooseUsSection.resultsDriven.description}
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
              {ctaSection.title}
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            >
              {ctaSection.description}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="pt-8"
            >
              <button
                onClick={handleBookNowClick}
                className="inline-flex items-center gap-3 bg-[#85bd41] text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:bg-[#548816] cursor-pointer"
              >
                <Check size={24} />
                {ctaSection.ctaText}
              </button>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-gray-500 text-sm"
            >
              {ctaSection.disclaimer}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Simple Calendar Modal Placeholder */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{modalContent.title}</h3>
            <p className="text-gray-600 mb-6">
              {modalContent.description}
            </p>
            <button
              onClick={handleCloseCalendar}
              className="w-full bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800"
            >
              {modalContent.closeText}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
