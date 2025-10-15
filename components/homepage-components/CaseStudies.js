import React from 'react';
import { BookOpen, Star, TrendingUp, Rocket } from 'lucide-react';

const caseStudies = [
	{
		type: 'Insight',
		icon: <Rocket className="w-6 h-6" />,
		title: 'The 30•60•90 AI Pilot Plan for Ecommerce Teams',
		description:
			'How to scope a 4–6 week pilot, define success metrics, and avoid "tool sprawl." Includes templates for goals, guardrails, and handover.',
		link: '#',
		linkLabel: 'Read Insight',
		stat: null,
	},
	{
		type: 'Insight',
		icon: <BookOpen className="w-6 h-6" />,
		title: 'Creative Co-Pilot: Scaling Ad Variants Without Losing Brand Voice',
		description:
			'A practical workflow for UGC/creator prompts, brand-safe guardrails, and review loops that cuts concept-to-live time in half.',
		link: '#',
		linkLabel: 'Read Insight',
		stat: null,
	},
	{
		type: 'Case Study',
		icon: <Star className="w-6 h-6" />,
		title: 'DTC Skincare (Email): +18% 30-Day Revenue Lift',
		description:
			'Segment discovery + subject-line co-pilot + send-time optimization delivered a lift in sales keeping copy on-brand.',
		link: '#',
		linkLabel: 'View Case Study',
		stat: '+18%',
		statColor: 'text-green-600',
	},
	{
		type: 'Case Study',
		icon: <Star className="w-6 h-6" />,
		title: 'Home Fitness (Paid Social): ~22% CPA in 6 Weeks',
		description:
			'AI-assisted concept mining and rapid variant pruning turned “creative thrash” into a test plan with best-in-batch weekly wins.',
		link: '#',
		linkLabel: 'View Case Study',
		stat: '-22%',
		statColor: 'text-green-600',
	},
	{
		type: 'Case Study',
		icon: <TrendingUp className="w-6 h-6" />,
		title: 'Headless Apparel (CRO): +12% Mobile CVR on PDPs',
		description:
			'On-page audit, user interviews, FAQ automation, and micro-copy prompts improved product education and mobile buyflow.',
		link: '#',
		linkLabel: 'View Case Study',
		stat: '+12%',
		statColor: 'text-green-600',
	},
	{
		type: 'Insight',
		icon: <BookOpen className="w-6 h-6" />,
		title: 'Scoring Your Agency Shortlist: Capacity, Craft, Culture, Proof',
		description:
			'A scoring rubric and interview guide to help operators and marketers select the right agency for their needs.',
		link: '#',
		linkLabel: 'Read Insight',
		stat: null,
	},
];

const badgeColors = {
	Insight: 'bg-[#dbeafe] text-[#3c5ebc]',
	'Case Study': 'bg-[#dcfce6] text-[#37ae61]',
};

const iconColors = {
	Insight: 'bg-[#3c82f6] text-white',
	'Case Study': 'bg-[#2fc55f] text-white',
};

const CaseStudies = () => (
	<section className="py-16 px-4 bg-[#f6f8fc]">
		<div className="max-w-7xl mx-auto text-center">
			<h2 className="text-3xl md:text-5xl font-bold text-[#1e283c] mb-4">
				AI in Action: Insights & Case Studies
			</h2>
			<p className="text-base max-w-3xl mx-auto md:text-lg text-[#505a66] mb-10">
				See how AI moves from buzzword to shipped work. This section blends
				playbooks you can reuse with anonymized, KPI-backed case studies from
				ecommerce brands we’ve guided—covering agency pilots, creative ops,
				lifecycle, CRO, and analytics. Short reads. Clear takeaways. Real numbers.
			</p>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{caseStudies.map((cs, idx) => (
					<div
						key={idx}
						className="bg-white rounded-2xl shadow p-6 flex flex-col h-full text-left"
					>
						<div className="flex items-center gap-2 mb-3">
							<span
								className={`flex items-center justify-center rounded-lg p-2 ${iconColors[cs.type]}`}
							>
								{cs.icon}
							</span>
							<span
								className={`ml-2 px-2 py-1 rounded-[2rem] text-xs font-semibold ${badgeColors[cs.type]}`}
							>
								{cs.type}
							</span>
						</div>
						<h3 className="font-bold text-[#1e283c] text-lg mb-2">
							{cs.title}
						</h3>
						<p className="text-sm text-[#505a66] mb-4 flex-1">
							{cs.description}
						</p>
						<div className="flex items-end justify-between mt-auto">
							<a
								href={cs.link}
								className="text-[#3250b5] text-sm font-semibold hover:underline flex items-center gap-1"
							>
								{cs.linkLabel}
								<svg
									className="w-4 h-4"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M17 8l4 4m0 0l-4 4m4-4H3"
									/>
								</svg>
							</a>
							{cs.stat && (
								<span
									className={`font-bold ${cs.statColor} text-lg`}
								>
									{cs.stat}
								</span>
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	</section>
);

export default CaseStudies;