import { useState, useEffect } from 'react';

const SpotlightCard = ({ children }) => {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setPosition({ x, y });
    };

    const container = document.getElementById('spotlight-container');
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  return (
    <div
      id="spotlight-container"
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="absolute inset-0 pointer-events-none rounded-3xl transition-opacity duration-500"
        style={{
          background: isHovered
            ? `radial-gradient(circle 150px at ${position.x}% ${position.y}%, rgba(123, 47, 255, 0.15), transparent 70%)`
            : 'transparent',
          opacity: isHovered ? 1 : 0,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle 80px at ${position.x}% ${position.y}%, rgba(123, 47, 255, 0.25), transparent 70%)`,
          filter: 'blur(20px)',
          transition: 'opacity 0.3s',
          opacity: isHovered ? 1 : 0,
        }}
      />
      {children}
    </div>
  );
};

export default SpotlightCard;
