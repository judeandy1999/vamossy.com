import React from 'react';
import { Target, Users, Rocket, HeartHandshake } from 'lucide-react';
import Link from 'next/link';

const features = [
	{
		icon: <Target className="w-7 h-7" />,
		title: 'Step 1 – Align Goals',
		description:
			'We start by learning about your goals, and understanding the nuances of your ecommerce business. Whether it is scaling revenue, improving retention, launching into new markets, or other development projects, we are here to help you.',
		bg: 'bg-[#1f40af]',
	},
	{
		icon: <Users className="w-7 h-7" />,
		title: 'Step 2 – Match You With the Right Partner',
		description:
			'No endless pitches. No bias. Just data-driven and human reviewed matching with pre-vetted competent agencies, proven to deliver high quality work similar to your project.',
		bg: 'bg-[#3c82f6]',
	},
	{
		icon: <Rocket className="w-7 h-7" />,
		title: 'Step 3 – Launch Fast, See Results',
		description:
			'Your growth sprint begins within days, not months. We structure engagements frequently, so you can measure the project’s delivery by a wide variety of unbiased assessments.',
		bg: 'bg-[#1f40af]',
	},
	{
		icon: <HeartHandshake className="w-7 h-7" />,
		title: 'Step 4 – Stay Supported',
		description:
			'Unlike other matchmakers, we don’t disappear after the intro. Vamossy stays by your side to ensure the partnership keeps delivering.',
		bg: 'bg-[#3c82f6]',
	},
];

const HowWeWork = () => (
	<section className="py-16 px-4 bg-white">
		<div className="max-w-7xl mx-auto text-center">
			<h2 className="text-3xl md:text-5xl font-bold text-[#1e283c] mb-4">
				How We Take the Guesswork Out of Growth
			</h2>
			<p className="text-base max-w-3xl mx-auto md:text-lg text-[#505a66] mb-10">
				Whether you&apos;re scaling your online store or integrating AI into your
				workflow, we help you move faster and smarter.
			</p>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				{features.map((feature, idx) => (
					<div
						key={idx}
						className="bg-[#f3f6f9] rounded-xl p-6 flex flex-col items-start shadow"
					>
						<span
							className={`${
								feature.bg
							} text-white rounded-full p-3 mb-4 flex items-start justify-start`}
						>
							{feature.icon}
						</span>
						<h3 className="font-medium text-left text-sm text-[#1e283c] mb-2">
							{feature.title}
						</h3>
						<p className="text-sm text-[#505a66] text-start">
							{feature.description}
						</p>
					</div>
				))}
			</div>
			<Link
				href="/how-it-works"
				passHref
				className="cursor-pointer bg-[#1f40af] text-white font-semibold py-3 px-6 rounded-lg shadow hover:bg-blue-800 transition"
			>
				See How It Works
			</Link>
		</div>
	</section>
);

export default HowWeWork;