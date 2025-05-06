import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GRAMS_PER_TROY_OUNCE = 31.1034768;
const POLL_INTERVAL_MS = 60_000;

function App() {
  const [goldOz, setGoldOz] = useState(null);
  const [silverOz, setSilverOz] = useState(null);
  const [usdKrw, setUsdKrw] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPrices() {
      try {
        // 1. 금/은 시세 가져오기
        const resG = await fetch('https://data-asg.goldprice.org/dbXRates/USD');
        if (!resG.ok) throw new Error('금/은 시세 API 오류');
        const dataG = await resG.json();
        const goldPrice = dataG?.items?.[0]?.xauPrice;
        const silverPrice = dataG?.items?.[0]?.xagPrice;

        if (typeof goldPrice !== 'number' || typeof silverPrice !== 'number') {
          throw new Error('금/은 데이터 오류');
        }

        setGoldOz(goldPrice);
        setSilverOz(silverPrice);

        // 2. 환율 가져오기
        const resF = await fetch('https://open.er-api.com/v6/latest/USD');
        if (!resF.ok) throw new Error('환율 API 오류');
        const fx = await resF.json();
        const krwRate = fx?.rates?.KRW;
        if (typeof krwRate !== 'number') throw new Error('환율 데이터 오류');
        setUsdKrw(krwRate);

        setError(null);
      } catch (e) {
        console.error('에러:', e);
        setError('데이터를 불러오는 중 문제가 발생했습니다.');
      }
    }

    fetchPrices();
    const timer = setInterval(fetchPrices, POLL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  if (error) return <div style={{ color: 'red', padding: 20 }}>{error}</div>;
  if (goldOz == null || silverOz == null || usdKrw == null) return <div style={{ padding: 20 }}>Loading...</div>;

  // 계산
  const goldPerGramUsd = goldOz / GRAMS_PER_TROY_OUNCE;
  const goldPerGramKrw = goldPerGramUsd * usdKrw;

  const silverPerGramUsd = silverOz / GRAMS_PER_TROY_OUNCE;
  const silverPerGramKrw = silverPerGramUsd * usdKrw;

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>실시간 시세 (1g 기준)</h1>
      <p>금 (USD): ${goldPerGramUsd.toFixed(2)} /g</p>
      <p>금 (KRW): ₩{goldPerGramKrw.toLocaleString()} /g</p>
      <hr />
      <p>은 (USD): ${silverPerGramUsd.toFixed(2)} /g</p>
      <p>은 (KRW): ₩{silverPerGramKrw.toLocaleString()} /g</p>
    </div>
  );
}

export default App;