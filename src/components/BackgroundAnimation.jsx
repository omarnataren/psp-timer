export function BackgroundAnimation() {
  const bubbles = Array.from({ length: 18 });

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1] bg-gray-100">
      {bubbles.map((_, i) => {
        const size = 25 + Math.random() * 50;
        const left = Math.random() * 100;
        const moveDuration = 14 + Math.random() * 18;          // how long to reach top
        const fadeDuration = moveDuration * (0.4 + Math.random() * 0.6); // die 40–100% of the way
        const delay = -(Math.random() * 35);                   // stagger start
        const opacity = 0.2 + Math.random() * 0.25;           // 0.20 – 0.45

        return (
          <div
            key={i}
            className="absolute rounded-full bg-black"
            style={{
              width: size,
              height: size,
              left: `${left}%`,
              bottom: `-${size}px`,
              opacity: 0,
              '--bubble-opacity': opacity,
              animation:
                `floatUp ${moveDuration}s infinite linear ${delay}s, ` +
                `bubbleFade ${fadeDuration}s infinite linear ${delay}s`,
            }}
          />
        );
      })}
    </div>
  );
}

