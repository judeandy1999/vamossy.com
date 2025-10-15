import React from "react";

const steps = [
  {
    title: "Diagnose",
    description:
      "We uncover growth bottlenecks with audits, performance data, and stack analysis.",
    color: "bg-[#fffff]",
    circle: "bg-[#1f40af]",
  },
  {
    title: "Design",
    description:
      "We create the right plan—matching you with a best-fit agency while layering in AI solutions that have proven results in ecommerce.",
    color: "bg-[#ffffff]",
    circle: "bg-[#3c82f6]",
  },
  {
    title: "Deploy",
    description:
      "We launch quickly. Your agency and AI sprint are activated within days, not months.",
    color: "bg-[#fffff]",
    circle: "bg-[#1f40af]",
  },
  {
    title: "Deliver",
    description:
      "We track performance, refine execution, and ensure ROI compounds month after month.",
    color: "bg-[#ffffff]",
    circle: "bg-[#3c82f6]",
  },
];

export default function ProvenFramework() {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto relative">
        <h2 className="text-3xl md:text-5xl font-bold text-[#1e283c] mb-8 text-center">
          A Proven Framework for Scalable Growth
        </h2>
        <div className="flex flex-col gap-8 relative px-8 md:px-0">
          {steps.map((step, idx) => {
            const isLeft = idx % 2 === 0;
            return (
              <div key={step.title} className="relative flex items-center md:w-3xl mx-auto">
                {/* Step Card */}
                <div
                  className={`flex-1 rounded-full ${step.color} shadow-lg px-8 py-6 flex flex-col justify-center`}
                >
                  <div className="font-bold text-xl mb-2 text-[#505a66]">{step.title}</div>
                  <div className="text-sm text-[#505a66]">{step.description}</div>
                </div>
                {/* Number Circle */}
                <div
                  className={`absolute z-10 top-1/2 -translate-y-1/2 -left-8`}
                >
                  <div
                    className={`w-14 h-14 flex items-center justify-center rounded-full border-4 border-gray-200 ${step.circle} text-white text-2xl font-bold shadow-lg`}
                  >
                    {idx + 1}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}