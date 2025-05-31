'use client';
import { Typewriter } from "react-simple-typewriter";

export default function TrustedBySection() {
  return (
    <section className="bg-[#002843] text-white py-20 px-4">
      <div className="min-h-[30vh] flex flex-col justify-center items-center max-w-6xl mx-auto text-center space-y-4">
        <h2 className="text-[58px] font-semibold">
          <Typewriter
            words={[
              "Trusted by Industry Leaders",
              "Trusted by Fortune 500 Companies",
              "Trusted by Over 1,000 Businesses",
              "Trusted by Top Brands Worldwide",
              "Trusted by Innovative Startups",
              "Trusted by Global Enterprises",
            ]}
            cursor
            loop={true}
            cursorStyle="|"
            typeSpeed={50}
            deleteSpeed={30}
            delaySpeed={2000}
          />
        </h2>
        <p className="text-[30px] font-light text-white">
          BrandName is trusted by over 1,000 businesses just like yours!
        </p>
      </div>
    </section>
  );
}
