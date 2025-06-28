'use client';
import { motion } from 'framer-motion';
import Title from '@/components/ui/title'; 
import Container from '@/components/ui/container';

export default function ServicesHero() {

  return (
    <Container
      variant="transparent-gradient"
      className="h-[100vh] flex flex-col justify-center items-center"
    >
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center text-center gap-4"
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col items-center gap-2 mt-20">
          <Title variant="h2" title="Service Package Suite: AI Growth Engine" className="text-gray-300 text-3xl md:text-6xl lg:text-6xl font-bold"/>
          <Title variant="h3" title="A 3-tier consulting offer from our AI-driven eCommerce Growth Agency." />
          <Title variant="h4" title="Each package is fully modular, strategically differentiated, and embedded with proprietary AI systems." />
        </div>
      </motion.div>
    </Container>
  );
}