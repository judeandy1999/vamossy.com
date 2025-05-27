import Link from 'next/link';

export default function NavBar() {
  return (
    <nav className="flex gap-4 p-4 bg-gray-800 text-white">
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/services">Services</Link>
      <Link href="/our-work">Our Work</Link>
      <Link href="/pricing">Pricing</Link>
      <Link href="/contact">Contact</Link>
      <Link href="/blog">Wiki</Link>
    </nav>
  );
}