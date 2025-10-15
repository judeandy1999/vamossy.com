import React from 'react';
import { Users, Building2, FileText, Settings } from 'lucide-react';

const WhoWeAre = () => {
  return (
    <section className="py-16 px-4 bg-[#f9fafb]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1f40af] mb-6">
            Who We Are
          </h2>
          <p className="text-lg text-[#4b5562] max-w-3xl mx-auto mb-8">
            Vamossy is a growth partner for ambitious ecommerce brands and specialist digital agencies. 
            We combine agency matchmaking with AI-powered execution to remove the guesswork from 
            scaling.
          </p>
        </div>

        {/* Our Mission */}
        <div>
          <h3 className="text-2xl font-bold text-[#1f40af] mb-8 text-left">Our Mission</h3>
          
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Left side - Mission points */}
            <div className="flex-1 space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#1f40af] rounded-full flex items-center justify-center mt-1">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <div>
                  <p className="text-[#4b5562]">
                    We connect the right agencies—without endless sales pitches 
                    or long-term commitments.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#1f40af] rounded-full flex items-center justify-center mt-1">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <div>
                  <p className="text-[#4b5562]">
                    We combine smart clients and our unmatched projects with AI 
                    workflows that actually drive results.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#1f40af] rounded-full flex items-center justify-center mt-1">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <div>
                  <p className="text-[#4b5562]">
                    We operate as independent operators—not middlemen. We don&apos;t take 
                    kickbacks, we don&apos;t push vendors, and we measure success in real 
                    outcomes.
                  </p>
                </div>
              </div>
            </div>

            {/* Right side - Grid with cards */}
            <div className="flex-1 md:mt-[-3rem]">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white shadow rounded-lg p-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-[#1f40af] rounded-lg mb-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-[#1f40af] mb-2">For Brands</h4>
                  <p className="text-sm text-[#4b5562]">Curated agencies that are vetted, aligned, and proven</p>
                </div>
                
                <div className="bg-white shadow rounded-lg p-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-[#1f40af] rounded-lg mb-4">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-[#1f40af] mb-2">For Agencies</h4>
                  <p className="text-sm text-[#4b5562]">Pre-qualified clients and AI processes</p>
                </div>
                
                <div className="bg-white shadow rounded-lg p-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-[#1f40af] rounded-lg mb-4">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-[#1f40af] mb-2">KPI-Tied Pilots</h4>
                  <p className="text-sm text-[#4b5562]">Prove fit before scaling</p>
                </div>
                
                <div className="bg-white shadow rounded-lg p-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-[#1f40af] rounded-lg mb-4">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-[#1f40af] mb-2">AI Workflows</h4>
                  <p className="text-sm text-[#4b5562]">Efficient and transparent reporting</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;