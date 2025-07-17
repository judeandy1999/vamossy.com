'use client';

import { motion } from "framer-motion";
import { Play } from 'lucide-react';
import { clientTypes, growthSteps } from '@/data/data';
import Title from "@/components/ui/title";
import Container from "@/components/ui/container";

export default function WhoWeHelp() {

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
						If you're scaling and need systematic solutions rather than spreadsheets - we're your unfair advantage.
					</p>
				</div>
			</motion.div>
		</Container>
	);
}