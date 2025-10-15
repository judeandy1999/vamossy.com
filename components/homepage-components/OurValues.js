import React from 'react';

const values = [
  {
    title: 'For Brands',
    description: 'Reduce risk, find the right-fit agency, implement AI processes that scale.',
  },
  {
    title: 'For Agencies',
    description: 'Get matched to qualified ecommerce clients, win smoother projects with AI-backed workflows.',
  },
];

const OurValue = () => (
  <section className="py-12 px-4" style={{ background: 'linear-gradient(135deg, #1e377a 0%, #1e3e9f 100%)' }}>
    <div className="max-w-5xl mx-auto text-center">
      <h2 className="text-2xl md:text-4xl font-bold text-white mb-8">Our Value</h2>
      <div className="flex flex-col md:flex-row gap-6 justify-center">
        {values.map((val, idx) => (
          <div
            key={idx}
            className="bg-white/10 rounded-xl p-6 flex-1 min-w-[220px] text-white shadow text-center"
          >
            <h3 className="font-bold text-lg mb-2">{val.title}</h3>
            <p className="text-base">{val.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default OurValue;