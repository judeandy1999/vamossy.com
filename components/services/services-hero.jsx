'use client';
import { motion } from 'framer-motion';
import Title from '@/components/ui/title'; 
import Container from '@/components/ui/container';

export default function ServicesHero() {

  return (
    <Container
      variant="transparent-gradient"
      className="h-[100vh] flex flex-col justify-center items-center bg-gradient-to-b from-background to-transparent relative"
    >
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center text-center gap-4"
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col items-center gap-2 mt-20">
          <Title variant="h2" title="Service Package Suite: AI Growth Engine" />
          <Title variant="h3" title="A 3-tier consulting offer from our AI-driven eCommerce Growth Agency." />
          <Title variant="h4" title="Each package is fully modular, strategically differentiated, and embedded with proprietary AI systems." />
        </div>
      </motion.div>

      
      <div className="flex flex-col items-center mt-30 select-none pointer-events-none">
        <span className="text-lg md:text-2xl font-medium text-yellow-400 tracking-wide mb-2 drop-shadow-sm">
          Explore Packages:
        </span>
        <svg
          width={48}
          height={48}
          viewBox="0 0 24 24"
          fill="none"
          className="animate-bounce text-yellow-400 drop-shadow"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </div>
    </Container>
  );
}