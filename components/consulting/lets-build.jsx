'use client';
import Title from '@/components/ui/title';
import Container from '@/components/ui/container';
import HeroButton from "@/components/ui/hero-button";
import HubSpotCalendar from "@/components/ui/hubspot-calendar";
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
        <Container variant="transparent-gradient">
            {/* Animated background shape */}
            <div className="absolute inset-0 flex justify-center items-center pointer-events-none z-0">
            </div>
            <div className="relative flex flex-col justify-center items-center min-h-[50vh] w-full px-4 z-10 animate-fade-in">
                <Title
                    variant="h2"
                    title="Let's Build Smart Growth Systems Together"
                    className="mb-6 text-center text-5xl md:text-6xl font-extrabold text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
                />
                <Title
                    title="We work best with ambitious brands, product-led founders, and internal teams looking to operate at the edge of marketing innovation."
                    className="!text-2xl md:text-2xl text-gray-200 text-center !mt-0 !mb-4"
                    variant="h4"
                />
                <div className="flex justify-center w-full">
                    <HeroButton
                        onClick={handleBookNowClick}
                        icon={Check}
                        delay={0.2}
                        className="w-full max-w-[380px] text-lg font-semibold shadow-lg"
                    >
                        Book a Consulting Discovery Call
                    </HeroButton>
                </div>
            </div>
            <HubSpotCalendar
                isOpen={showCalendar}
                onClose={handleCloseCalendar}
            />
        </Container>
    );
}