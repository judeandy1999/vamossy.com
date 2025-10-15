import React from 'react';

const faqs = [
  {
    q: 'What does “AI implementation” actually mean here?',
    a: 'Practical workflows (prompts, SOPs, QA gates) embedded in your stack—creative assist, CRM/email, ad ops, analytics, support. We design, pilot, document, train, and hand over.',
  },
  {
    q: 'How fast can we get a shortlist?',
    a: 'Typically days, not weeks. You’ll see 3–5 best-fit agencies with fit scoring, references, and comparable scopes.',
  },
  {
    q: 'What if the pilot underperforms?',
    a: 'We course-correct mid-pilot. If KPIs aren’t met, you’ll get a clear “keep/scale/replace” recommendation and alternates—no sunk-cost trap.',
  },
  {
    q: 'Are you tied to specific tools or platforms?',
    a: 'No vendor bias. We’re platform-agnostic (Shopify/Headless, common ad/CRM/analytics stacks) and choose tools that fit your goals, security, and budget.',
  },
  {
    q: 'How do you handle data privacy and security?',
    a: 'Least-privilege access, NDA by default, optional DPA, and clear data-handling SOPs. For AI, we set governance (roles, approvals, retention) and avoid sending sensitive data to unmanaged services.',
  },
  {
    q: 'Can you work with our existing agency roster?',
    a: 'Yes. We evaluate, tune scopes, add AI workflows, and govern cadence/SLA. If gaps exist, we introduce specialists.',
  },
  {
    q: 'Will agencies increase prices because you’re involved?',
    a: 'We normalize scopes/pricing up front and negotiate SLAs. Your spend stays focused on outcomes, not layers of margin.',
  },
  {
    q: 'What does success look like—and how is it measured?',
    a: 'Defined KPIs before work starts (e.g., CPA/ROAS, LTV/CAC, CR lift, cycle time saved). You’ll get a decision pack, dashboards, and a pilot post-mortem.',
  },
  {
    q: 'Minimum commitment?',
    a: 'Two popular entries: Agency Match & Pilot or AI Quick-Wins Sprint (3–4 weeks). Ongoing program management is optional.',
  },
  {
    q: 'What sizes of brands do you help?',
    a: 'From emerging to established ecommerce (roughly $1–50M+ GMV). If you’re outside that range, we’ll advise fit honestly.',
  },
  {
    q: 'Do you sign NDAs and support procurement/legal?',
    a: 'Yes—NDA, MSA/SOW templates, security notes, and vendor onboarding checklists are standard.',
  },
  {
    q: 'What makes your shortlist “vetted”?',
    a: 'Evidence-based: case proof, references, channel depth, cultural fit, process maturity, and capacity—scored against your brief.',
  },
  {
    q: 'Can we run AI without changing our team’s day-to-day?',
    a: 'We minimize disruption: start with 3–5 high-impact workflows, train owners, and add human-in-the-loop checkpoints. Adoption > novelty.',
  },
  {
    q: 'What happens after a successful pilot?',
    a: 'We finalize SLAs, scale the scope, and hand over playbooks/SOPs—or stay on to govern multi-vendor execution quarterly.',
  },
  {
    q: 'What if we’re not a fit?',
    a: 'We’ll say so early, suggest alternatives, and won’t waste cycles. Independence matters more than closing a deal.',
  },
];

export default function FAQPage() {
  return (
    <section className="py-16 px-4 bg-[#f1f5fb] min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold text-[#1e283c] text-center mb-4">FAQ</h1>
        <p className="text-center text-[#505a66] mb-10">
          Still deciding? Here are straight answers to the questions operators ask most.
        </p>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-xl p-5 shadow text-left">
              <div className="font-semibold text-[#1f40af] mb-1">{faq.q}</div>
              <div className="text-sm text-[#505a66]">{faq.a}</div>
            </div>
          ))}
          <div className="bg-white rounded-xl p-5 shadow text-left">
            <div className="font-semibold text-[#1f40af] mb-1">Didn’t see your question?</div>
            <div className="text-sm text-[#505a66]">
              <a href="/contact" className="underline text-[#1f40af]">Contact Us</a>.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}