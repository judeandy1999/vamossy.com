
export default function PageWrapper({ title, subtitle, children, color = 'default' }) {

  const backgrounds = {
    default: 'from-[#a3c9cc] via-[#e8c3a3] to-[#eaeaea]',
    about: 'from-[#b8d4e5] via-[#e6bfa1] to-[#f5e9d6]',
    services: 'from-[#b9d8a8] via-[#e8a8a8] to-[#d4e2c0]',
    work: 'from-[#9fc7c4] via-[#e8a8b8] to-[#e3c5c9]',
    pricing: 'from-[#f6e8a0] via-[#e6a87a] to-[#e8c8d8]',
    contact: 'from-[#b5b7e5] via-[#a8c8e5] to-[#c8e2c8]',
    blog: 'from-[#c6bdd8] via-[#e8a8a8] to-[#a3c9cc]'
  };

  const selectedBackground = backgrounds[color] || backgrounds.default;

  return (
    <div className="space-y-24 bg-white">
      {/* Header Section */}
      <section className={`relative bg-gradient-to-tr ${selectedBackground} py-32 mb-0 text-center overflow-hidden`}>
        <div className="absolute inset-0 backdrop-blur-sm"></div>
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <h1 className="text-5xl font-extrabold leading-tight mb-4 text-gray-800 drop-shadow">
            {title}
          </h1>
          {subtitle && <p className="text-xl text-gray-600">{subtitle}</p>}
        </div>
        <svg className="absolute bottom-0 left-0 w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#ffffff" fillOpacity="1" d="M0,224L60,213.3C120,203,240,181,360,170.7C480,160,600,160,720,176C840,192,960,224,1080,229.3C1200,235,1320,213,1380,202.7L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path></svg>
      </section>

      {/* Page Content */}
      <section className="max-w-6xl mx-auto px-6">
        {children}
      </section>
    </div>
  );
}
