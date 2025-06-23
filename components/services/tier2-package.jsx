"use client";
import { tierPackages } from '@/data/data';
import Title from '@/components/ui/title';
import Container from '@/components/ui/container';
import { motion } from "framer-motion"; // <-- Add this import

export default function Tier2Package() {
  const tier2 = tierPackages.find(t => t.id === 2);

  if (!tier2) return null;

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
        <div className="p-6 sm:p-10 md:p-14">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <Title
              variant="h2"
              title={tier2.title}
              underlineEffect={true}
              className="mb-2"
            />
            <div className="text-base sm:text-xl md:text-2xl font-medium text-gray-200">
              {tier2.subtitle}
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {tier2.cards.map((card, idx) => (
              <div
                key={idx}
                className="w-full bg-transparent border border-yellow-400 rounded-2xl shadow p-6 flex flex-col items-center"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 mb-4 flex items-center justify-center rounded-full p-1">
                  <img
                    src={card.icon}
                    alt={card.label}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>
                <Title variant="h3-full" title={card.label} />
                <Title variant="h6" title={card.description}/>
              </div>
            ))}
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* What's Included */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-2 flex items-center">
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
                {tier2.whatsIncluded.map((item, idx) => (
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
                    <span className="text-gray-100">{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
              <h3 className="text-2xl font-bold text-white mb-2 flex items-center mt-10">
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
                {tier2.embeddedAISystems.map((item, idx) => (
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
                    <span className="text-gray-100">{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
            {/* Deliverables */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-2 flex items-center">
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
                {tier2.deliverables.map((item, idx) => (
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
                    <span className="text-gray-100">{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}