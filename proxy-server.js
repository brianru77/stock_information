//외부 라이브러리 불러오기
const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv'); // .env 파일에서 환경변수 불러오기
const cors = require('cors');     // CORS 정책 우회용

//환경변수=.env 설정
dotenv.config();

//Express 서버 인스턴스 생성
const app = express();

//모든 프론트엔드 요청 허용 (CORS)
app.use(cors());

//서버 포트 설정
const PORT = 4000;

//요청할 데이터 심볼_Twelve Data
const symbols = [
  'DXY/USD',     // 달러 인덱스
  'WTI/USD',     // 서부 텍사스산 원유 가격
  'USD/KRW',     // 환율: 달러-원화
  'USD/JPY',     // 환율: 달러-엔
  'USD/CHF',     // 환율: 달러-스위스프랑
  'NASDAQ',      // 나스닥 지수
  'SPX',         // S&P500 지수
  'DJI'          // 다우존스 지수
];

//프론트엔드에서 /market-data 요청 시 Twelve Data API를 프록시하여 데이터 제공
app.get('/market-data', async (req, res) => {
  try {
    //Twelve Data의 price API에 GET 요청
    const response = await axios.get(`https://api.twelvedata.com/price`, {
      params: {
        symbol: symbols.join(','),         // ,로 연결된 심볼 리스트
        apikey: process.env.TWELVEDAT      // .env에 저장된 API 키 사용
      }
    });

    //클라이언트에게 데이터 응답
    res.json(response.data);
  } catch (err) {
    //API 요청 실패 시 에러 처리
    console.error('❌ 오류:', err.message);
    res.status(500).json({
      message: 'Twelve Data API 요청 실패',
      error: err.message
    });
  }
});

//서버 실행
app.listen(PORT, () => {
  console.log(`✅ 프록시 서버 실행됨: http://localhost:${PORT}`);
});