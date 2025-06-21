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
        return 'bg-gradient-to-b from-[#262626] via-gray-800 to-gray-900';
      case 'gray':
        return 'py-0 px-0 bg-[#262626]';
      case 'transparent-gradient':
        return 'bg-gradient-to-br from-gray-900 via-blue-900/30 to-gray-800';
      case 'gray-gradient':
        return 'bg-gradient-to-br from-[#262626] via-gray-800 to-gray-900';
      default:
        return `bg-transparent`;
    }
  };

  const containerClasses = `py-8 lg:py-16 px-4 relative w-full overflow-hidden flex flex-row justify-center ${getVariantClasses(variant)} ${className}`;

  return (
    <section className={containerClasses}>
      {
      variant === 'gradient' &&
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>
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