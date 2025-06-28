'use client';
import Title from '@/components/ui/title';
import Container from '@/components/ui/container';
import HeroButton from "@/components/ui/hero-button";
import GoogleCalendarModal from "@/components/ui/google-calendar";
import { useState } from 'react';
import { Check } from 'lucide-react';

export default function LetsBuild() {
    const [showCalendar, setShowCalendar] = useState(false);

    const handleBookNowClick = (e) => {
        e.preventDefault();
        setShowCalendar(true);
    };

    const handleCloseCalendar = () => {
        setShowCalendar(false);
    };

    return (
        <Container className='!bg-gradient-to-r from-[#1a1f35] via-[#20263a] to-[#1a1f35]'>
            {/* Trust Bar Section - Enhanced Design */}
            <div className="relative flex flex-col justify-center items-center min-h-[20vh] w-full px-4 sm:px-6 py-6 sm:py-8 z-10">
                {/* Subtle top border with gradient */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent"></div>
                
                {/* Background pattern overlay */}
                <div className="absolute inset-0 opacity-5">
                    <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]"></div>
                </div>
                
                <div className="max-w-7xl mx-auto w-full relative z-10">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 sm:gap-8 lg:gap-12">
                        <div className="flex-1 relative lg:pr-10 text-center sm:text-left">
                            <div className="absolute -left-6 top-0 w-1 h-full bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full hidden lg:block"></div>
                            
                            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight mb-3 sm:mb-4 tracking-tight">
                                Let's Build Smart Growth Systems Together
                            </h2>
                            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 leading-relaxed font-medium max-w-4xl lg:mb-0">
                                We work best with ambitious brands, product-led founders, and internal teams looking to operate at the edge of marketing innovation.
                            </p>
                        </div>
                        
                        {/* Right: Enhanced CTA Button */}
                        <div className="flex-shrink-0 w-full sm:w-auto lg:w-auto flex justify-center sm:justify-start lg:justify-end">
                            <div className="relative w-full sm:w-auto">
                                {/* Enhanced glow effect */}
                                <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400/30 to-yellow-600/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100"></div>
                                <HeroButton
                                    onClick={handleBookNowClick}
                                    icon={Check}
                                    delay={0.2}
                                    className="relative w-full sm:w-auto lg:w-[320px] text-sm sm:text-base font-bold shadow-2xl hover:shadow-yellow-400/25 border-yellow-400/50 hover:border-yellow-400"
                                >
                                    Book a Discovery Call
                                </HeroButton>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Bottom subtle glow */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent"></div>
            </div>
            <GoogleCalendarModal
                isOpen={showCalendar}
                onClose={handleCloseCalendar}
            />
        </Container>
    );
}