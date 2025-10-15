'use client';
import React, { useState, useEffect } from 'react';
import { Users, Zap, Bot, Star, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const EcommerceGrowthPartner = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      quote: "Partnering with Vamossy gave us clarity and momentum we didn&apos;t know we were missing.",
      author: "Sarah Chen",
      title: "Founder, Urban Botanics"
    },
    {
      quote: "The agency matchmaking process saved us months of trial and error. We found our perfect partner in just two weeks.",
      author: "Michael Rodriguez",
      title: "CEO, FitLife Nutrition"
    },
    {
      quote: "Their AI implementation increased our conversion rate by 35% within the first quarter. The ROI was immediate.",
      author: "Jessica Park",
      title: "VP of Marketing, TechStyle Collective"
    },
    {
      quote: "Finally, project coordination that actually works. Every deadline met, every goal exceeded. Game-changing partnership.",
      author: "David Thompson",
      title: "Operations Director, Coastal Home Co."
    }
  ];

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1e293b] mb-6">
            Your Ecommerce Growth Partner
          </h2>
          <p className="text-lg text-[#64748b] max-w-4xl mx-auto leading-relaxed">
            At Vamossy, we believe ecommerce brands deserve more than scattered efforts and mismatched partnerships. 
            Growth should feel seamless, not chaotic. That&apos;s why we help ambitious stores find the right partners, 
            run projects with clarity, and implement smart AI tools that deliver measurable ROI.
          </p>
          <p className="text-lg text-[#64748b] max-w-4xl mx-auto leading-relaxed mt-4">
            When you work with us, you gain more than services — you gain a partner committed to making every part 
            of your business more efficient, more profitable, and more scalable.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Agency Matchmaking */}
          <div className="bg-gray-50 p-8 rounded-lg">
            <div className="flex items-center justify-center w-16 h-16 bg-[#3b82f6] rounded-full mb-6">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-[#1e293b] mb-4">
              Agency Matchmaking: The Right Partner, Every Time
            </h3>
            <p className="text-[#64748b] leading-relaxed">
              Choosing the wrong agency can cost months of momentum. We take that risk off your plate. 
              Through tailored matchmaking, Vamossy connects you with the ideal partners for your ecommerce 
              goals — whether you need marketing, development, or creative expertise. The result? Stronger 
              collaborations and faster progress.
            </p>
          </div>

          {/* Project Coordination */}
          <div className="bg-gray-50 p-8 rounded-lg">
            <div className="flex items-center justify-center w-16 h-16 bg-[#10b981] rounded-full mb-6">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-[#1e293b] mb-4">
              Project Coordination: Smooth, Efficient, Effective
            </h3>
            <p className="text-[#64748b] leading-relaxed">
              Even the best strategy falls apart without flawless execution. We bring order to the moving 
              parts of your projects, ensuring teams stay aligned, deadlines are met, and nothing gets lost 
              in translation. With Vamossy coordinating, your initiatives run on time, on budget, and with 
              maximum impact.
            </p>
          </div>

          {/* AI Tool Implementation */}
          <div className="bg-gray-50 p-8 rounded-lg">
            <div className="flex items-center justify-center w-16 h-16 bg-[#1f2937] rounded-full mb-6">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-[#1e293b] mb-4">
              AI Tool Implementation: ROI That Scales
            </h3>
            <p className="text-[#64748b] leading-relaxed">
              Ecommerce moves fast. AI helps you move faster. From automating repetitive tasks to unlocking 
              new revenue opportunities, we implement tools that fit your business — not the other way around. 
              The outcome: sharper decisions, higher margins, and growth that compounds.
            </p>
          </div>
        </div>

        {/* Testimonial Carousel Section */}
        <div className="bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] p-8 rounded-lg mb-16 relative">
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-[#3b82f6] rounded-full mb-6 mx-auto">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-[#1e293b] mb-8">
              Trusted by Ecommerce Leaders
            </h3>
            
            {/* Testimonial Slider */}
            <div className="relative overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <blockquote className="text-lg text-[#64748b] italic mb-4 max-w-2xl mx-auto">
                      &ldquo;{testimonial.quote}&rdquo;
                    </blockquote>
                    <p className="text-sm text-[#64748b] font-semibold">
                      — {testimonial.author}
                    </p>
                    <p className="text-xs text-[#64748b] mt-1">
                      {testimonial.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows  */}
            <div className="flex justify-center items-center mt-6 space-x-4">
              <button
                onClick={prevTestimonial}
                className="cursor-pointer p-2 rounded-full bg-[#1f2937] shadow-md hover:shadow-lg transition-shadow duration-200"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              
              {/* Dots Indicator */}
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                      index === currentTestimonial ? 'bg-[#3b82f6]' : 'bg-[#64748b]'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
              
              <button
                onClick={nextTestimonial}
                className="cursor-pointer p-2 rounded-full bg-[#1f2937] shadow-md hover:shadow-lg transition-shadow duration-200"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>

            <p className="text-[#64748b] mt-8 max-w-3xl mx-auto">
              With proven processes, trusted expertise, and a commitment to results, we&apos;ve guided ecommerce 
              brands of all sizes toward smoother operations and stronger growth.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-[#1e293b] mb-4">
            Ready to Grow Smarter?
          </h3>
          <p className="text-lg text-[#64748b] mb-8 max-w-2xl mx-auto">
            Your ecommerce business deserves strategies and systems that actually work. Let&apos;s build them together.
          </p>
          
          {/* Primary CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="cursor-pointer bg-[#1f2937] text-white font-semibold py-4 px-8 rounded-lg shadow-lg hover:bg-[#6b7280] hover:scale-105 transition-all duration-200 flex items-center justify-center">
              Start Your Partnership with Vamossy Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>

          {/* Alternative CTAs for A/B testing (commented out) */}
          {/* 
          <div className="mt-4 text-sm text-[#64748b]">
            Alternative CTA Options:
            <br />
            • Let's Build Your Growth Plan Together
            <br />
            • Book Your First Step with Vamossy Now
            <br />
            • Discover How Vamossy Can Scale Your Store
          </div>
          */}
        </div>
      </div>
    </section>
  );
};

export default EcommerceGrowthPartner;