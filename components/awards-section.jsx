import Image from "next/image";

export default function AwardsSection() {
  return (
    <section className="py-16 px-8 bg-white">
      <div className="mx-auto justify-center flex flex-col md:flex-row items-center gap-0">
        {/* Left Section: Awards */}
        <div className="w-1/2 flex flex-wrap justify-center justify-center">
          <Image
            src="/smartsites-service-rated-badges.webp"
            alt="Top 3 Website Design 2024"
            width={600}
            height={600}
          />
        </div>

        {/* Right Section: Text Content */}
        <div className="w-1/2 space-y-6 text-center md:text-left">
          <p className="text-[#02355A] font-semibold text-[20px]">
            America’s #1 Rated Digital Marketing Agency
          </p>
          <h2 className="text-[58px] font-semibold leading-tight">
            With SmartSites, you get the best services, processes, and people to grow your business.
          </h2>
        </div>
      </div>
    </section>
  );
}