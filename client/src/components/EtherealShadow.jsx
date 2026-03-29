const EtherealShadow = () => {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: `
            radial-gradient(ellipse 80% 60% at 20% 20%, rgba(123, 47, 255, 0.25) 0%, transparent 60%),
            radial-gradient(ellipse 70% 50% at 80% 30%, rgba(139, 92, 246, 0.2) 0%, transparent 55%),
            radial-gradient(ellipse 75% 55% at 30% 80%, rgba(30, 64, 175, 0.18) 0%, transparent 60%),
            radial-gradient(ellipse 60% 45% at 70% 70%, rgba(88, 28, 135, 0.2) 0%, transparent 50%),
            radial-gradient(ellipse 50% 40% at 50% 50%, rgba(123, 47, 255, 0.15) 0%, transparent 45%)
          `,
        }}
      />

      <div
        className="hidden md:block"
        style={{
          position: 'absolute',
          width: '800px',
          height: '800px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(123, 47, 255, 0.2) 0%, transparent 60%)',
          top: '-300px',
          right: '-300px',
          animation: 'floatOrb1 15s ease-in-out infinite',
        }}
      />

      <div
        className="hidden md:block"
        style={{
          position: 'absolute',
          width: '700px',
          height: '700px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(88, 28, 135, 0.25) 0%, transparent 60%)',
          bottom: '-250px',
          left: '-250px',
          animation: 'floatOrb2 18s ease-in-out infinite',
        }}
      />

      <div
        className="hidden md:block"
        style={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(30, 64, 175, 0.2) 0%, transparent 60%)',
          top: '30%',
          left: '40%',
          transform: 'translate(-50%, -50%)',
          animation: 'floatOrb3 20s ease-in-out infinite',
        }}
      />

      <div
        className="hidden md:block"
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 60%)',
          top: '60%',
          left: '20%',
          animation: 'floatOrb4 22s ease-in-out infinite',
        }}
      />

      <div
        className="hidden md:block"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px',
          backgroundRepeat: 'repeat',
          opacity: 0.04,
        }}
      />

      <style>{`
        @keyframes floatOrb1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(-50px, 30px) scale(1.1); }
          50% { transform: translate(-30px, -50px) scale(1.05); }
          75% { transform: translate(50px, -30px) scale(1.15); }
        }
        @keyframes floatOrb2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(60px, -40px) scale(1.12); }
          66% { transform: translate(-40px, 50px) scale(1.08); }
        }
        @keyframes floatOrb3 {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.2); }
        }
        @keyframes floatOrb4 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(40px, -60px); }
        }
      `}</style>
    </div>
  );
};

export default EtherealShadow;
