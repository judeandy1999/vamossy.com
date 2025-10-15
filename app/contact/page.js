"use client";

import React, { useState } from 'react';
import { Send, CheckCircle, Clock, ShieldCheck, LineChart, Handshake, Calendar } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    serviceType: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const serviceTypes = [
    'Agency Matchmaking',
    'AI Solutions Implementation', 
    'Project Coordination',
    'Strategic Consultation',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f3f6f9] to-[#f1f6fe] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-lg">
          <CheckCircle className="w-16 h-16 text-[#2fc55f] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#1e283c] mb-2">Message Sent!</h2>
          <p className="text-[#505a66] mb-6">We&apos;ll get back to you within 24 hours with actionable insights.</p>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setFormData({ name: '', email: '', company: '', serviceType: '', message: '' });
            }}
            className="text-[#1f40af] hover:text-[#1e377a] font-medium"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[90dvh] bg-gradient-to-br from-[#f3f6f9] to-[#f1f6fe] flex items-center justify-center px-4 py-8">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center">
        {/* Contact Form */}
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <h1 className="text-2xl font-bold text-[#1e283c] mb-2">Get Started Today</h1>
          <p className="text-[#505a66] mb-6">Tell us about your ecommerce growth goals and challenges.</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name *"
                required
                className="text-black w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1f2937] focus:border-transparent bg-gray-50"
              />
            </div>
            
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email *"
                required
                className="text-black w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1f2937] focus:border-transparent bg-gray-50"
              />
            </div>
            
            <div>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Company Name"
                className="text-black w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1f2937] focus:border-transparent bg-gray-50"
              />
            </div>

            <div>
              <select
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                className="text-black w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1f2937] focus:border-transparent bg-gray-50"
              >
                <option value="">What can we help you with?</option>
                {serviceTypes.map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>
            
            <div>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your business and goals *"
                required
                rows={4}
                className="text-black w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1f2937] focus:border-transparent bg-gray-50 resize-none"
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#1f2937] text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-900 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Send Message
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* What to Expect */}
        <div className="text-[#1e283c]">
          <h2 className="text-3xl font-bold mb-8">What to Expect</h2>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-[#1f2937] rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg">Vetted agency matches aligned with your goals</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-[#1f2937] rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg">AI solutions designed for measurable ROI</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-[#1f2937] rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg">No guesswork - data-driven recommendations</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-[#1f2937] rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg">Independent, transparent partnership approach</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-[#1f2937] rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg">Pilot programs with clear success metrics</span>
            </div>
          </div>

          {/* Response Time Card */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1f2937] rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-[#1e283c]">Quick Response Time</h3>
                <p className="text-[#505a66]">We typically respond within 24 hours</p>
              </div>
            </div>
          </div>

          {/* Book Call Option */}
          <div className="mt-6 text-center">
            <p className="text-[#505a66] mb-3">Prefer to talk directly?</p>
            <button
              className="cursor-pointer border border-[#1f2937] text-[#1f2937] hover:scale-105 font-semibold py-3 px-6 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center mx-auto gap-2"
              data-cal-link="dev-vamossy/discovery-call"
              data-cal-namespace="discovery-call"
              data-cal-config='{"layout":"month_view"}'
            >
              <Calendar className="w-4 h-4" />
              Book a Discovery Call
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
