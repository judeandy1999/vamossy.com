import { whyClientsWorkWithUs } from '@/data/data';

export default function WhyClientsWorkWithUs() {
  return (
    <section className="w-full py-20 px-4 sm:px-10 lg:px-20 flex items-center justify-center min-h-[60vh]">
      <div className="bg-[#151B2C] border border-yellow-400 rounded-2xl shadow-lg flex flex-col items-center w-full max-w-[100ch] mx-auto p-10">
        <h2 className="text-4xl sm:text-5xl font-bold text-yellow-400 mb-10 flex items-center gap-3 text-center">
          <span role="img" aria-label="dna">🧬</span>
          <span>Why Clients Work With Us</span>
        </h2>
        <div className="flex flex-col gap-8 w-full">
          {whyClientsWorkWithUs.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 bg-[#23283a] rounded-xl px-6 py-5 shadow transition hover:scale-[1.02]"
            >
              <span className="text-yellow-400 text-2xl">★</span>
              <span className="text-xl text-white font-medium leading-relaxed">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}