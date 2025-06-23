'use client';
import { motion } from 'framer-motion';
import Title from '@/components/ui/title'; 
import Container from '@/components/ui/container';

export default function ServicesHero() {

  return (
    <Container variant="transparent" className="h-[100vh]">
      
      <motion.div
          className="relative z-1 h-full flex flex-col items-center justify-center"
          initial="hidden"
          animate="visible"
        >

        <Title variant="h2" title="Service Package Suite: AI Growth Engine"/>
        <Title variant="h3" title="A 3-tier consulting offer from our AI-driven eCommerce Growth Agency." />
        <Title variant="h4" title="Each package is fully modular, strategically differentiated, and embedded with proprietary AI systems." />
        
        {/* 
        <div className="flex flex-col md:flex-row gap-4 mt-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.5 }}
            variants={leftSectionVariants}
            className="bg-white text-black rounded-lg p-6 shadow-md w-full md:w-[30%]"
          >
            <h3 className="text-xl font-bold mb-2">Starter Package</h3>
            <p className="text-sm mb-4">
              Ideal for small businesses or startups looking to establish an online presence.
            </p>
            <a href="#" className="text-blue-500 font-semibold text-sm">
              Learn More
            </a>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.5 }}
            variants={rightSectionVariants}
            className="bg-white text-black rounded-lg p-6 shadow-md w-full md:w-[30%]"
          >
            <h3 className="text-xl font-bold mb-2">Growth Package</h3>
            <p className="text-sm mb-4">
              Perfect for growing businesses aiming to enhance their digital marketing efforts.
            </p>
            <a href="#" className="text-blue-500 font-semibold text-sm">
              Learn More
            </a>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.5 }}
            variants={leftSectionVariants}
            className="bg-white text-black rounded-lg p-6 shadow-md w-full md:w-[30%]"
          >
            <h3 className="text-xl font-bold mb-2">Pro Package</h3>
            <p className="text-sm mb-4">
              Comprehensive package for established businesses seeking maximum growth and ROI.
            </p>
            <a href="#" className="text-blue-500 font-semibold text-sm">
              Learn More
            </a>
          </motion.div>
        </div>
        */}
      </motion.div>
    </Container>

  );
}