import React from 'react';
import { Users, Zap, Settings } from 'lucide-react';

const ServicesSection = () => {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-[#1e293b] mb-4">
            Our Services
          </h2>
          <p className="text-lg text-[#64748b] max-w-2xl mx-auto">
            Comprehensive solutions to accelerate your growth through strategic partnerships and AI implementation.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Agency Match & Pilot */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-center w-12 h-12 bg-[#3b82f6] rounded-lg mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-[#1e293b] mb-3">
              Agency Match & Pilot
            </h3>
            <p className="text-[#64748b] mb-6 text-sm leading-relaxed">
              We connect you with perfect-fit agencies, facilitate initial engagements through a curated and structured based approach.
            </p>
            
            <div className="mb-6">
              <h4 className="font-medium text-[#1e293b] mb-3">What&apos;s included:</h4>
              <ul className="space-y-2 text-sm text-[#64748b]">
                <li>• Discovery call & business metrics analysis</li>
                <li>• Agency shortlist (3-5) & agencies with fit scoring</li>
                <li>• Guided pilot project scoped by Vamossy</li>
                <li>• Risk mitigation & clear deliverables</li>
              </ul>
            </div>

            <div className="mb-6">
              <p className="text-xs text-[#64748b] leading-relaxed">
                <strong>Outcome:</strong> Active plans for 3+ required use cases after pilot for future prioritization. Established Standard Operating Procedures and metrics tracking methodology for ongoing work.
              </p>
            </div>

            <button className="cursor-pointer font-semibold w-full bg-[#3b82f6] text-white font-medium py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors">
              Start with Agency Match
            </button>
          </div>

          {/* AI Quick-Wins Sprint */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-center w-12 h-12 bg-[#10b981] rounded-lg mb-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-[#1e293b] mb-3">
              AI Quick-Wins Sprint
            </h3>
            <p className="text-[#64748b] mb-6 text-sm leading-relaxed">
              Surface fastest impact opportunities & AI-powered workflows tailored for your team&apos;s day-to-day needs.
            </p>
            
            <div className="mb-6">
              <h4 className="font-medium text-[#1e293b] mb-3">What&apos;s included:</h4>
              <ul className="space-y-2 text-sm text-[#64748b]">
                <li>• One-week mapping: team vs. impact</li>
                <li>• Workflow selection (via detailed brief)</li>
                <li>• Design & setup of 3 quick-win AI workflows</li>
                <li>• Team training & handoff</li>
                <li>• Playbooks + team training</li>
              </ul>
            </div>

            <div className="mb-6">
              <p className="text-xs text-[#64748b] leading-relaxed">
                <strong>Outcome:</strong> 3 live workflows, documented implementation + live team skilled to continue implementation on their own going forward.
              </p>
            </div>

            <button className="cursor-pointer font-semibold w-full bg-[#10b981] text-white font-medium py-3 px-4 rounded-lg hover:bg-green-600 transition-colors">
              Explore AI Quick-Wins
            </button>
          </div>

          {/* Ongoing Program Management */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-center w-12 h-12 bg-[#1f2937] rounded-lg mb-4">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-[#1e293b] mb-3">
              Ongoing Program Management
            </h3>
            <p className="text-[#64748b] mb-6 text-sm leading-relaxed">
              Keep agencies aligned and AI launching as seamlessly. We optimize performance and catching workflow.
            </p>
            
            <div className="mb-6">
              <h4 className="font-medium text-[#1e293b] mb-3">What&apos;s included:</h4>
              <ul className="space-y-2 text-sm text-[#64748b]">
                <li>• Ongoing agency relationship & performance</li>
                <li>• Monthly agency coordination calls & QBRs</li>
                <li>• AI+Workflows & budget pacing</li>
                <li>• Guidance: AI workflow optimization</li>
              </ul>
            </div>

            <div className="mb-6">
              <p className="text-xs text-[#64748b] leading-relaxed">
                <strong>Outcome:</strong> Great agency, strategic AI+ integration building, and smooth execution monthly + quarterly deliverables.
              </p>
            </div>

            <button className="cursor-pointer font-semibold w-full bg-[#1f2937] text-white font-medium py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors">
              Get Ongoing Program
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;