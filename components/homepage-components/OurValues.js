import React from 'react';
import { ClipboardList, Handshake, FileText } from 'lucide-react';

const benefits = [
  {
    title: 'Project Planning',
    description: 'Strategic foundation for your success',
    icon: ClipboardList,
    features: [
      'Free project brainstorming consultation',
      'Clarity from the start',
      'Vetting the best projects',
      'No more guesswork',
      'Data-driven insights',
      'Resource optimization',
      'Risk reduction',
      'Tech stack alignment',
      'Timeline realism',
      'Stakeholder alignment',
      'Growth forecasting'
    ]
  },
  {
    title: 'Independent Guidance & Matchmaking',
    description: 'Perfect partnerships, verified expertise',
    icon: Handshake,
    features: [
      'Fair pricing',
      'Greatly reduced risk',
      'Perfect-fit partner matching',
      'Verified expertise',
      'Save weeks of research',
      'Transparent comparisons',
      'Specialist access',
      'Objective selection process',
      'Faster project starts',
      'Global partner network',
      'Proven track records',
      'Ongoing support'
    ]
  },
  {
    title: 'Specification & Overview',
    description: 'Crystal clear project execution',
    icon: FileText,
    features: [
      'Clear project specs',
      'Scope control',
      'Unified project vision',
      'Eliminate ambiguity',
      'Developer-ready briefs',
      'Prioritized feature lists',
      'Cost and timeline accuracy',
      'Benchmark quality standards',
      'Documentation ownership',
      'Cross-team alignment',
      'Vendor accountability'
    ]
  }
];

const OurValue = () => (
  <section className="py-16 px-4" style={{ background: 'linear-gradient(135deg, #183275 0%, #1e3e9f 100%)' }}>
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Our Core Benefits</h2>
        <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
          Comprehensive solutions that transform how you approach ecommerce projects with proven methodologies and expert guidance.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {benefits.map((benefit, idx) => {
          const IconComponent = benefit.icon;
          return (
            <div
              key={idx}
              className="bg-white/10 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center">
                  <IconComponent className="w-40 h-40 text-white" />
                </div>
                <h3 className="font-semibold text-xl text-white mb-2">{benefit.title}</h3>
                <p className="text-white text-sm leading-relaxed">{benefit.description}</p>
              </div>
              
              <ul className="space-y-2">
                {benefit.features.map((feature, featureIdx) => (
                  <li key={featureIdx} className="flex items-start text-sm">
                    <span className="inline-block w-1.5 h-1.5 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-white">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

export default OurValue;