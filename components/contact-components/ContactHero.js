import React from 'react';
import { MessageSquare, Users, Lightbulb, ArrowRight } from 'lucide-react';

const ContactHero = () => {
  const quickActions = [
    {
      icon: <MessageSquare className="w-5 h-5" />,
      text: 'Get Agency Match',
      description: 'Find vetted partners'
    },
    {
      icon: <Lightbulb className="w-5 h-5" />,
      text: 'AI Consultation',
      description: 'Explore AI solutions'
    },
    {
      icon: <Users className="w-5 h-5" />,
      text: 'Project Support',
      description: 'Ongoing guidance'
    }
  ];

  return (
    <section className="bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-[#1e293b] leading-tight mb-6">
            Let&apos;s Build Something{' '}
            <span className="text-[#3b82f6]">Great Together</span>
          </h1>
          <p className="text-lg md:text-xl text-[#64748b] max-w-3xl mx-auto leading-relaxed mb-8">
            Whether you need the perfect agency match, AI solutions that deliver ROI, 
            or strategic guidance for your ecommerce growth—we&apos;re here to help you 
            move forward with confidence.
          </p>
          
          {/* Quick Action Tags */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {quickActions.map((action, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 text-sm text-[#64748b]"
              >
                <span className="text-[#3b82f6]">{action.icon}</span>
                <span className="font-medium text-[#1e293b]">{action.text}</span>
                <span className="text-gray-400">·</span>
                <span>{action.description}</span>
              </div>
            ))}
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              className="cursor-pointer bg-[#1f40af] text-white font-semibold py-4 px-8 rounded-lg shadow-lg hover:bg-blue-800 hover:scale-105 transition-all duration-200 flex items-center gap-2"
              data-cal-link="dev-vamossy/discovery-call"
              data-cal-namespace="discovery-call"
              data-cal-config='{"layout":"month_view"}'
            >
              Book a Free Discovery Call
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-sm text-[#64748b]">
              or fill out the form below for a detailed response
            </p>
          </div>
        </div>

        {/* Stats or Social Proof */}
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="text-2xl font-bold text-[#1e293b] mb-1">24hr</div>
            <div className="text-sm text-[#64748b]">Response Time</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="text-2xl font-bold text-[#1e293b] mb-1">50+</div>
            <div className="text-sm text-[#64748b]">Vetted Partners</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="text-2xl font-bold text-[#1e293b] mb-1">100%</div>
            <div className="text-sm text-[#64748b]">No-Obligation</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactHero;
