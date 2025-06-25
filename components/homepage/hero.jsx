'use client';
import { motion } from 'framer-motion';
import { Check, FileText } from 'lucide-react';
import { useState } from 'react';
import Title from "@/components/ui/title";
import Container from "@/components/ui/container";
import HeroButton from "@/components/ui/hero-button";
import HubSpotCalendar from "@/components/ui/hubspot-calendar";

export default function Hero() {
  const [showCalendar, setShowCalendar] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const handleBookNowClick = (e) => {
    e.preventDefault();
    setShowCalendar(true);
  };

  const handleCloseCalendar = () => {
    setShowCalendar(false);
  };

  const handleSubmitBrief = (e) => {
    e.preventDefault();
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <Container variant="transparent" className="h-[100vh]">
        <motion.div
          className="relative z-1 h-full flex flex-col items-center justify-center"
          initial="hidden"
          animate="visible"
        >
          <Title title="YOUR AI-POWERED ECOMMERCE GROWTH CONSULTING AGENCY" />
          <Title variant="h3" title="From Chaos to Clarity. From Funnels to Frameworks" />
          <Title variant="h4" title="We engineer AI-powered growth systems that scale eCommerce brands - profitable, predictable, and without the guesswork." />
          <Title variant="h4" typewriter={true} title="Your next 10x isn't in more tools - it's in better logic" />

          <motion.div
            variants={containerVariants}
            className="z-11 mt-4 lg:mt-8 flex flex-col md:flex-row gap-4 items-center"
          >
            <HeroButton
              onClick={handleBookNowClick}
              icon={Check}
              delay={0.2}
            >
              Book a Growth Audit
            </HeroButton>
            
            <HeroButton
              onClick={handleSubmitBrief}
              icon={FileText}
              delay={0.3}
            >
              Submit a Brief
            </HeroButton>
          </motion.div>
        </motion.div>
        
      </Container>

      <HubSpotCalendar 
        isOpen={showCalendar} 
        onClose={handleCloseCalendar} 
      />
    </>
  );
}
