import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, Star, TrendingUp, CheckCircle, Quote, Calendar, Tag } from 'lucide-react';
import { getCaseStudyById } from '@/data/caseStudies';

export default function CaseStudyDetailPage({ params }) {
  const caseStudy = getCaseStudyById(params.id);

  if (!caseStudy) {
    notFound();
  }

  return (
    <div className="bg-[#f1f5fb] min-h-screen font-sans">
      {/* Header */}
      <section className="py-8 px-4 bg-white shadow-sm">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 text-[#1f40af] hover:text-blue-800 transition mb-6 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Case Studies
          </Link>
          
          <div className="flex items-center gap-2 mb-4">
            <span className="flex items-center justify-center rounded-lg p-2 bg-[#2fc55f] text-white">
              <Star className="w-5 h-5" />
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-[#dcfce6] text-[#37ae61]">
              Case Study
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-[#1e283c] mb-4 font-sans">
            {caseStudy.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-[#505a66] mb-6">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="font-medium">{caseStudy.readTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="font-medium">{new Date(caseStudy.publishedDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              <span className="font-medium">{caseStudy.industry}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {caseStudy.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-[#f1f5fb] text-[#1f40af] text-sm rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          <p className="text-lg text-[#505a66] leading-relaxed font-normal">
            {caseStudy.summary}
          </p>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1e283c] mb-8 text-center font-sans">
            Key Results
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Object.entries(caseStudy.metrics).map(([key, value]) => (
              <div key={key} className="bg-white rounded-xl p-6 text-center shadow-lg">
                <div className="text-3xl font-bold text-[#1f40af] mb-2 font-sans">{value}</div>
                <div className="text-sm text-[#505a66] capitalize font-medium">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Background */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1e283c] mb-8 font-sans">
            Client Background
          </h2>
          <div className="bg-[#f6f8fc] rounded-xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                {Object.entries(caseStudy.clientBackground)
                  .slice(0, Math.ceil(Object.keys(caseStudy.clientBackground).length / 2))
                  .map(([key, value]) => {
                    // Convert camelCase to Title Case for display
                    const displayKey = key
                      .replace(/([A-Z])/g, ' $1')
                      .replace(/^./, str => str.toUpperCase());
                    
                    return (
                      <div key={key} className="mb-4 last:mb-0">
                        <h3 className="font-semibold text-[#1e283c] mb-2 font-sans">{displayKey}</h3>
                        <p className="text-[#505a66] font-normal">{value}</p>
                      </div>
                    );
                  })}
              </div>
              <div>
                {Object.entries(caseStudy.clientBackground)
                  .slice(Math.ceil(Object.keys(caseStudy.clientBackground).length / 2))
                  .map(([key, value]) => {
                    // Convert camelCase to Title Case for display
                    const displayKey = key
                      .replace(/([A-Z])/g, ' $1')
                      .replace(/^./, str => str.toUpperCase());
                    
                    return (
                      <div key={key} className="mb-4 last:mb-0">
                        <h3 className="font-semibold text-[#1e283c] mb-2 font-sans">{displayKey}</h3>
                        <p className="text-[#505a66] font-normal">{value}</p>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1e283c] mb-8 font-sans">
            {caseStudy.problemStatement.title}
          </h2>
          <div className="space-y-6">
            {caseStudy.problemStatement.challenges.map((challenge, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="font-bold text-[#1e283c] text-lg mb-3 font-sans">{challenge.title}</h3>
                <p className="text-[#505a66] leading-relaxed font-normal">{challenge.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1e283c] mb-8 font-sans">
            {caseStudy.solution.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {caseStudy.solution.approach.map((approach, index) => (
              <div key={index} className="bg-[#f6f8fc] rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-8 h-8 rounded-full bg-[#1f40af] text-white font-bold flex items-center justify-center text-sm font-sans">
                    {index + 1}
                  </span>
                  <h3 className="font-bold text-[#1e283c] text-lg font-sans">{approach.phase}</h3>
                </div>
                <p className="text-[#505a66] leading-relaxed font-normal">{approach.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Implementation */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1e283c] mb-8 font-sans">
            Implementation Process
          </h2>
          <div className="space-y-6">
            {caseStudy.implementation.phases.map((phase, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-start gap-4">
                  <span className="w-10 h-10 rounded-full bg-[#1f40af] text-white font-bold flex items-center justify-center flex-shrink-0 font-sans">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                      <h3 className="font-bold text-[#1e283c] text-lg font-sans">{phase.title}</h3>
                      <span className="text-[#1f40af] font-semibold text-sm font-sans">{phase.duration}</span>
                    </div>
                    <ul className="space-y-2">
                      {phase.outcomes.map((outcome, outcomeIndex) => (
                        <li key={outcomeIndex} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-[#2fc55f] flex-shrink-0 mt-0.5" />
                          <span className="text-[#505a66] font-normal">{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1e283c] mb-8 font-sans">
            Results & Outcomes
          </h2>
          <div className="space-y-6">
            {caseStudy.results.primaryOutcomes.map((outcome, index) => (
              <div key={index} className="bg-[#f6f8fc] rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <TrendingUp className="w-8 h-8 text-[#2fc55f] flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-[#1e283c] text-lg mb-2 font-sans">{outcome.metric}</h3>
                    <p className="text-[#1f40af] font-semibold mb-2 font-sans">{outcome.result}</p>
                    <p className="text-[#505a66] font-normal">{outcome.impact}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-[#1f2937] rounded-2xl p-8 md:p-12 text-white text-center">
            <Quote className="w-12 h-12 mx-auto mb-6 opacity-50" />
            <blockquote className="text-lg md:text-xl leading-relaxed mb-6 italic font-normal">
              &ldquo;{caseStudy.testimonial.quote}&rdquo;
            </blockquote>
            <cite className="font-semibold font-sans">
              — {caseStudy.testimonial.author}, {caseStudy.testimonial.company}
            </cite>
          </div>
        </div>
      </section>

      {/* Key Takeaways */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1e283c] mb-8 font-sans">
            Key Takeaways
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {caseStudy.keyTakeaways.map((takeaway, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-[#2fc55f] flex-shrink-0 mt-1" />
                <p className="text-[#505a66] leading-relaxed font-normal">{takeaway}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-[#f1f5fb]">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1e283c] mb-4 font-sans">
            Ready to achieve similar results?
          </h2>
          <p className="text-lg text-[#505a66] mb-8 font-normal">
            Let&apos;s discuss how we can help your business overcome challenges and achieve measurable growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="cursor-pointer bg-[#1f40af] text-white font-semibold py-3 px-6 rounded-lg shadow hover:bg-blue-800 transition font-sans"
              data-cal-link="dev-vamossy/discovery-call"
              data-cal-namespace="discovery-call"
              data-cal-config='{"layout":"month_view"}'
            >
              Book a Discovery Call
            </button>
            <Link
              href="/case-studies"
              className="cursor-pointer border border-[#1f40af] text-[#1f40af] font-semibold py-3 px-6 rounded-lg hover:bg-blue-50 transition inline-block text-center font-sans"
            >
              View More Case Studies
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}