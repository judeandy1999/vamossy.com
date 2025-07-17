export default function RiskRewardChart({ effort, reward, size = 'md' }) {
  const chartSize = size === 'sm' ? 80 : size === 'lg' ? 120 : size === 'xl' ? 350 : 100;
  const dotSize = size === 'sm' ? 6 : size === 'lg' ? 10 : size === 'xl' ? 12 : 8;
  
  // Calculate position (0-10 scale to 0-100% position)
  const x = (effort / 10) * 100;
  const y = 100 - (reward / 10) * 100; // Invert Y axis so high reward is at top
  
  return (
    <div className="relative">
      <svg width={chartSize} height={chartSize} className="border border-gray-300 rounded">
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Quadrant background colors */}
        <rect x="0" y="0" width="50%" height="50%" fill="#fef3c7" opacity="0.3" />
        <rect x="50%" y="0" width="50%" height="50%" fill="#d1fae5" opacity="0.3" />
        <rect x="0" y="50%" width="50%" height="50%" fill="#fecaca" opacity="0.3" />
        <rect x="50%" y="50%" width="50%" height="50%" fill="#fed7aa" opacity="0.3" />
        
        {/* Axes */}
        <line x1="0" y1="100%" x2="100%" y2="100%" stroke="#6b7280" strokeWidth="1" />
        <line x1="0" y1="0" x2="0" y2="100%" stroke="#6b7280" strokeWidth="1" />
        
        {/* Data point */}
        <circle 
          cx={`${x}%`} 
          cy={`${y}%`} 
          r={dotSize} 
          fill="#3b82f6" 
          stroke="#1d4ed8" 
          strokeWidth="2"
        />
      </svg>
      
      {/* Labels */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
        Effort
      </div>
      <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 -rotate-90 text-xs text-gray-500">
        Reward
      </div>
    </div>
  );
}