import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SideImageSlider from '../SideImageSlider';

const Gold_Silver_Constant = 31.1034768;
const POLL_INTERVAL_MS = 3600000; //1시간

export default function Home() {
  const [goldOz, setGoldOz] = useState(null);
  const [silverOz, setSilverOz] = useState(null);
  const [usdKrw, setUsdKrw] = useState(null);
  const [bitcoinPrice, setBitcoinPrice] = useState(null);
  const [marketData, setMarketData] = useState(null);
  const [error, setError] = useState(null);

  let usdKrwEX, usdJpy, usdChf, jpyToKrw, chfToKrw;
  if (
    marketData &&
    marketData['USD/KRW'] &&
    marketData['USD/JPY'] &&
    marketData['USD/CHF']
  ) {
    usdKrwEX = parseFloat(marketData['USD/KRW'].price);
    usdJpy = parseFloat(marketData['USD/JPY'].price);
    usdChf = parseFloat(marketData['USD/CHF'].price);
    jpyToKrw = usdJpy ? usdKrwEX / usdJpy : null;
    chfToKrw = usdChf ? usdKrwEX / usdChf : null;
  }

  useEffect(() => {
    fetch('http://localhost:4000/market-data')
      .then(res => res.json())
      .then(data => setMarketData(data))
      .catch(err => console.error('❌ 시장 데이터 오류:', err));

    async function fetchPrices() {
      try {
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

        const resF = await fetch('https://open.er-api.com/v6/latest/USD');
        if (!resF.ok) throw new Error('환율 API 오류');
        const fx = await resF.json();
        const krwRate = fx?.rates?.KRW;
        if (typeof krwRate !== 'number') throw new Error('환율 데이터 오류');
        setUsdKrw(krwRate);

        const resBTC = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=krw');
        if (!resBTC.ok) throw new Error(`비트코인 API 오류: ${resBTC.status}`);
        const btc = await resBTC.json();
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

  const goldPerGramUsd = goldOz / Gold_Silver_Constant;
  const goldPerGramKrw = goldPerGramUsd * usdKrw;
  const silverPerGramUsd = silverOz / Gold_Silver_Constant;
  const silverPerGramKrw = silverPerGramUsd * usdKrw;

  return (
    <>
      <SideImageSlider />
      <div style={{
        padding: '40px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#fff8f0',
        color: '#4b3d2a',
        minHeight: '100vh'
      }}>
        {/* <h1 style={{ textAlign: 'center' }}>📈 현금 흐름 지표 페이지</h1> */}
        <h1 style={{
          textAlign: 'center',
          fontFamily: 'Montserrat, Noto Sans KR, sans-serif',
          color: '#2F4858',  // 편안한 네이비 색
          fontSize: '2rem',
          fontWeight: '600',
          letterSpacing: '0.5px',
          marginTop: '-40px',  // 위쪽 여백 줄이기
          margin: '24px 0'
        }}>
          📈 Cash Flow Metrics Page
        </h1>

        <h2>실시간 금과 은 1g당 가격</h2>
        <div style={{
          background: '#fff',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 0 10px rgba(0,0,0,0.05)',
          width: '40%',
          marginBottom: '30px'
        }}>
          <h3 style={{ marginBottom: '10px', fontSize: '20px', color: '#333' }}>🏅 금</h3>
          <h1 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#d4af37', // 금색
            margin: '8px 0'
          }}>
            ₩{Math.round(goldPerGramKrw).toLocaleString()}원
          </h1>
          <p style={{ fontSize: '18px', color: '#888' }}>
            ${goldPerGramUsd.toFixed(2)} /g
          </p>

          <h3 style={{ marginTop: '30px', marginBottom: '10px', fontSize: '20px', color: '#333' }}>🥈 은</h3>
          <h1 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#aaa', // 은색
            margin: '8px 0'
          }}>
            ₩{Math.round(silverPerGramKrw).toLocaleString()}원
          </h1>
          <p style={{ fontSize: '18px', color: '#888' }}>
            ${silverPerGramUsd.toFixed(2)} /g
          </p>
        </div>

        <h2>₿ 실시간 비트코인 시세</h2>
        {bitcoinPrice != null ? (
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#d17b0f' }}>
            ₩{bitcoinPrice.toLocaleString()}원 (1 BTC)
          </p>
        ) : (
          <p>불러오는 중...</p>
        )}

        <h2 style={{ marginTop: '30px' }}>📊 실시간 시장 데이터</h2>
        {marketData ? (
          <ul>
            <li>나스닥 지수: <strong>{marketData['NASDAQ']}</strong></li>
            <li>S&P500 지수: <strong>{marketData['SPX']}</strong></li>
            <li>다우존스 지수: <strong>{marketData['DJI']}</strong></li>
            <li>💵 달러 인덱스: <strong>{marketData['DXY/USD']?.price}</strong></li>
            <li>🛢️ WTI 유가: <strong>{marketData['WTI/USD']?.price}</strong></li>
            <li>🇺🇸 USD/KRW: <strong>{marketData['USD/KRW']?.price}</strong></li>
            <li>🇯🇵 JPY/KRW: <strong>{jpyToKrw?.toFixed(2)}</strong></li>
            <li>🇨🇭 CHF/KRW: <strong>{chfToKrw?.toFixed(2)}</strong></li>
          </ul>
        ) : (
          <p>데이터 불러오는 중...</p>
        )}
      </div>
    </>
  );
}