import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import { ArrowLeft, Clock, Star, TrendingUp, CheckCircle, Quote, Calendar, Tag, Users, Target } from 'lucide-react';
import { getCaseStudyById } from '@/data/caseStudies';
import { generateCaseStudyMetadata, generateArticleSchema, generateBreadcrumbSchema } from '@/utils/seo';

// Generate metadata for the page
export async function generateMetadata({ params }) {
  const caseStudy = getCaseStudyById(params.id);
  
  if (!caseStudy) {
    return {
      title: 'Case Study Not Found',
      description: 'The requested case study could not be found.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }
  
  // Generate metadata with noindex
  const metadata = generateCaseStudyMetadata(caseStudy);
  return {
    ...metadata,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function CaseStudyDetailPage({ params }) {
  const caseStudy = getCaseStudyById(params.id);

  if (!caseStudy) {
    notFound();
  }

  // Generate structured data
  const caseStudySchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": caseStudy.title,
    "description": caseStudy.summary,
    "author": {
      "@type": "Organization",
      "name": "Vamossy Digital"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Vamossy Digital",
      "logo": {
        "@type": "ImageObject",
        "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://vamossy.com'}/logo.png`
      }
    },
    "datePublished": caseStudy.publishedDate,
    "dateModified": caseStudy.publishedDate,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://vamossy.com'}${caseStudy.seo.url}`
    },
    "keywords": caseStudy.tags.join(', '),
    "articleSection": "Case Studies",
    "wordCount": caseStudy.readTime
  };

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Case Studies", url: "/case-studies" },
    { name: caseStudy.title, url: caseStudy.seo.url }
  ]);

  return (
    <>
      {/* Structured Data */}
      <Script
        id="case-study-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(caseStudySchema),
        }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      
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
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {caseStudy.keyResults.map((result, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center shadow-lg">
                <div className="text-3xl font-bold text-[#1f40af] mb-2 font-sans">{result.value}</div>
                <div className="text-sm text-[#505a66] capitalize font-medium">
                  {result.metric}
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
            Approach
          </h2>
          <div className="space-y-6">
            {caseStudy.implementation.phases.map((phase, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-start gap-4">
                  <span className="w-10 h-10 rounded-full bg-[#1f40af] text-white font-bold flex items-center justify-center flex-shrink-0 font-sans">
                    {phase.step}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-bold text-[#1e283c] text-lg mb-3 font-sans">{phase.title}</h3>
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

      {/* Implementation Highlights */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1e283c] mb-8 font-sans">
            Implementation Highlights
          </h2>
          <div className="space-y-8">
            {Object.entries(caseStudy.implementationHighlights).map(([key, section]) => (
              <div key={key} className="bg-[#f6f8fc] rounded-xl p-8">
                <h3 className="font-bold text-[#1e283c] text-xl mb-4 font-sans">{section.title}</h3>
                <ul className="space-y-3">
                  {section.achievements.map((achievement, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#2fc55f] flex-shrink-0 mt-0.5" />
                      <span className="text-[#505a66] font-normal">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1e283c] mb-8 font-sans">
            Results
          </h2>
          
          {/* Performance Gains */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-[#1e283c] mb-6 font-sans">
              {caseStudy.results.performanceGains.title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {caseStudy.results.performanceGains.metrics.map((metric, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center gap-4">
                    <TrendingUp className="w-8 h-8 text-[#2fc55f] flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-[#1e283c] font-sans">{metric.metric}</h4>
                      <p className="text-[#1f40af] font-bold text-lg font-sans">{metric.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Operational Impact */}
          <div>
            <h3 className="text-xl font-bold text-[#1e283c] mb-6 font-sans">
              {caseStudy.results.operationalImpact.title}
            </h3>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <ul className="space-y-3">
                {caseStudy.results.operationalImpact.metrics.map((metric, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#2fc55f] flex-shrink-0 mt-0.5" />
                    <span className="text-[#505a66] font-normal">{metric}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Team & Collaboration */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1e283c] mb-8 font-sans">
            Team & Collaboration
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-[#f6f8fc] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-[#1f40af]" />
                <h3 className="font-bold text-[#1e283c] font-sans">Client Team</h3>
              </div>
              <ul className="space-y-2">
                {caseStudy.teamCollaboration.client.map((member, index) => (
                  <li key={index} className="text-[#505a66] font-normal">{member}</li>
                ))}
              </ul>
            </div>
            
            <div className="bg-[#f6f8fc] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-[#2fc55f]" />
                <h3 className="font-bold text-[#1e283c] font-sans">Vamossy Digital</h3>
              </div>
              <ul className="space-y-2">
                {caseStudy.teamCollaboration.vamossyDigital.map((member, index) => (
                  <li key={index} className="text-[#505a66] font-normal">{member}</li>
                ))}
              </ul>
            </div>
            
            <div className="bg-[#f6f8fc] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-[#1f40af]" />
                <h3 className="font-bold text-[#1e283c] font-sans">Partners</h3>
              </div>
              <ul className="space-y-2">
                {caseStudy.teamCollaboration.partners.map((partner, index) => (
                  <li key={index} className="text-[#505a66] font-normal">{partner}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="bg-[#f6f8fc] rounded-xl p-6">
            <h3 className="font-bold text-[#1e283c] mb-2 font-sans">Collaboration Cadence</h3>
            <p className="text-[#505a66] font-normal">{caseStudy.teamCollaboration.cadence}</p>
          </div>
        </div>
      </section>

      {/* Key Takeaways */}
      <section className="py-12 px-4">
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
    </>
  );
}