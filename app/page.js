import Image from "next/image";

export default function Home() {
    return (
      <div className="space-y-12">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-200 to-blue-300 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Elevate Your Brand Online</h1>
          <p className="text-lg mb-6">We build fast, modern, responsive websites that convert.</p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
            Get Started
          </button>
        </section>

        {/* Features Section */}
        <section className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center mb-8">Why Choose Us?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-white shadow rounded">
              <h3 className="text-xl font-bold mb-2">Custom Design</h3>
              <p>Tailored to fit your business and brand identity.</p>
            </div>
            <div className="p-6 bg-white shadow rounded">
              <h3 className="text-xl font-bold mb-2">SEO Optimized</h3>
              <p>Maximize visibility and attract more customers.</p>
            </div>
            <div className="p-6 bg-white shadow rounded">
              <h3 className="text-xl font-bold mb-2">Fast & Secure</h3>
              <p>Lightning fast performance with top-tier security.</p>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="bg-gray-100 py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to grow your business?</h2>
          <p className="mb-6">Let's create something amazing together.</p>
          <a
            href="/contact"
            className="inline-block bg-green-600 text-white px-8 py-3 rounded hover:bg-green-700 transition"
          >
            Book a Free Consultation
          </a>
        </section>
      </div>
    );
}
