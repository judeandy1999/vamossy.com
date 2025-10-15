import React from 'react';
import { Shield, Beaker, Truck, Target } from 'lucide-react';

const OurPrinciples = () => {
  return (
    <section className="py-16 px-4 bg-[#f0f4fc]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1f40af] mb-6">
            Our Principles
          </h2>
        </div>

        {/* Principles Grid */}
        <div className="grid md:grid-cols-4 gap-6">
          {/* Independent & Transparent */}
          <div className="bg-white rounded-lg p-6 text-center shadow-sm">
            <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 mx-auto">
              <Shield className="w-10 h-10 text-[#1f40af]" />
            </div>
            <h3 className="text-lg font-semibold text-[#1f40af] mb-3">
              Independent & Transparent
            </h3>
            <p className="text-sm text-[#64748b]">
              No vendor bias, no hidden fees.
            </p>
          </div>

          {/* Pilot-First */}
          <div className="bg-white rounded-lg p-6 text-center shadow-sm">
            <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 mx-auto">
              <Beaker className="w-10 h-10 text-[#1f40af]" />
            </div>
            <h3 className="text-lg font-semibold text-[#1f40af] mb-3">
              Pilot-First
            </h3>
            <p className="text-sm text-[#64748b]">
              Prove it with real KPIs before committing long-term.
            </p>
          </div>

          {/* AI That Ships */}
          <div className="bg-white rounded-lg p-6 text-center shadow-sm">
            <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 mx-auto">
              <Truck className="w-10 h-10 text-[#1f40af]" />
            </div>
            <h3 className="text-lg font-semibold text-[#1f40af] mb-3">
              AI That Ships
            </h3>
            <p className="text-sm text-[#64748b]">
              Practical workflows that embed into your stack.
            </p>
          </div>

          {/* Outcome-Focused */}
          <div className="bg-white rounded-lg p-6 text-center shadow-sm">
            <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 mx-auto">
              <Target className="w-10 h-10 text-[#1f40af]" />
            </div>
            <h3 className="text-lg font-semibold text-[#1f40af] mb-3">
              Outcome-Focused
            </h3>
            <p className="text-sm text-[#64748b]">
              Measurable results, playbooks, and handover docs.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurPrinciples;