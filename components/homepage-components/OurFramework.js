import React from 'react';
import { Search, Building2 } from 'lucide-react';

const frameworks = [
	{
		icon: <Search className="w-7 h-7" />,
		title: 'Agency Matchmaking',
		description:
			'Curated, operator-led partner selection that ends in a KPI-tied pilot—not a long-term gamble.',
		steps: [
      {
        label: 'Goal-aligned brief',
        detail: 'Objectives, constraints, stack, markets, budgets.',
      },
      {
        label: 'Fit-scored shortlist (3–5)',
        detail: 'Interviews, references, past work, cultural fit.',
      },
      {
        label: 'Pilot plan',
        detail: 'Scope, KPIs, timeline, budget, risk/exit criteria.',
      },
      {
        label: 'Co-piloted delivery',
        detail: 'Weekly standups, decision log, shared dashboard.',
      },
      {
        label: 'Decision pack',
        detail: 'Keep/scale/replace recommendation, rollout & SLA templates.',
      },
    ],
		bg: 'bg-[#1f40af]',
	},
	{
		icon: <Building2 className="w-7 h-7" />,
		title: 'AI Solutions',
		description:
			'Design, pilot, and embed AI workflows that multiply agency and team output.',
    steps: [
      {
        label: 'Opportunity map',
        detail: 'Effort-vs-impact across creative, CRM, ads, analytics, support.',
      },
      {
        label: 'Tooling selection',
        detail: 'Platform-agnostic picks with governance, privacy, and security.',
      },
      {
        label: 'Workflow design',
        detail: 'Prompts, SOPs, QA gates, human-in-the-loop controls.',
      },
      {
        label: 'Pilot metrics',
        detail: 'Baselines, A/Bs, time-saved and revenue-lift tracking.',
      },
      {
        label: 'Enablement',
        detail: 'Training, playbooks, change management, clean handover.',
      },
    ],
		bg: 'bg-[#1f40af]',
	},
];

const OurFramework = () => (
	<section className="py-16 px-4 bg-white">
		<div className="max-w-6xl mx-auto text-center">
			<h2 className="text-3xl md:text-5xl font-bold text-[#1e283c] mb-4">
				Our Framework
			</h2>
			<p className="text-base max-w-2xl mx-auto md:text-lg text-[#505a66] mb-10">
				Two core pillars that drive measurable results for eCommerce growth.
			</p>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-16">
				{frameworks.map((fw, idx) => (
					<div
						key={idx}
						className="bg-[#f6f8fc] rounded-xl p-8 flex flex-col items-start shadow text-left"
					>
						<span
							className={`${fw.bg} text-white rounded-full p-3 mb-4 flex items-center justify-center`}
						>
							{fw.icon}
						</span>
						<h3 className="font-bold text-lg text-[#1e283c]">
							{fw.title}
						</h3>
						<p className="text-sm text-[#505a66] mb-8">
							{fw.description}
						</p>
						<ol className="space-y-3 w-full">
							{fw.steps.map((step, i) => (
								<li key={i} className="flex items-start">
									<span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#1f40af] text-white font-bold flex items-center justify-center mr-3">
										{i + 1}
									</span>
									<div className="mb-4">
										<span className="font-semibold text-[#1f40af]">
											{step.label}
										</span>
										<div className="text-sm text-[#505a66]">
											{step.detail}
										</div>
									</div>
								</li>
							))}
						</ol>
					</div>
				))}
			</div>
		</div>
	</section>
);

export default OurFramework;