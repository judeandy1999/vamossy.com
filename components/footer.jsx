import BottomFooter from "./bottom-footer";
import { footerLinks } from "@/data/data";

export default function Footer() {
  return (
    <>
      <footer className="bg-[#0a1e2d] text-white py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-6">
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              {section.title === "Recent Blog Posts" ? (
                <ul className="space-y-4">
                  {section.items.map((post, idx) => (
                    <li key={idx}>
                      <p className="text-sm text-gray-400">{post.date}</p>
                      <a
                        href="#"
                        className="text-white hover:text-yellow-400 transition"
                      >
                        {post.title}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="space-y-2">
                  {section.items.map((item, idx) => (
                    <li key={idx}>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-yellow-400 transition"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </footer>
      <BottomFooter />
    </>
  );
}