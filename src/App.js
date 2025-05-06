import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Gold_Silver_Constant = 31.1034768;
const POLL_INTERVAL_MS = 60_000; // fetchPrices() 60초 마다 실행 60000은 가독성 안 좋아서 60은 0.06초

function App() {
  const [goldOz, setGoldOz] = useState(null); //goldOz는 읽기 setGoldOz는 상태변경 null은 초기값
  const [silverOz, setSilverOz] = useState(null); //은값
  const [usdKrw, setUsdKrw] = useState(null); //환율
  const [bitcoinPrice, setBitcoinPrice] = useState(null); //비트코인 시세
  const [error, setError] = useState(null); //에러체크
  const [marketData, setMarketData] = useState(null); //

  useEffect(() => {

      //
      fetch('http://localhost:4000/market-data')
        .then(res => res.json())
        .then(data => {
          console.log('📈 실시간 데이터:', data);
          setMarketData(data);
        })
        .catch(error => {
          console.error('❌ 데이터 가져오기 실패:', error);
        });

    async function fetchPrices() {
      try {
        // 1. 금/은 시세 가져오기
        const resG = await fetch('https://data-asg.goldprice.org/dbXRates/USD');
        if (!resG.ok) throw new Error('금/은 시세 API 오류');
        //서버응답을 json으로 변환 후 dataG에 저장
        const dataG = await resG.json();
        //dataG에서 items[0].xauPrice 가져오는데 없으면 에러
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
        
        //비트코인 가져오기
        const resBTC = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=krw');
        if (!resBTC.ok) throw new Error(`비트코인 API 오류: ${resBTC.status}`);
        const btc = await resBTC.json();
        console.log('비트코인 응답:', btc);
        const btcKrw = btc?.bitcoin?.krw;
        if (typeof btcKrw !== 'number') throw new Error('비트코인 데이터 오류');
        setBitcoinPrice(btcKrw);

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
  const goldPerGramUsd = goldOz / Gold_Silver_Constant;
  const goldPerGramKrw = goldPerGramUsd * usdKrw;

  const silverPerGramUsd = silverOz / Gold_Silver_Constant;
  const silverPerGramKrw = silverPerGramUsd * usdKrw;

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>금과 은 1g당 가격</h1>
      <p>금 (KRW): ₩{Math.round(goldPerGramKrw).toLocaleString()}원 </p>
      <p>금 (USD): ${goldPerGramUsd.toFixed(2)} /g</p>
      <hr />
      <p>은 (KRW): ₩{Math.round(silverPerGramKrw).toLocaleString()}원 </p>
      <p>은 (USD): ${silverPerGramUsd.toFixed(2)} /g</p>
      <h2>₿ 비트코인 시세</h2>
      {bitcoinPrice != null && (
      <p>₩{bitcoinPrice.toLocaleString()}원 (1BTC)</p>
      )}
       <h1>📊 실시간 시장 데이터</h1>
      {marketData ? (
        <ul>
          <li>💵 달러 인덱스: {marketData['DXY/USD']?.price}</li>
          <li>🛢️ WTI 유가: {marketData['WTI/USD']?.price}</li>
          <li>🇺🇸 USD/KRW: {marketData['USD/KRW']?.price}</li>
          <li>🇯🇵 USD/JPY: {marketData['USD/JPY']?.price}</li>
          <li>🇨🇭 USD/CHF: {marketData['USD/CHF']?.price}</li>
        </ul>
      ) : (
        <p>데이터 불러오는 중...</p>
      )}
    </div>
  );
}

export default App;