"use client";
import { tierPackages } from "@/data/data";
import Title from '@/components/ui/title';
import Container from '@/components/ui/container';
import { motion } from "framer-motion"; // <-- Add this import

export default function Tier3Package() {
  const tier3 = tierPackages.find((t) => t.id === 3);

  if (!tier3) return null;

  const {
    title,
    subtitle,
    cards,
    whatsIncluded = [],
    embeddedAISystems = [],
    deliverables = [],
  } = tier3;

  // Animation variants
  const listVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.08 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Container variant="gray-gradient" className="py-16 lg:py-24">
      <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <Title variant="h2" title={title} underlineEffect={true}/>
          <Title variant="h5" title={subtitle} className="!mb-4"/>

          {/* Cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            variants={listVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
          >
            {cards.map((card, idx) => (
              <motion.div
                key={idx}
                className="w-full bg-transparent border border-yellow-400 rounded-2xl shadow p-6 flex flex-col items-center"
                variants={itemVariants}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 mb-4 flex items-center justify-center rounded-full p-1">
                  <img
                    src={card.icon}
                    alt={card.label}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>
                <Title variant="h3-full" title={card.label} isAnimationEnabled={false} />
                <Title variant="h6" title={card.description} isAnimationEnabled={false}/>
              </motion.div>
            ))}
          </motion.div>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* What's Included & Deliverables */}
            <div>
              <h3 className="text-2xl md:text-3xl font-semibold text-white mb-2 flex items-center">
                What's Included
              </h3>
              <div className="h-1 w-24 bg-yellow-500 mb-4 rounded"></div>
              <motion.ul
                className="space-y-4"
                variants={listVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
              >
                {whatsIncluded.map((item, idx) => (
                  <motion.li
                    key={idx}
                    className="flex items-start"
                    variants={itemVariants}
                  >
                    <img
                      src="/list-icon.webp"
                      alt="list icon"
                      className="mt-1 mr-2 w-5 h-4 object-contain"
                      loading="lazy"
                    />
                    <span className="text-gray-100 text-xl">{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
              <h3 className="text-2xl md:text-3xl font-semibold text-white mb-2 flex items-center mt-8">
                Deliverables
              </h3>
              <div className="h-1 w-24 bg-yellow-500 mb-4 rounded"></div>
              <motion.ul
                className="space-y-4"
                variants={listVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
              >
                {deliverables.map((item, idx) => (
                  <motion.li
                    key={idx}
                    className="flex items-start"
                    variants={itemVariants}
                  >
                    <img
                      src="/list-icon.webp"
                      alt="list icon"
                      className="mt-1 mr-2 w-5 h-4 object-contain"
                      loading="lazy"
                    />
                    <span className="text-gray-100 text-xl">{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
            {/* Embedded AI Systems */}
            <div>
              <h3 className="text-2xl md:text-3xl font-semibold text-white mb-2 flex items-center">
                Embedded AI Systems
              </h3>
              <div className="h-1 w-24 bg-yellow-500 mb-4 rounded"></div>
              <motion.ul
                className="space-y-4"
                variants={listVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
              >
                {embeddedAISystems.map((item, idx) => (
                  <motion.li
                    key={idx}
                    className="flex items-start"
                    variants={itemVariants}
                  >
                    <img
                      src="/list-icon.webp"
                      alt="list icon"
                      className="mt-1 mr-2 w-5 h-4 object-contain"
                      loading="lazy"
                    />
                    <span className="text-gray-100 text-xl">{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </div>
      </div>
    </Container>
  );
}