import React from 'react';
import { Handshake, Zap, Cog } from 'lucide-react';

const services = [
	{
		icon: <Handshake className="w-7 h-7" />,
		title: 'Agency Match & Pilot',
		description: (
			<>
				Get the right partner—then prove it fast.
				<ul className="list-disc pl-4 mt-2 mb-6 leading-[2] text-[#505a66]">
					<li>Goal-aligned brief & success metrics</li>
					<li>Curated shortlist (3-5 agencies) with fit scoring</li>
					<li>RFP-lite interviews + references</li>
					<li>4–6 week pilot co-led by Vamossy</li>
					<li>Decision pack with recommendation</li>
				</ul>
				<hr className="border-t border-[#e5e7eb] my-4" />
				<span className="text-[#1f40af] font-semibold">
					Fixed-fee, typically 6–8 weeks
				</span>
			</>
		),
		bg: 'bg-white',
		border: 'border-transparent',
		highlight: false,
	},
	{
		icon: <Zap className="w-7 h-7" />,
		title: 'AI Quick-Wins Sprint',
		description: (
			<>
				Embed practical AI that boosts output in weeks, not months.
				<ul className="list-disc pl-4 mt-2 mb-6 leading-[2] text-[#505a66]">
					<li>Use-case mapping (effort vs. impact)</li>
					<li>Tooling selection (no vendor bias)</li>
					<li>Prompt/workflow library tailored to your stack</li>
					<li>Guardrails: governance, approval flows</li>
					<li>Playbooks + training for your team</li>
				</ul>
				<hr className="border-t border-[#e5e7eb] my-4" />
				<span className="text-[#1f40af] font-semibold">
					3–4 week sprint, fixed-scope
				</span>
			</>
		),
		bg: 'bg-white',
		border: 'border-2 border-[#1f40af]',
		highlight: true,
		badge: (
			<span className="inline-block bg-[#1f40af] text-white text-xs font-semibold px-3 py-1 rounded mb-3">
				POPULAR
			</span>
		),
	},
	{
		icon: <Cog className="w-7 h-7" />,
		title: 'Ongoing Program Management',
		description: (
			<>
				Keep agencies aligned and AI humming as you scale.
				<ul className="list-disc pl-4 mt-2 mb-6 leading-[2] text-[#505a66]">
					<li>Quarterly growth roadmap & experiments</li>
					<li>Cross-agency coordination and SLA governance</li>
					<li>KPI dashboards (channel + AI impact)</li>
					<li>Continuous AI workflow optimization</li>
					<li>Training refresh</li>
				</ul>
				<hr className="border-t border-[#e5e7eb] my-4" />
				<span className="text-[#1f40af] font-semibold">
					Quarterly retainer
				</span>
			</>
		),
		bg: 'bg-white',
		border: 'border-transparent',
		highlight: false,
	},
];

const ServiceModels = () => (
	<section className="py-16 px-4 bg-[#dbeafe]">
		<div className="max-w-7xl mx-auto text-center">
			<h2 className="text-3xl md:text-5xl font-bold text-[#294792] mb-4">
				Services & Engagement Models
			</h2>
			<p className="text-base max-w-3xl mx-auto md:text-lg text-[#505a66] mb-10">
				Three focused approaches to accelerate your growth with the right partners
				and AI implementation.
			</p>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
				{services.map((service, idx) => (
					<div
						key={idx}
						className={`relative ${service.bg} rounded-xl p-6 flex flex-col items-start shadow ${service.border}`}
						style={service.highlight ? { zIndex: 1 } : {}}
					>
						<span className="bg-[#1f40af] text-white rounded-full p-3 mb-4 flex items-center justify-center">
							{service.icon}
						</span>
						{service.badge}
						<h3 className="font-bold text-[#1e283c] text-lg mb-2">
							{service.title}
						</h3>
						<div className="text-sm text-[#505a66] text-start w-full">
							{service.description}
						</div>
					</div>
				))}
			</div>
		</div>
	</section>
);

export default ServiceModels;