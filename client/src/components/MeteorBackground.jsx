import { useEffect, useState } from 'react';

const MeteorBackground = () => {
  const [meteors, setMeteors] = useState([]);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const meteorCount = isMobile ? 10 : 30;
    
    const createMeteor = () => {
      return {
        id: Math.random(),
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 3}s`,
        animationDuration: `${2 + Math.random() * 3}s`,
        size: Math.random() * 2 + 1
      };
    };

    const initialMeteors = Array.from({ length: meteorCount }, createMeteor);
    setMeteors(initialMeteors);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {meteors.map((meteor) => (
        <span
          key={meteor.id}
          className="absolute top-0 animate-meteor"
          style={{
            left: meteor.left,
            width: `${meteor.size}px`,
            height: `${meteor.size}px`,
            background: 'linear-gradient(45deg, rgba(123, 47, 255, 0.8), transparent)',
            borderRadius: '50%',
            animationDelay: meteor.animationDelay,
            animationDuration: meteor.animationDuration,
            boxShadow: '0 0 6px 2px rgba(123, 47, 255, 0.3)',
          }}
        />
      ))}
      <style>{`
        @keyframes meteor {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) translateX(-100px);
            opacity: 0;
          }
        }
        .animate-meteor {
          animation: meteor linear infinite;
        }
      `}</style>
    </div>
  );
};

export default MeteorBackground;
