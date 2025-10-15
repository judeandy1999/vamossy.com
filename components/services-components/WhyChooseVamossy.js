import React from 'react';
import { CheckCircle, Award, Percent, BarChart3, Clock } from 'lucide-react';

const WhyChooseVamossy = () => {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1e293b] mb-4">
            Why Choose Vamossy
          </h2>
          <p className="text-lg text-[#64748b] max-w-2xl mx-auto">
            Evidence-based partnerships and practical AI that actually ships.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          {/* Fit over volume */}
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-[#3b82f6] rounded-full mb-4 mx-auto">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-[#1e293b] mb-2">
              Fit over volume
            </h3>
            <p className="text-[#64748b] text-sm">
              Curated agencies, strategic based approach
            </p>
          </div>

          {/* Pilot first */}
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-[#10b981] rounded-full mb-4 mx-auto">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-[#1e293b] mb-2">
              Pilot first
            </h3>
            <p className="text-[#64748b] text-sm">
              No long-term before showing
            </p>
          </div>

          {/* AI that actually ships */}
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-[#6b7280] rounded-full mb-4 mx-auto">
              <Percent className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-[#1e293b] mb-2">
              AI that actually ships
            </h3>
            <p className="text-[#64748b] text-sm">
              Real workflows, not theory
            </p>
          </div>

          {/* Speed with rigor */}
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-[#3b82f6] rounded-full mb-4 mx-auto">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-[#1e293b] mb-2">
              Speed with rigor
            </h3>
            <p className="text-[#64748b] text-sm">
              Days—not weeks—to results
            </p>
          </div>

          {/* Measurable outcomes */}
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-[#10b981] rounded-full mb-4 mx-auto">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-[#1e293b] mb-2">
              Measurable outcomes
            </h3>
            <p className="text-[#64748b] text-sm">
              Dashboards, baselines, decision points
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseVamossy;