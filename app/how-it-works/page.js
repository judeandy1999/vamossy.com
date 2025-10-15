'use client';
import React from 'react';
import { Search, Users, Bot, CheckCircle, ArrowRight, Clock, Target, Zap, Building2 } from 'lucide-react';

export default function HowItWorksPage() {
  const [activeTab, setActiveTab] = React.useState(0);

  // Centralized data structure for all services
  const services = [
    {
      id: 'agency-match',
      shortName: 'Agency Matchmaking',
      icon: <Search className="w-6 h-6" />,
      title: "Agency Matchmaking",
      description: "Choosing an agency shouldn't feel like gambling. With Vamossy, you skip the guesswork and connect directly with proven ecommerce agencies that fit your exact needs.",
      cta: "Find My Agency Match",
      steps: [
        {
          title: "Tell Us Your Goals",
          description: "We understand what growth means for you—whether it's scaling revenue, improving retention, or breaking into new markets."
        },
        {
          title: "Get Matched",
          description: "Data-driven matching with vetted ecommerce agencies that have proven track records in your category. No bias, just results."
        },
        {
          title: "Launch Fast",
          description: "Your growth sprint begins within days. We structure projects so you can track measurable ROI in your first 30 days."
        },
        {
          title: "Stay Supported",
          description: "We don't disappear after the intro. Vamossy ensures your partnership keeps delivering results, month after month."
        }
      ],
      benefits: [
        "Save time — find your perfect-fit agency in weeks, not months",
        "Reduce risk — only work with vetted, proven partners",
        "Accelerate growth — launch faster and measure ROI from day one",
        "Stay supported — ongoing guidance to ensure success"
      ],
      benefitsTitle: "Why Ecommerce Brands Choose Vamossy",
      audiences: [
        {
          icon: <Users className="w-5 h-5 text-white" />,
          title: "Ecommerce Founders & CMOs",
          points: [
            "Scale revenue without wasted experiments",
            "Get matched with agencies that understand your industry",
            "Save months of searching and pitching"
          ]
        },
        {
          icon: <Building2 className="w-5 h-5 text-white" />,
          title: "Agencies",
          points: [
            "Receive warm introductions to vetted brands",
            "Eliminate misaligned leads",
            "Build long-term, profitable relationships"
          ]
        },
        {
          icon: <Target className="w-5 h-5 text-white" />,
          title: "Investors & Portfolios",
          points: [
            "Align portfolio companies with proven partners",
            "Drive performance gains across multiple brands",
            "Scale smarter with less risk"
          ]
        }
      ]
    },
    {
      id: 'project-support',
      shortName: 'Project Coordination',
      icon: <Building2 className="w-6 h-6" />,
      title: "Project Coordination",
      description: "Big ecommerce ideas can fall apart without the right plan. We help you scope, organize, and manage projects so you get exactly what you want—delivered on time and built to scale.",
      cta: "Start Your Project With Us",
      steps: [
        {
          title: "Diagnose Your Needs",
          description: "Deep dive into your current setup, challenges, and goals to identify bottlenecks and opportunities before work begins."
        },
        {
          title: "Define Clear Specs",
          description: "Translate your goals into crystal-clear requirements, giving agencies a roadmap they can execute with precision."
        },
        {
          title: "Structure for Success",
          description: "Create detailed frameworks with timelines, roles, milestones, and ROI benchmarks so everyone knows what success looks like."
        },
        {
          title: "Manage & Monitor",
          description: "Oversee execution, coordinate with all stakeholders, and solve issues quickly to avoid costly delays and ensure delivery."
        }
      ],
      benefits: [
        "Get exactly what you envisioned—no missed details or miscommunication",
        "Save time—we handle organization so you don't have to",
        "Stay in control—see progress clearly without getting bogged down",
        "Ensure ROI—every project structured to deliver measurable outcomes"
      ],
      benefitsTitle: "Why Ecommerce Brands Trust Vamossy Project Support",
      audiences: [
        {
          icon: <Users className="w-5 h-5 text-white" />,
          title: "Founders & CMOs",
          points: [
            "Translate growth goals into executable projects",
            "Avoid wasted spend on unclear briefs or scope creep",
            "Stay focused on strategy while we handle execution"
          ]
        },
        {
          icon: <Zap className="w-5 h-5 text-white" />,
          title: "Teams in Growth Mode",
          points: [
            "Launch initiatives faster with expert organization",
            "Gain a trusted partner to manage complexity",
            "Keep internal focus on high-impact work"
          ]
        },
        {
          icon: <Target className="w-5 h-5 text-white" />,
          title: "Scaling Brands",
          points: [
            "Execute complex projects without internal overwhelm",
            "Ensure vendor alignment and accountability",
            "Deliver on time and on budget consistently"
          ]
        }
      ]
    },
    {
      id: 'ai-solutions',
      shortName: 'AI Solutions',
      icon: <Bot className="w-6 h-6" />,
      title: "AI Solutions",
      description: "AI can unlock massive growth in ecommerce—but only if implemented the right way. We help you cut through the noise and deploy solutions that deliver measurable ROI in weeks, not years.",
      cta: "Start Your AI Sprint",
      steps: [
        {
          title: "Discover Opportunities",
          description: "AI readiness audit to identify areas where AI can have biggest impact: acquisition, retention, or operational automation."
        },
        {
          title: "Design AI Sprint",
          description: "Custom AI sprint that fits your goals—boosting conversions, reducing churn, or streamlining workflows for fast wins."
        },
        {
          title: "Deploy With Guidance",
          description: "Seamless integration into your existing stack. Plug-and-play simplicity without the steep learning curve."
        },
        {
          title: "Scale Results",
          description: "Track performance, refine execution, and expand AI across other areas for sustained growth and compounding value."
        }
      ],
      benefits: [
        "Proven ROI — measurable results in 30–60 days",
        "Plug-and-play simplicity — no heavy IT lift required",
        "Independent advice — we only recommend tools that work",
        "Future-proof growth — scale smarter with AI that compounds value"
      ],
      benefitsTitle: "Why Ecommerce Brands Choose Vamossy for AI",
      audiences: null // AI section doesn't have audience section
    }
  ];

  const activeService = services[activeTab];

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-br from-[#f3f6f9] to-[#f1f6fe] py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-[#1e283c] leading-tight mb-6">
            How We Drive <span className="text-[#3b82f6]">Ecommerce Growth</span>
          </h1>
          <p className="text-lg md:text-xl text-[#505a66] mb-12 max-w-3xl mx-auto">
            Find the right partner. Scale faster. Grow smarter. Here&apos;s how Vamossy removes the guesswork from ecommerce growth through three proven approaches.
          </p>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-evenly items-center gap-4 mb-12">
            {services.map((service, index) => (
              <button
                key={service.id}
                onClick={() => setActiveTab(index)}
                className={`cursor-pointer flex items-center gap-3 px-6 py-4 rounded-lg font-semibold transition-all duration-300 min-w-[90%] md:min-w-[30%] justify-center ${
                  activeTab === index
                    ? 'bg-[#1f2937] text-white shadow-lg'
                    : 'bg-gray-100 text-[#505a66] hover:bg-gray-200'
                }`}
              >
                <span className={activeTab === index ? 'text-white' : 'text-[#3b82f6]'}>
                  {service.icon}
                </span>
                {service.shortName}
              </button>
            ))}
          </div>

          {/* Active Service Content */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg">
            {/* Service Header */}
            <div className="p-8 text-white bg-[#1f2937]">
              <div className="flex items-center gap-4 mb-4">
                <div>
                  <h2 className="text-3xl font-bold mb-2">
                    How It Works: {activeService.title}
                  </h2>
                  <p className=" text-lg">
                    {activeService.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Service Content */}
            <div className="p-8">
              {/* Steps */}
              <div className="mb-12">
                <h3 className="text-2xl font-semibold text-[#1e283c] mb-8 text-center">
                  Our Process
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                  {activeService.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex gap-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-[#3b82f6] rounded-full flex-shrink-0">
                        <span className="text-white font-bold text-lg">{stepIndex + 1}</span>
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-[#1e283c] mb-3">
                          {step.title}
                        </h4>
                        <p className="text-[#505a66] leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div className="mb-12">
                <h3 className="text-2xl font-semibold text-[#1e283c] mb-8 text-center">
                  {activeService.benefitsTitle}
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {activeService.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-start gap-3 bg-[#f8fafc] p-4 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-[#3b82f6] flex-shrink-0 mt-0.5" />
                      <span className="text-[#505a66]">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Audiences */}
              {activeService.audiences && (
                <div className="mb-12">
                  <h3 className="text-2xl font-semibold text-[#1e283c] mb-8 text-center">
                    Perfect For
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    {activeService.audiences.map((audience, audienceIndex) => (
                      <div key={audienceIndex} className="bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] p-6 rounded-xl text-center">
                        <div className="flex items-center justify-center w-12 h-12 bg-[#3b82f6] rounded-full mb-4 mx-auto">
                          {audience.icon}
                        </div>
                        <h4 className="font-semibold text-[#1e283c] mb-3">
                          {audience.title}
                        </h4>
                        <ul className="space-y-2 text-left">
                          {audience.points.map((point, pointIndex) => (
                            <li key={pointIndex} className="text-[#505a66] text-sm flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-[#3b82f6] rounded-full mt-2 flex-shrink-0" />
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="text-center">
                <button
                  className="cursor-pointer bg-[#3b82f6] text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:bg-blue-800 hover:scale-105 transition-all duration-200 flex items-center justify-center mx-auto"
                  data-cal-link="dev-vamossy/discovery-call"
                  data-cal-namespace="discovery-call"
                  data-cal-config='{"layout":"month_view"}'
                >
                  {activeService.cta}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4" style={{ background: 'linear-gradient(135deg, #1e377a 0%, #1e3e9f 100%)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Experience Growth Without Guesswork?
          </h2>
          <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
            Whether you need the right agency, seamless project execution, or AI that delivers ROI—Vamossy has the framework to accelerate your success.
          </p>
          <button
            className="cursor-pointer bg-[#3b82f6] text-white font-semibold py-5 px-10 rounded-xl shadow-lg hover:bg-blue-600 hover:scale-105 transition-all duration-200 flex items-center justify-center mx-auto text-lg"
            data-cal-link="dev-vamossy/discovery-call"
            data-cal-namespace="discovery-call"
            data-cal-config='{"layout":"month_view"}'
          >
            <Clock className="w-6 h-6 mr-3" />
            See How It Works for Your Business
          </button>
        </div>
      </section>
    </>
  );
}