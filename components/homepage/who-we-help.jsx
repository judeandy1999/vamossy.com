'use client';

import { motion } from "framer-motion";
import { Play } from 'lucide-react';
import { clientTypes, growthSteps } from '@/data/data';
import Title from "@/components/ui/title";
import Container from "@/components/ui/container";

export default function WhoWeHelp() {

  const secondTitleVariants = {
		hidden: { opacity: 0, x: 100 },
		visible: {
			opacity: 1,
			x: 0,
			transition: {
				duration: 1,
				ease: "easeOut",
			},
		},
	};

	const containerVariants = {
		hidden: {},
		visible: {
			transition: {
				staggerChildren: 0.2,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, x: -70 },
		visible: {
			opacity: 1,
			x: 0,
			transition: {
				duration: 0.6,
				ease: "easeOut",
			},
		},
	};

	const cardVariants = {
		hidden: { opacity: 0, y: 100 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.6,
				ease: "easeOut",
			},
		},
	};

	const ctaVariants = {
		hidden: { opacity: 0, y: 60 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.8,
				ease: "easeOut",
				delay: 1,
			},
		},
	};

	const arrowVariants = {
		hidden: { opacity: 0},
		visible: {
			opacity: 1,
			transition: {
				duration: 1.5,
				ease: "easeOut",
			},
		},
	};

	return (
		<Container variant="gray">
			<div className="text-center md:text-left">
				<Title title="Who We Help" variant="h2" titlePosition="left" underlineEffect={true} animationVariant="leftToRight" />
			</div>
			{/* Client Types List */}
			<motion.div
				className="space-y-8 mb-8 lg:mb-8"
				initial="hidden"
				whileInView="visible"
				viewport={{ once: false, amount: 0.2 }}
				variants={containerVariants}
			>
				{clientTypes.map((client, index) => (
					<motion.div
						key={index}
						className="group relative mb-4"
						variants={itemVariants}
					>
						{/* Background Glow on Hover */}

						<div className="relative flex items-start space-x-6 rounded-2xl border border-transparent">
							{/* Enhanced Yellow Circle Icon */}
							<div className="relative w-7 h-7 lg:w-12 lg:h-12 flex-shrink-0 mt-2">
								<div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full animate-pulse opacity-75"></div>
								<div className="relative w-full h-full bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/25">
									<Play size={18} className="text-gray-300" />
								</div>
							</div>

							{/* Content */}
							<div className="flex-1 pt-2 lg:pt-4">
								<h3 className="text-gray-300 text-lg md:text-lg lg:text-xl font-semibold">
									{client.title}
								</h3>
								<div className="flex md:pl-8 items-center space-x-4">
									<div className="w-8 h-0.5 bg-gradient-to-l from-yellow-500 to-transparent"></div>
									<p className="text-gray-300 text-md md:text-lg lg:text-xl font-light">
										{client.description}
									</p>
								</div>
							</div>
						</div>
					</motion.div>
				))}
				<div className="text-center md:text-start mt-8">
					<p className="text-gray-300 text-md md:text-lg lg:text-xl font-light">
						If you're scaling and need systems, not spreadsheets - we're your unfair advantage.
					</p>
				</div>
			</motion.div>

			{/* Enhanced Arrow Graphics */}
			<motion.div
				className="flex justify-center"
				initial="hidden"
				whileInView="visible"
				viewport={{ once: false, amount: 0.3 }}
				variants={arrowVariants}
			>
				<div className="flex space-x-3">
					{[...Array(3)].map((_, i) => (
						<div key={i} className="relative">
							<div
								className={`w-3 h-12 bg-gradient-to-b from-yellow-400 to-yellow-600 transform rotate-45 shadow-lg shadow-yellow-500/30`}
								style={{ animationDelay: `${i * 0.2}s` }}
							></div>
							<div
								className={`absolute inset-0 w-3 h-12 bg-gradient-to-b from-yellow-300 to-yellow-500 transform rotate-45 blur-sm opacity-50`}
								style={{ animationDelay: `${i * 0.2}s` }}
							></div>
						</div>
					))}
				</div>
			</motion.div>

			<div className="mt-8 mb-8 text-center md:text-right">
				<Title title="How We Drive Growth" titlePosition="right" variant="h2" underlineEffect={true} animationVariant="rightToLeft" />
			</div>

			<motion.div
				className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
				initial="hidden"
				whileInView="visible"
				viewport={{ once: false, amount: 0.2 }}
				variants={containerVariants}
			>
				{growthSteps.map((step, index) => (
					<motion.div
						key={index}
						className="group"
						variants={cardVariants}
					>
						<div className="relative h-full p-8 bg-gray-800/50 backdrop-blur-sm border-2 border-yellow-500 rounded-2xl">
							<div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-yellow-600/5 rounded-2xl opacity-0"></div>
							
							<div className="relative w-7 h-7 lg:w-12 lg:h-12 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full flex items-center justify-center mb-2 lg:mb-6 shadow-lg shadow-yellow-500/25">
								<span className="text-lg md:text-xl font-semibold text-gray-900">{step.number}</span>
							</div>
							
							<h3 className="lg:mb-4 text-gray-300 text-lg md:text-lg lg:text-xl font-semibold">
								{step.title}
							</h3>
							
							<p className="text-gray-300 text-md md:text-lg lg:text-xl font-light">
								{step.description}
							</p>
							
							<div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent scale-x-0"></div>
						</div>
					</motion.div>
				))}
			</motion.div>
		</Container>
	);
}