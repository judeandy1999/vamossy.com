'use client';
import { motion } from 'framer-motion';
import { earlyAdopter } from '@/data/data';
import Title from '@/components/ui/title';
import Container from '@/components/ui/container';

export default function TalkWithUs() {
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8, rotateY: -15 },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: { duration: 0.7, ease: "easeOut" }
    }
  };

  return (
    <Container variant="gray-gradient">
      <motion.div 
        className="mx-auto flex flex-col items-center text-center"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
      >
        {/* Main Title */}
        <motion.div variants={itemVariants}>
          <Title
            variant='h2'
            title={earlyAdopter.sideText}
            underlineEffect={true}
            className='!mb-0 text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-100 font-bold px-4 sm:px-0'
          />
        </motion.div>

        {/* Main Content Card */}
        <motion.div 
          className="relative max-w-7xl mx-auto w-full px-4 sm:px-0"
          variants={itemVariants}
        >
          <div className="rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8 lg:gap-12">
              
              {/* Enhanced Image Section */}
              <motion.div 
                className="flex-shrink-0 relative group"
                variants={imageVariants}
              >
                {/* Decorative Background Elements */}
                <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400/20 to-blue-400/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400/30 to-blue-400/30 rounded-2xl opacity-50 group-hover:opacity-70 transition-all duration-500"></div>
                
                {/* Main Image Container */}
                <div className="relative w-64 h-80 sm:w-72 sm:h-96 rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-yellow-400/50 group-hover:border-yellow-400/80 transition-all duration-500">
                  <img
                    src={earlyAdopter.image}
                    alt="Expert Consultant - Ready to discuss AI and Ecommerce solutions"
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                </div>

                {/* Floating Elements */}
                <motion.div 
                  className="absolute -top-6 -left-6 w-12 h-12 bg-yellow-400/20 rounded-full blur-sm"
                  animate={{ 
                    y: [0, -10, 0],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                ></motion.div>
                <motion.div 
                  className="absolute -bottom-4 -right-4 w-8 h-8 bg-blue-400/20 rounded-full blur-sm"
                  animate={{ 
                    y: [0, 10, 0],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                ></motion.div>
              </motion.div>

              {/* Enhanced Content Section */}
              <div className="flex-1 flex flex-col gap-6 sm:gap-8 text-left max-w-2xl w-full">
                
                {/* Intro Badge */}
                <motion.div 
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400/10 to-blue-400/10 border border-yellow-400/20 rounded-full px-3 sm:px-4 py-2 w-fit mx-auto lg:mx-0"
                  variants={itemVariants}
                >
                  <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                  <span className="text-yellow-400 text-xs sm:text-sm font-medium">Available for consultation</span>
                </motion.div>

                {/* Content Blocks */}
                <motion.div className="space-y-4 sm:space-y-6 text-center lg:text-left" variants={itemVariants}>
                  <div className="relative">
                      <h3 className="text-yellow-400 text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3 flex items-center justify-center lg:justify-start gap-2">
                        Why We Love What We Do
                      </h3>
                      <p className="text-gray-200 text-base sm:text-lg md:text-xl leading-relaxed font-light">
                        {earlyAdopter.sideText1}
                      </p>
                  </div>

                  <div className="relative">
                      <h3 className="text-blue-400 text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3 flex items-center justify-center lg:justify-start gap-2">
                        Our Competitive Edge
                      </h3>
                      <p className="text-gray-200 text-base sm:text-lg md:text-xl leading-relaxed font-light">
                        {earlyAdopter.sideText2}
                      </p>
                  </div>
                </motion.div>

                {/* Call-to-Action */}
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                  variants={itemVariants}
                >
                  <motion.button 
                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Schedule a free call
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Background Decoration */}
          <div className="absolute -z-10 -inset-4 sm:-inset-6 lg:-inset-8 bg-gradient-to-r from-yellow-400/5 via-transparent to-blue-400/5 rounded-3xl blur-3xl"></div>
        </motion.div>
      </motion.div>
    </Container>
  );
}