import { useEffect, useState, useRef } from 'react';

const SmoothCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);
  const cursorRef = useRef(null);
  const targetRef = useRef({ x: -100, y: -100 });
  const animationRef = useRef(null);

  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice(
        'ontouchstart' in window || 
        navigator.maxTouchPoints > 0 || 
        window.matchMedia('(pointer: coarse)').matches
      );
    };
    
    checkTouchDevice();
    
    if (isTouchDevice) return;

    const handleMouseMove = (e) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    const animate = () => {
      const dx = targetRef.current.x - position.x;
      const dy = targetRef.current.y - position.y;
      
      if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
        setPosition(prev => ({
          x: prev.x + dx * 0.15,
          y: prev.y + dy * 0.15
        }));
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isTouchDevice, isVisible, position.x, position.y]);

  if (isTouchDevice) return null;

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        style={{
          left: position.x,
          top: position.y,
          transform: 'translate(-50%, -50%)',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.3s',
        }}
      >
        <div className="relative">
          <div className="w-8 h-8 rounded-full border-2 border-white" />
          <div className="absolute inset-0 w-8 h-8 rounded-full bg-white/20 animate-ping" />
        </div>
      </div>
    </>
  );
};

export default SmoothCursor;
