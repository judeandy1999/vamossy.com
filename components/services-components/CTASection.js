import React from 'react';
import { Calendar } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-16 px-4" style={{ background: 'linear-gradient(135deg, #1e377a 0%, #1e3e9f 100%)' }}>
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Accelerate Your Growth?
        </h2>
        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
          Let&apos;s discuss how we can connect you with the right agencies and implement AI workflows that drive results.
        </p>
        <button
          className="cursor-pointer bg-[#3b82f6] text-white font-semibold py-4 px-8 rounded-lg shadow-lg hover:bg-blue-600 hover:scale-105 transition-all duration-200 flex items-center justify-center mx-auto"
          data-cal-link="dev-vamossy/discovery-call"
          data-cal-namespace="discovery-call"
          data-cal-config='{"layout":"month_view"}'
        >
          <Calendar className="w-5 h-5 mr-2" />
          See How it Works
        </button>
      </div>
    </section>
  );
};

export default CTASection;