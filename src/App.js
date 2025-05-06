import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
    const [goldPrice, setGoldPrice] = useState(null);
    const [loading, setLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [error, setError] = useState(null);
  
    const fetchGoldPrice = async () => {
      try {
        setLoading(true);
        setError(null);
  
        const res = await axios.get('http://localhost:4000/gold'); // 프록시 서버 경로
        const pricePerGram = res.data.price / 31.1034768;
  
        setGoldPrice(pricePerGram);
        setLastUpdated(new Date().toLocaleTimeString());
      } catch (err) {
        setError('금 시세 요청 실패 (요청 제한 초과일 수 있음)');
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchGoldPrice(); // 최초 요청
  
      const interval = setInterval(() => {
        fetchGoldPrice();
      }, 60000); // 1분마다
  
      return () => clearInterval(interval); // 정리
    }, []);
  
    const formatPrice = (value) =>
      value?.toLocaleString('ko-KR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
  
    return (
      <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
        <h1>🪙 실시간 금 시세 (1g, 원화)</h1>
  
        {loading && <p>⏳ 로딩 중...</p>}
        {error && <p style={{ color: 'red' }}>⚠️ {error}</p>}
        {!loading && goldPrice && (
          <>
            <p><strong>1g = {formatPrice(goldPrice)} 원</strong></p>
            <p>⏱ 마지막 갱신: {lastUpdated}</p>
          </>
        )}
      </div>
    );
  }
  
// const Change_g = 31.1034768; //온스를 그램으로 변환시키는 상수 값 저장

// function App() {
//   const [goldPricePerGram, setGoldPricePerGram] = useState(null);
//   const [silverPricePerGram, setSilverPricePerGram] = useState(null);
//   const [loading, setLoading] = useState(true);

//   //API값 가져오기
//   const fetchPrices = async () => {
//     try {
//       const headers = {
//         'x-access-token': process.env.GOLDAPI_KEY,
//         'Content-Type': 'application/json'
//       };

//       //axios 비동기 요청 두 작업을 동시에 요청하고 기다림,두 요청 모두와야지 담코드로 넘어감 
//       const [goldRes, silverRes] = await Promise.all([
//         axios.get('https://www.goldapi.io/api/XAU/KRW', { headers }),
//         axios.get('https://www.goldapi.io/api/XAG/KRW', { headers })
//       ]);

//       const goldPerGram = goldRes.data.price / Change_g;
//       const silverPerGram = silverRes.data.price / Change_g;

//       setGoldPricePerGram(goldPerGram);
//       setSilverPricePerGram(silverPerGram);
//     } catch (error) {
//       console.error('가격을 가져오는데 실패했습니다:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPrices();
//   }, []);

//   const formatPrice = (value) =>
//     value?.toLocaleString('ko-KR', {
//       maximumFractionDigits: 2, //소숫점 2자리 고정
//       minimumFractionDigits: 2
//     });

//   return (
//     <div style={{ padding: 30, fontFamily: 'Arial' }}>
//       <h1>실시간 귀금속 시세 (그램당, 원화)</h1>
//       {loading ? (
//         <p>로딩 중...</p>
//       ) : (
//         <ul style={{ fontSize: '1.2rem', listStyle: 'none', padding: 0 }}>
//           <li> 금 (Gold): <strong>{formatPrice(goldPricePerGram)} 원/g</strong></li>
//           <li> 은 (Silver): <strong>{formatPrice(silverPricePerGram)} 원/g</strong></li>
//         </ul>
//       )}
//     </div>
//   );
// }

export default App;
