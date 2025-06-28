"use client";
import Title from '@/components/ui/title'; 
import Container from '@/components/ui/container';
import { motion } from "framer-motion";

export default function TierPackage({
  title,
  subtitle,
  cards,
  whatsIncluded = [],
  embeddedAISystems = [],
  deliverables = [],
}) {
  // Animation variants
  const listVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1, duration: 0.6 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <Container variant="gray-gradient">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10 lg:mb-12">
            <Title variant="h2" title={title} animationVariant="topToBottom" underlineEffect={true}/>
            <Title variant="h5" title={subtitle} className="!mb-0 mt-4 sm:mt-6"/>
          </div>

          {/* Cards */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16 lg:mb-20"
            variants={listVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {cards.map((card, idx) => (
              <motion.div
                key={idx}
                className="w-full bg-transparent border border-yellow-400/80 hover:border-yellow-400 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 sm:p-8 flex flex-col items-center text-center group"
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 mb-4 sm:mb-6 flex items-center justify-center rounded-full p-1 group-hover:scale-110 transition-transform duration-300">
                  <img
                    src={card.icon}
                    alt={card.label}
                    className="w-full h-full object-contain filter drop-shadow-lg"
                    loading="lazy"
                  />
                </div>
                <Title variant="h3-full" title={card.label} isAnimationEnabled={false} className="mb-3 sm:mb-4" />
                <Title variant="h5" title={card.description} isAnimationEnabled={false} className="text-gray-300 leading-relaxed"/>
              </motion.div>
            ))}
          </motion.div>

          {/* Features Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12">
            {/* What's Included */}
            <div className="space-y-6 sm:space-y-8">
              <div className="mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-200 mb-3 sm:mb-4 flex items-center">
                  What's Included
                </h3>
                <div className="h-1 w-20 sm:w-24 lg:w-28 bg-gradient-to-r from-yellow-500 to-yellow-400 mb-4 sm:mb-6 rounded-full shadow-sm"></div>
                <motion.ul
                  className="space-y-4 sm:space-y-5"
                  variants={listVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                >
                  {whatsIncluded.map((item, idx) => (
                    <motion.li
                      key={idx}
                      className="flex items-start group hover:translate-x-1 transition-transform duration-200"
                      variants={itemVariants}
                    >
                      <img
                        src="/list-icon.webp"
                        alt="list icon"
                        className="mt-1.5 mr-3 sm:mr-4 w-4 sm:w-5 h-3 sm:h-4 object-contain flex-shrink-0 filter drop-shadow-sm"
                        loading="lazy"
                      />
                      <span className="text-gray-100 text-base sm:text-lg lg:text-xl leading-relaxed group-hover:text-white transition-colors duration-200">{item}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              </div>
            </div>
            
            {/* Embedded AI Systems & Deliverables */}
            <div className="space-y-6 sm:space-y-8">
              <div className="mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-200 mb-3 sm:mb-4 flex items-center">
                  Embedded AI Systems
                </h3>
                <div className="h-1 w-20 sm:w-24 lg:w-28 bg-gradient-to-r from-yellow-500 to-yellow-400 mb-4 sm:mb-6 rounded-full shadow-sm"></div>
                <motion.ul
                  className="space-y-4 sm:space-y-5 mb-8 sm:mb-10 lg:mb-12"
                  variants={listVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                >
                  {embeddedAISystems.map((item, idx) => (
                    <motion.li
                      key={idx}
                      className="flex items-start group hover:translate-x-1 transition-transform duration-200"
                      variants={itemVariants}
                    >
                      <img
                        src="/list-icon.webp"
                        alt="list icon"
                        className="mt-1.5 mr-3 sm:mr-4 w-4 sm:w-5 h-3 sm:h-4 object-contain flex-shrink-0 filter drop-shadow-sm"
                        loading="lazy"
                      />
                      <span className="text-gray-100 text-base sm:text-lg lg:text-xl leading-relaxed group-hover:text-white transition-colors duration-200">{item}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              </div>
              
              <div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-200 mb-3 sm:mb-4 flex items-center">
                  Deliverables
                </h3>
                <div className="h-1 w-20 sm:w-24 lg:w-28 bg-gradient-to-r from-yellow-500 to-yellow-400 mb-4 sm:mb-6 rounded-full shadow-sm"></div>
                <motion.ul
                  className="space-y-4 sm:space-y-5"
                  variants={listVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                >
                  {deliverables.map((item, idx) => (
                    <motion.li
                      key={idx}
                      className="flex items-start group hover:translate-x-1 transition-transform duration-200"
                      variants={itemVariants}
                    >
                      <img
                        src="/list-icon.webp"
                        alt="list icon"
                        className="mt-1.5 mr-3 sm:mr-4 w-4 sm:w-5 h-3 sm:h-4 object-contain flex-shrink-0 filter drop-shadow-sm"
                        loading="lazy"
                      />
                      <span className="text-gray-100 text-base sm:text-lg lg:text-xl leading-relaxed group-hover:text-white transition-colors duration-200">{item}</span>
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