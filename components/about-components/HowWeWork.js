import React from 'react';
import { Search, Lightbulb, Settings } from 'lucide-react';

const HowWeWork = () => {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1e293b] mb-6">
            How We Work
          </h2>
          <p className="text-lg text-[#64748b] max-w-3xl mx-auto">
            Our structured approach means brands get traction without wasted spend, and 
            agencies get projects that run smoothly from day one.
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Agency Matchmaking */}
          <div className="text-center">
            <div className="flex items-center justify-center w-20 h-20 bg-[#1f3a8a] rounded-full mb-6 mx-auto">
              <Search className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-[#1e293b] mb-4">
              Agency Matchmaking
            </h3>
            <p className="text-[#64748b] text-sm leading-relaxed">
              Curated, experienced partner selection. Followed 
              by pilot-based engagement.
            </p>
          </div>

          {/* AI Solutions */}
          <div className="text-center">
            <div className="flex items-center justify-center w-20 h-20 bg-[#1f3a8a] rounded-full mb-6 mx-auto">
              <Lightbulb className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-[#1e293b] mb-4">
              AI Solutions
            </h3>
            <p className="text-[#64748b] text-sm leading-relaxed">
              Design, pilot, and implement workflows that multiply 
              team output.
            </p>
          </div>

          {/* Program Management */}
          <div className="text-center">
            <div className="flex items-center justify-center w-20 h-20 bg-[#1f3a8a] rounded-full mb-6 mx-auto">
              <Settings className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-[#1e293b] mb-4">
              Program Management
            </h3>
            <p className="text-[#64748b] text-sm leading-relaxed">
              We keep agencies-business informed and 
              optimized for long-term success.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowWeWork;