import { tierPackages } from '@/data/data';

export default function Tier2Package() {
  const tier2 = tierPackages.find(t => t.id === 2);

  if (!tier2) return null;

  return (
    <section className="min-h-screen flex flex-col justify-center py-8 sm:py-12 md:py-16 bg-[#373535]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="p-6 sm:p-10 md:p-14 bg-[#373535]">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">
              {tier2.title}
            </h2>
            <div className="h-1 w-20 sm:w-24 bg-yellow-500 mx-auto mt-2 mb-4 sm:mb-6 rounded"></div>
            <div className="text-base sm:text-xl md:text-2xl font-medium text-gray-200">
              {tier2.subtitle}
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {tier2.cards.map((card, idx) => (
              <div
                key={idx}
                className="w-full bg-transparent border border-yellow-400 rounded-2xl shadow p-6 flex flex-col items-center"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 mb-4 flex items-center justify-center rounded-full p-1">
                  <img
                    src={card.icon}
                    alt={card.label}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 text-center">
                  {card.label}
                </h3>
                <p className="text-base sm:text-lg text-gray-300 font-semibold text-center">
                  {card.description}
                </p>
              </div>
            ))}
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* What's Included */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-2 flex items-center">
                What's Included
              </h3>
              <div className="h-1 w-24 bg-yellow-500 mb-4 rounded"></div>
              <ul className="space-y-4">
                {tier2.whatsIncluded.map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <img
                      src="/services-images/list-icon.webp"
                      alt="list icon"
                      className="mt-1 mr-2 w-5 h-4 object-contain"
                      loading="lazy"
                    />
                    <span className="text-gray-100">{item}</span>
                  </li>
                ))}
              </ul>
              <h3 className="text-2xl font-bold text-white mb-2 flex items-center mt-10">
                Embedded AI Systems
              </h3>
              <div className="h-1 w-24 bg-yellow-500 mb-4 rounded"></div>
              <ul className="space-y-4">
                {tier2.embeddedAISystems.map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <img
                      src="/services-images/list-icon.webp"
                      alt="list icon"
                      className="mt-1 mr-2 w-5 h-4 object-contain"
                      loading="lazy"
                    />
                    <span className="text-gray-100">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Deliverables */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-2 flex items-center">
                Deliverables
              </h3>
              <div className="h-1 w-24 bg-yellow-500 mb-4 rounded"></div>
              <ul className="space-y-4">
                {tier2.deliverables.map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <img
                      src="/services-images/list-icon.webp"
                      alt="list icon"
                      className="mt-1 mr-2 w-5 h-4 object-contain"
                      loading="lazy"
                    />
                    <span className="text-gray-100">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}