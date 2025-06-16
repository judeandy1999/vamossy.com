import Image from "next/image";
import Link from "next/link";

export default function BottomFooter() {
  return (
    <footer className="bg-[#333] text-white py-4">
      <div className="max-w-6xl mx-auto flex flex-row items-center justify-between px-6">

        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center">
            <Image src="/homepage/logo.png" alt="Logo" width={100} height={25} className="h-5 md:h-11 lg:h-11 w-auto" />
          </Link>
        </div>

        <div className=" text-xs md:text-sm text-gray-400">
          <a href="#" className="hover:text-yellow-400">
            Privacy Policy
          </a>{" "}
          &copy; 2025 All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}