import Image from "next/image";

export default function ServicesPromoSection({
  icon,
  heading,
  subheading,
  description,
  stat,
  statCaption,
  imageSrc,
  reverse = false,
}) {
  return (
    <section className={`py-20 px-4 ${reverse ? "bg-gray-100" : "bg-white"}`}>
      <div
        className={`max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12 ${
          reverse ? "md:flex-row-reverse" : ""
        }`}
      >
        {/* Text Content */}
        <div className="md:w-1/2 space-y-6 text-center md:text-left">
          <div className="text-[20px] flex items-center justify-center md:justify-start gap-2 text-[#02355A] font-semibold">
            <span>{heading}</span>
          </div>
          <h2 className="text-[48px] font-semibold leading-tight text-gray-800">
            {subheading}
          </h2>
          <p className="text-gray-600 text-[28px]">{description}</p>
          <div className="flex items-center text-[68px] font-black text-green-700">
            {stat} <span className="ml-4 text-[28px] font-light text-green-700">{statCaption}</span>
          </div>
        </div>

        {/* Image */}
        <div className="md:w-1/2">
          <Image
            src={imageSrc}
            alt="Website Samples"
            width={800}
            height={600}
            className="rounded-lg shadow-md w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
}