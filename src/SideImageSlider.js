import React, { useState, useEffect } from 'react';

const images = [
  '/images/gold.png',
  '/images/silver.png',
  '/images/bitcoin.png'
];

function SideImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000); // 3초마다 전환
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: '18%',
      right: '10px',
      width: '600px',
      height: '600px',
      zIndex: 1000
    }}>
      <img
        src={images[currentIndex]}
        alt="symbol"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          transition: 'opacity 0.5s ease-in-out',
          opacity: 1
        }}
      />
    </div>
  );
}
export default SideImageSlider;