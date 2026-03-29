import { useEffect, useState, useRef } from 'react';

const AnimatedNumber = ({ value, className = '', style = {}, duration = 1000 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const spanRef = useRef(null);
  const startTimeRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const startValue = displayValue;
    const difference = value - startValue;
    
    if (difference === 0) return;

    const animate = (timestamp) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }
      
      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + difference * easeOut);
      
      setDisplayValue(current);
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    startTimeRef.current = null;
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, duration]);

  useEffect(() => {
    if (spanRef.current && style) {
      Object.keys(style).forEach(key => {
        spanRef.current.style[key] = style[key];
      });
    }
  }, [style]);

  return (
    <span ref={spanRef} className={className}>
      {displayValue.toLocaleString('en-IN')}
    </span>
  );
};

export default AnimatedNumber;
