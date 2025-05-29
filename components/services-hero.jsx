import Image from "next/image";

export default function ServicesHero() {
  return (
    <section className="mt-12 relative bg-[#02355A] text-white p-16">
      <div className="mx-auto justify-center flex flex-col md:flex-row items-center gap-12 py-16 relative">
        {/* Left Section: Text Content */}
        <div className="w-[60%] space-y-2 z-10">
          <p className="text-yellow-400 text-[20px] font-semibold">
            Grow Your Business With Scalable Digital Marketing
          </p>
          <h1 className="text-[68px] font-semibold leading-tight">
            Outsmart the competition with best-in-class digital marketing services
          </h1>
          <p className="text-[20px] text-gray-200">
            Get more traffic. Acquire more customers. Sell more stuff. SmartSites
            offers proven strategies & reliable execution to exceed your marketing
            goals.
          </p>
        </div>

        {/* Right Section: Image */}
        <div className="w-[40%]">
          <div className="absolute w-[750px] h-[750px] left-[50%] top-[1rem]">
            <Image
              width={1200}
              height={1200}
              src="/digital-marketing-services-banner-hero.webp"
              alt="Digital Marketing Analytics"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}