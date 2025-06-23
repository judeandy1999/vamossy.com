'use client';

export default function Container({ 
  children, 
  className = '',
  variant = 'default',
}) {
  
  const getVariantClasses = (variant) => {
    switch (variant) {
      case 'transparent':
        return 'bg-transparent';
      case 'gradient':
        return 'bg-gray-900';
      case 'gray':
        return 'py-0 px-0 bg-[#262626]';
      case 'transparent-gradient':
        return 'bg-gradient-to-br from-gray-900/30 to-blue-900/30';
      case 'gray-gradient':
        return 'bg-gray-900';
      case 'gray-card':
        return 'mt-5 md:mt-16 md:px-10 rounded-xl border border-yellow-400 bg-gradient-to-br from-[#262626] to-gray-900';
      default:
        return `bg-transparent`;
    }
  };
console.log(variant);
  const containerClasses = `py-8 lg:py-16 px-4 relative w-full overflow-hidden flex flex-row justify-center ${getVariantClasses(variant)} ${className}`;

  return (
    <section className={containerClasses}>
      {
        variant !== 'gray' &&
         <div className="absolute inset-0 overflow-hidden bg-black/30"></div>
      }
     
      <div className="relative max-w-7xl mx-auto">
        {children}
      </div>
      {
        variant === 'transparent' &&
          <div className="absolute bottom-0 left-0 w-full h-52 bg-gradient-to-b from-transparent to-[#262626] z-10"></div>

      }
    </section>
  );
}