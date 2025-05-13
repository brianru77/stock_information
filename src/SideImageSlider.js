import React, { useState, useEffect } from 'react';
import './App.css';

const images = [
  '/images/gold.png',
  '/images/silver.png',
  '/images/bitcoin.png',
  '/images/NASDAQ.png',
  '/images/US500.png',
  '/images/Dow.png',
  '/images/exchange_rate.png',
  '/images/Stock.png'
];

function SideImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const getIndex = (offset) => {
    const len = images.length;
    return (currentIndex + offset + len) % len;
  };

  return (
    <div className="slider-container">
      <div className="slider-wrapper">
        <img src={images[getIndex(-2)]} className="image far-left" alt="prev2" />
        <img src={images[getIndex(-1)]} className="image left" alt="prev1" />
        <img src={images[getIndex(0)]} className="image center" alt="current" />
        <img src={images[getIndex(1)]} className="image right" alt="next1" />
        <img src={images[getIndex(2)]} className="image far-right" alt="next2" />
      </div>
    </div>
  );
}

export default SideImageSlider;