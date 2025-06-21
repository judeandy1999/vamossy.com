import OurWhy from './why-clients-work-with-us';
import { ourProcess } from '@/data/data';

export default function OurProcess() {
  return (
    <section className="bg-[#0B0F1A] text-white min-h-screen flex flex-col justify-center py-20 px-4 sm:px-10 lg:px-20">
      <div className="flex flex-col lg:flex-row gap-16 items-start">
        <div className="flex-1">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-16">
            <span className="border-b-4 border-yellow-400 pb-2">🧭 Our Process</span>
          </h2>
          <div className="space-y-10">
            {ourProcess.map((step, index) => (
              <div
                key={index}
                className="flex items-start gap-6 border-l-4 border-yellow-400 pl-6"
              >
                <div className="text-yellow-400 text-2xl font-bold w-10">{step.step}</div>
                <div>
                  <h3 className="text-2xl font-semibold">{step.title}</h3>
                  <p className="text-lg text-gray-300">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}