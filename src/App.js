import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OUNCE_TO_GRAM = 31.1034768;

function App() {
  const [goldPricePerGram, setGoldPricePerGram] = useState(null);
  const [silverPricePerGram, setSilverPricePerGram] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPrices = async () => {
    try {
      const headers = {
        'x-access-token': process.env.GOLDAPI_KEY,
        'Content-Type': 'application/json'
      };

      const [goldRes, silverRes] = await Promise.all([
        axios.get('https://www.goldapi.io/api/XAU/KRW', { headers }),
        axios.get('https://www.goldapi.io/api/XAG/KRW', { headers })
      ]);

      const goldPerGram = goldRes.data.price / OUNCE_TO_GRAM;
      const silverPerGram = silverRes.data.price / OUNCE_TO_GRAM;

      setGoldPricePerGram(goldPerGram);
      setSilverPricePerGram(silverPerGram);
    } catch (error) {
      console.error('가격 가져오기 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  const formatPrice = (value) =>
    value?.toLocaleString('ko-KR', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    });

  return (
    <div style={{ padding: 30, fontFamily: 'Arial' }}>
      <h1>실시간 귀금속 시세 (그램당, 원화)</h1>
      {loading ? (
        <p>로딩 중...</p>
      ) : (
        <ul style={{ fontSize: '1.2rem', listStyle: 'none', padding: 0 }}>
          <li> 금 (Gold): <strong>{formatPrice(goldPricePerGram)} 원/g</strong></li>
          <li> 은 (Silver): <strong>{formatPrice(silverPricePerGram)} 원/g</strong></li>
        </ul>
      )}
    </div>
  );
}

export default App;
