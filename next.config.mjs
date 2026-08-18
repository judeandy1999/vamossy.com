/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/services", destination: "/", permanent: true },
      { source: "/services/:path*", destination: "/", permanent: true },
      { source: "/how-it-works", destination: "/llm-governance-toolkit", permanent: true },
      { source: "/contact", destination: "/about", permanent: true },
      { source: "/case-studies", destination: "/research", permanent: true },
      { source: "/case-studies/:path*", destination: "/research", permanent: true },
      { source: "/articles", destination: "/research", permanent: true },
      { source: "/articles/:path*", destination: "/research", permanent: true },
      { source: "/about/about-vamossy", destination: "/about", permanent: true },
      { source: "/about/faq", destination: "/about", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/downloads/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Cache-Control", value: "public, max-age=86400" },
        ],
      },
    ];
  },
};

export default nextConfig;
