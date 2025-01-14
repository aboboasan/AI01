import React from 'react';

const BackgroundDecoration: React.FC = () => {
  return (
    <>
      <style>
        {`
          @keyframes float {
            0%, 100% {
              transform: translateY(0) translateX(0);
            }
            50% {
              transform: translateY(-20px) translateX(10px);
            }
          }

          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
              opacity: 0.8;
            }
            50% {
              transform: scale(1.05);
              opacity: 1;
            }
          }

          @keyframes drift {
            0% {
              transform: translateX(0);
            }
            50% {
              transform: translateX(20px);
            }
            100% {
              transform: translateX(0);
            }
          }

          .cloud-effect {
            background: rgba(255, 255, 255, 0.8);
            border-radius: 50px;
            box-shadow: 
              0 8px 32px -4px rgba(31, 38, 135, 0.2),
              0 4px 12px -2px rgba(255, 255, 255, 0.4);
            backdrop-filter: blur(4px);
          }
        `}
      </style>
      
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* 主背景渐变 */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-300/30 via-sky-400/20 to-sky-500/30" />
        
        {/* 云朵装饰 - 左上 */}
        <div className="absolute -left-20 top-20">
          <div className="cloud-effect w-[300px] h-[100px] animate-[float_20s_ease-in-out_infinite]" />
          <div className="cloud-effect w-[200px] h-[80px] absolute -right-20 -top-10 animate-[float_15s_ease-in-out_infinite_1s]" />
          <div className="cloud-effect w-[150px] h-[60px] absolute -left-10 top-20 animate-[float_18s_ease-in-out_infinite_2s]" />
        </div>
        
        {/* 云朵装饰 - 右上 */}
        <div className="absolute -right-20 top-40">
          <div className="cloud-effect w-[250px] h-[90px] animate-[float_22s_ease-in-out_infinite_1.5s]" />
          <div className="cloud-effect w-[180px] h-[70px] absolute -left-20 -top-15 animate-[float_17s_ease-in-out_infinite_3s]" />
        </div>

        {/* 漂浮的小云朵 */}
        <div className="absolute inset-0">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={`cloud-${index}`}
              className="absolute cloud-effect"
              style={{
                width: `${100 + Math.random() * 100}px`,
                height: `${40 + Math.random() * 30}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${15 + Math.random() * 10}s ease-in-out infinite ${Math.random() * 5}s`,
                opacity: 0.7,
              }}
            />
          ))}
        </div>
        
        {/* 光晕效果 */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, index) => (
            <div
              key={`glow-${index}`}
              className="absolute rounded-full bg-white/30"
              style={{
                width: `${5 + Math.random() * 5}px`,
                height: `${5 + Math.random() * 5}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                filter: 'blur(2px)',
                animation: `pulse ${3 + Math.random() * 4}s ease-in-out infinite ${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* 渐变光束 */}
        <div className="absolute inset-0">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={`beam-${index}`}
              className="absolute"
              style={{
                width: '3px',
                height: `${300 + Math.random() * 200}px`,
                background: 'linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)',
                left: `${20 + Math.random() * 60}%`,
                top: `-100px`,
                transform: `rotate(${75 + Math.random() * 20}deg)`,
                opacity: 0.3,
                animation: `drift ${20 + Math.random() * 10}s ease-in-out infinite ${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default BackgroundDecoration; 