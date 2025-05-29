'use client';

export default function CallToActionButton({ href, title, size = 'md' }) {

  const sizeClasses = {
    sm: 'text-lg px-4 py-2',
    md: 'text-2xl px-6 py-3',
    lg: 'text-4xl px-8 py-4',
  };

  return (
    <a
      href={href}
      className={`mt-6 inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-full transition ${sizeClasses[size]}`}
    >
      {title}
    </a>
  );
}