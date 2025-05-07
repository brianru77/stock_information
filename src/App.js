import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SideImageSlider from './SideImageSlider';

const Gold_Silver_Constant = 31.1034768;
const POLL_INTERVAL_MS = 60_000; // fetchPrices() 60초 마다 실행 60000은 가독성 안 좋아서 60은 0.06초

function App() {
  const [goldOz, setGoldOz] = useState(null); //goldOz는 읽기 setGoldOz는 상태변경 null은 초기값
  const [silverOz, setSilverOz] = useState(null); //은값
  const [usdKrw, setUsdKrw] = useState(null); //금값 환율
  const [bitcoinPrice, setBitcoinPrice] = useState(null); //비트코인 시세
  const [error, setError] = useState(null); //에러체크
  const [marketData, setMarketData] = useState(null); //

  //심볼없어서 환율 계산
  const usdKrwEX = parseFloat(marketData['USD/KRW']?.price);
  const usdJpy = parseFloat(marketData['USD/JPY']?.price);
  const usdChf = parseFloat(marketData['USD/CHF']?.price);
  const jpyToKrw = usdJpy ? usdKrw / usdJpy : null;
  const chfToKrw = usdChf ? usdKrw / usdChf : null;

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

        // 2. 금 환율 가져오기
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
    <>
      <SideImageSlider />
      <div
        style={{
          padding: '40px', fontFamily: 'Arial, sans-serif', backgroundColor: '#fff8f0', color: '#4b3d2a',
          minHeight: '100vh'
        }}>
        <h1 style={{ textAlign: 'center', marginTop: '20px' }}>
          📈 현금 흐름 지표 페이지
        </h1>

        <h1 style={{ marginBottom: '20px', color: '#333' }}>실시간 금과 은 1g당 가격</h1>

        <div
          style={{
            background: '#fff',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 0 10px rgba(0,0,0,0.05)',
            marginBottom: '30px',
            width: '40%',      // ✅ 가로폭 줄이기 (예: 70%)
            height: '370px',   // ✅ 세로 길이 늘리기 (예: 400px)
            margin: '0',         // margin을 초기화하거나
            marginLeft: '0'      // 명시적으로 왼쪽 정렬
          }}
        >
          <h2 style={{ marginBottom: '10px' }}>🏅 금</h2>
          <h1>🇰🇷 <strong>₩{Math.round(goldPerGramKrw).toLocaleString()}</strong>원</h1>
          <p>🇺🇸 <strong>${goldPerGramUsd.toFixed(2)}</strong> /g</p>

          <h2 style={{ marginTop: '20px', marginBottom: '10px' }}>🥈 은</h2>
          <h1>🇰🇷 <strong>₩{Math.round(silverPerGramKrw).toLocaleString()}</strong>원</h1>
          <p>🇺🇸 <strong>${silverPerGramUsd.toFixed(2)}</strong> /g</p>
        </div>

        <h2 style={{ marginBottom: '10px', color: '#333' }}>₿ 실시간 비트코인 시세</h2>
        {bitcoinPrice != null ? (
          <p style={{ fontSize: '30px', fontWeight: 'bold', color: '#d17b0f' }}>
            ₩{bitcoinPrice.toLocaleString()}원 (1 BTC)
          </p>
        ) : (
          <p>불러오는 중...</p>
        )}

        <h2 style={{ marginTop: '40px', marginBottom: '15px', color: '#333' }}>📊 실시간 시장 데이터</h2>
        {marketData ? (
          <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
            <li>💵 달러 인덱스: <strong>{marketData['DXY/USD']?.price}</strong></li>
            <li>🛢️ WTI 유가: <strong>{marketData['WTI/USD']?.price}</strong></li>
            <li>🇺🇸 USD/KRW: <strong>{marketData['USD/KRW']?.price}</strong></li>
            {/* <li>🇯🇵 JPY/KRW: <strong>{marketData['JPY/KRW']?.price}</strong></li>
            <li>🇨🇭 CHF/KRW: <strong>{marketData['CHF/KRW']?.price}</strong></li> */}
            <li>🇯🇵 JPY/KRW: <strong>{jpyToKrw ? jpyToKrw.toFixed(2) : '불러오는 중'}</strong></li>
            <li>🇨🇭 CHF/KRW: <strong>{chfToKrw ? chfToKrw.toFixed(2) : '불러오는 중'}</strong></li>
          </ul>
        ) : (
          <p>데이터 불러오는 중...</p>
        )}
      </div>
    </>
  );
}

export default App;