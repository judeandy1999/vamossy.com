export default function BottomFooter() {
  return (
    <footer className="bg-black text-white py-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between px-6">

        <div className="flex items-center space-x-2">
          {/* <img src="/logo-lightbulb.svg" alt="Logo" className="h-6 w-auto" /> */}
          <span className="text-xl font-bold">
            Brand<span className="text-yellow-400">Name</span>
          </span>
        </div>

        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#" aria-label="Facebook" className="hover:text-yellow-400">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#" aria-label="Twitter" className="hover:text-yellow-400">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#" aria-label="Instagram" className="hover:text-yellow-400">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="#" aria-label="LinkedIn" className="hover:text-yellow-400">
            <i className="fab fa-linkedin-in"></i>
          </a>
        </div>

        <div className="mt-4 md:mt-0 text-sm text-gray-400">
          <a href="#" className="hover:text-yellow-400">
            Privacy Policy
          </a>{" "}
          &copy; 2011-2025 All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}