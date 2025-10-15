import React from 'react';
import { Users, Briefcase, BarChart2, TrendingUp } from 'lucide-react';

const groups = [
	{
		icon: <Users className="w-7 h-7" />,
		title: 'Ecommerce Founders, CMOs & Marketing Teams',
		points: [
			'Find the right-fit agency in weeks, not months',
			'Deploy AI to unlock acquisition, retention, and operational wins',
			'Gain ongoing support for sustainable, compounding growth',
		],
		bg: 'bg-[#1f40af]',
	},
	{
		icon: <Briefcase className="w-7 h-7" />,
		title: 'Agencies & Partners',
		points: [
			'Get introduced to brands that are vetted and investment-ready',
			'Eliminate misaligned leads and wasted pitch cycles',
			'Build long-term, profitable client relationships',
		],
		bg: 'bg-[#1f40af]',
	},
	{
		icon: <TrendingUp className="w-7 h-7" />,
		title: 'Investors & Portfolio Companies',
		points: [
			'Align portfolio companies with vetted growth partners',
			'Leverage AI sprints for fast performance gains',
			'Scale smarter across the entire portfolio',
		],
		bg: 'bg-[#1f40af]',
	},
];

const WhoWeHelp = () => (
  <section className="py-16 px-4 bg-[#f9fafb]">
    <div className="max-w-7xl mx-auto text-center">
      <h2 className="text-3xl md:text-5xl font-bold text-[#1e283c] mb-4">Who We Drive Growth For</h2>
      <p className="text-base max-w-3xl mx-auto md:text-lg text-[#505a66] mb-10">
        From eCommerce founders to scaling teams and specialist agencies—we serve the entire growth ecosystem.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {groups.map((group, idx) => (
          <div key={idx} className="bg-white rounded-xl p-6 flex flex-col items-start shadow">
            <span className={`${group.bg} text-white rounded-full p-3 mb-4 flex items-start justify-start`}>
              {group.icon}
            </span>
            <h3 className="font-medium text-sm text-[#1e283c] mb-2">{group.title}</h3>
            <ul className="text-sm text-[#505a66] text-start list-disc pl-4">
              {group.points.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhoWeHelp;