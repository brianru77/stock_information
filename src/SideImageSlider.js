import React, { useState, useEffect } from 'react';
import './App.css';

//이미지
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
  const [currentIndex, setCurrentIndex] = useState(0); //현재 중앙에 보이는 이미지 인덱스

  useEffect(() => {
    //3초마다 currentIndex를 1씩 증가시키며 이미지 전환
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    //언마운트 시 인터벌 제거
    return () => clearInterval(timer);
  }, []);

  //현재 인덱스 기준으로 좌우 이미지의 인덱스를 순환 계산
  const getIndex = (offset) => {
    const len = images.length;
    return (currentIndex + offset + len) % len; // 💡 음수 인덱스 방지
  };

  return (
    <div className="slider-container">
      <div className="slider-wrapper">
        {/*중앙 기준으로 좌2 / 좌1 / 중앙 / 우1 / 우2 이미지를 표시 */}
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