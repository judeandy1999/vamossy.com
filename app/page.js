import Image from "next/image";

export default function Home() {
    return (
      <div className="space-y-24 bg-white">
        {/* Hero Section */}
        <section className="mb-0 relative bg-gradient-to-tr from-[#e0f7fa] via-[#fce4ec] to-[#f3e5f5] py-32 text-center overflow-hidden">
          <div className="absolute inset-0 bg-white/40 backdrop-blur-sm"></div>
          <div className="relative z-10 max-w-3xl mx-auto px-4">
            <h1 className="text-5xl font-extrabold leading-tight mb-6 text-gray-800 drop-shadow">
              Build Your Digital Empire
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Stunning, scalable websites that accelerate your growth and leave a lasting impression.
            </p>
            <button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3 rounded-full shadow-lg hover:opacity-90 transition">
              Let’s Get Started
            </button>
          </div>
          <svg className="absolute bottom-0 left-0 w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#ffffff" fillOpacity="1" d="M0,224L60,213.3C120,203,240,181,360,170.7C480,160,600,160,720,176C840,192,960,224,1080,229.3C1200,235,1320,213,1380,202.7L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path></svg>
        </section>

        {/* Features Section */}
        <section className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-12">What We Offer</h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="p-6 bg-gray-50 rounded-2xl shadow-xl hover:shadow-2xl transition">
              <img src="/icons/design.svg" alt="Design" className="w-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Bespoke Design</h3>
              <p>Custom UI/UX to match your brand, not templates.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-2xl shadow-xl hover:shadow-2xl transition">
              <img src="/icons/seo.svg" alt="SEO" className="w-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">SEO-First Approach</h3>
              <p>Optimized to rank and generate real traffic and leads.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-2xl shadow-xl hover:shadow-2xl transition">
              <img src="/icons/performance.svg" alt="Performance" className="w-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Blazing Speed</h3>
              <p>Lightning-fast load times for better UX and conversions.</p>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="relative py-20 bg-indigo-50 text-center">
          <div className="max-w-2xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-4">Let's Make Something Great Together</h2>
            <p className="mb-6 text-gray-600">
              Contact us today to kickstart your next web project.
            </p>
            <a
              href="/contact"
              className="inline-block bg-indigo-600 text-white text-lg font-medium px-10 py-3 rounded-full hover:bg-indigo-700 transition"
            >
              Book Your Free Strategy Call
            </a>
          </div>
        </section>
      </div>
    );
}
