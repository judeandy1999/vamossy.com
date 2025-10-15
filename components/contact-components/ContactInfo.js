import React from 'react';
import { Mail, Phone, MapPin, Clock, Calendar, MessageCircle } from 'lucide-react';

const ContactInfo = () => {
  const contactMethods = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Email Us',
      primary: 'hello@vamossy.com',
      secondary: 'We typically respond within 24 hours',
      action: 'mailto:hello@vamossy.com',
      actionText: 'Send Email'
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Call Us',
      primary: '+44 20 1234 5678',
      secondary: 'Mon-Fri, 09:00-17:00 GMT',
      action: 'tel:+442012345678',
      actionText: 'Call Now'
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: 'Book a Call',
      primary: 'Schedule a Discovery Call',
      secondary: 'Free 30-minute consultation',
      action: '#',
      actionText: 'Book Now',
      isCalLink: true
    }
  ];

  const officeInfo = {
    company: 'Vamossy Digital Ltd.',
    companyNumber: '12345678',
    vat: 'EU123456789',
    address: '123 Business Street, London, UK',
    hours: 'Mon–Fri, 09:00–17:00 GMT'
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-[#1e283c] mb-4">
          Get in Touch
        </h2>
        <p className="text-[#64748b] text-lg">
          Ready to accelerate your ecommerce growth? Here&apos;s how you can reach us.
        </p>
      </div>

      {/* Contact Methods */}
      <div className="space-y-6">
        {contactMethods.map((method, index) => (
          <div key={index} className="bg-[#f8fafc] rounded-lg p-6 border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-[#1f40af] rounded-lg flex items-center justify-center text-white">
                {method.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-[#1e283c] mb-1">
                  {method.title}
                </h3>
                <p className="text-[#1e283c] font-medium mb-1">
                  {method.primary}
                </p>
                <p className="text-[#64748b] text-sm mb-3">
                  {method.secondary}
                </p>
                {method.isCalLink ? (
                  <button
                    className="text-[#1f40af] font-medium text-sm hover:text-blue-800 transition-colors"
                    data-cal-link="dev-vamossy/discovery-call"
                    data-cal-namespace="discovery-call"
                    data-cal-config='{"layout":"month_view"}'
                  >
                    {method.actionText} →
                  </button>
                ) : (
                  <a
                    href={method.action}
                    className="text-[#1f40af] font-medium text-sm hover:text-blue-800 transition-colors"
                  >
                    {method.actionText} →
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Office Information */}
      <div className="bg-[#1e283c] rounded-lg p-6 text-white">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Business Details
        </h3>
        <div className="space-y-3 text-sm">
          <div>
            <div className="font-semibold">{officeInfo.company}</div>
            <div className="text-gray-300">Company No: {officeInfo.companyNumber} · VAT: {officeInfo.vat}</div>
          </div>
          <div>
            <div className="font-medium text-gray-200">Registered Office:</div>
            <div className="text-gray-300">{officeInfo.address}</div>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-gray-300">Hours: {officeInfo.hours}</span>
          </div>
        </div>
      </div>

      {/* Additional Support */}
      <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
        <div className="flex items-start gap-3">
          <MessageCircle className="w-6 h-6 text-[#1f40af] flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-[#1e283c] mb-2">
              Need Immediate Support?
            </h3>
            <p className="text-[#64748b] text-sm mb-3">
              Our team is available through multiple channels to ensure you get the help you need when you need it.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-[#1f40af] border border-blue-200">
                Email Support
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-[#1f40af] border border-blue-200">
                Phone Consultation
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-[#1f40af] border border-blue-200">
                Video Calls
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Link */}
      <div className="text-center">
        <p className="text-[#64748b] mb-2">
          Have questions before reaching out?
        </p>
        <a
          href="/about/faq"
          className="text-[#1f40af] font-medium hover:text-blue-800 transition-colors"
        >
          Check our FAQ →
        </a>
      </div>
    </div>
  );
};

export default ContactInfo;
