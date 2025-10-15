import React from 'react';

const Hero = () => {
  return (
    <section className="bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-[#1e293b] leading-tight mb-6">
          Unlock Growth With the Right{' '}
          <span className="text-[#3b82f6]">Partners</span> +{' '}
          <span className="text-[#3b82f6]">Practical AI</span>
        </h1>
        <p className="text-lg md:text-xl text-[#64748b] max-w-3xl mx-auto leading-relaxed">
          Our services are designed to remove the guesswork from scaling ecommerce. 
          From agency matchmaking to AI-powered workflow design, we help brands and 
          agencies move faster, smarter, and with less risk.
        </p>
      </div>
    </section>
  );
};

export default Hero;