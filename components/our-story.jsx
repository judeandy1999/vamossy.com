'use client';
import { motion } from 'framer-motion';

export default function OurStory() {
  const leftVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1,
        ease: 'easeOut',
      },
    },
  };

  const rightVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section className="px-16 py-16 bg-white">
      <div className="flex gap-12">
        <motion.div
          className="flex-shrink-0 w-full md:w-1/2"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.5 }}
          variants={leftVariants}
        >
          <video
            src="/videos/award-winning-web-design-company-1.mp4"
            controls
            autoPlay
            loop
            muted
            className="rounded-lg shadow-lg w-full h-auto"
          />
        </motion.div>

        <motion.div
          className="w-full md:w-1/2 space-y-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.5 }}
          variants={rightVariants}
        >
          <h2 className="text-[78px] font-semibold text-gray-800">Our Story</h2>
          <p className="text-[20px] text-gray-600 leading-relaxed">
            SmartSites was founded by brothers Alex and Michael Melen, who grew up with a passion for all things digital. With an innovative vision and a lot of hard work, SmartSites quickly became one of America’s fastest growing companies.
          </p>
          <p className="text-[20px] text-gray-600 leading-relaxed">
            Our relentless focus on our clients has led us to over 1,000 5-star reviews since our inception in 2011. When Dun & Bradstreet asked "How satisfied do you feel about the quality of service?", we scored a phenomenal 97%. We keep our clients happy by delivering results that exceed their expectations.
          </p>
          <p className="text-[20px] text-gray-600 leading-relaxed">
            Our headquarters are located in Paramus, New Jersey, serving numerous clients worldwide. Come join our growing SmartSites family!
          </p>
        </motion.div>
      </div>
    </section>
  );
}