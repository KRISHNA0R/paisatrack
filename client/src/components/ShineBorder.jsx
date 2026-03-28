const ShineBorder = ({ children, shineColor = ['#A07CFE', '#FE8FB5', '#FFBE7B'], className = '' }) => {
  return (
    <div className={`relative ${className}`} style={{ position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          inset: '-2px',
          borderRadius: 'inherit',
          padding: '2px',
          background: `linear-gradient(${shineColor.join(', ')})`,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          animation: 'shineRotate 4s linear infinite',
        }}
      />
      <style>{`
        @keyframes shineRotate {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }
      `}</style>
      {children}
    </div>
  );
};

export default ShineBorder;
