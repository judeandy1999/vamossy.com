'use client';
import { motion } from 'framer-motion';
import { earlyAdopter } from '@/data/data';
import Title from '@/components/ui/title';
import Container from '@/components/ui/container';

export default function TalkWithUs() {
  return (
    <Container variant="gray-gradient">
      <div className="mx-auto flex flex-col items-center text-center gap-6">
        <Title
          variant='h2'
          title={earlyAdopter.sideText}
          underlineEffect={true}
        />
        {/* Image and Side Text */}
        <div className="flex flex-col md:flex-row items-center gap-8 max-w-4xl mx-auto">
          <div className="flex-shrink-0 rounded-2xl overflow-hidden shadow-xl w-56 h-82 bg-gray-800 flex items-center justify-center">
            <img
              src={earlyAdopter.image}
              alt="Consultant"
              className="object-cover w-full h-full border-1 border-yellow-400"
              loading="lazy"
            />
          </div>
          <div className="flex-1 flex flex-col gap-4 text-left">
            <Title titlePosition="left" variant="h5" title={earlyAdopter.sideText1} className="text-gray-100 text-base md:text-xl font-light"/>
            <Title titlePosition="left" variant="h5" title={earlyAdopter.sideText2} className="text-gray-100 text-base md:text-xl font-light"/>
          </div>
        </div>
      </div>
    </Container>
  );
}