const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();
app.use(cors());

const PORT = 4000;

// 원하는 심볼만 우선 선택
const symbols = [
  'DXY/USD',     // 달러 인덱스
  'WTI/USD',     // WTI 유가
  'USD/KRW',     // 환율: 달러-원화
  'USD/JPY',     // 환율: 달러-엔화
  'USD/CHF'      // 환율: 달러-스위스프랑 //twelvedata에는 엔-원,프랑-원에 대한 심볼이 없어서 불가능.
];

app.get('/market-data', async (req, res) => {
  try {
    const response = await axios.get(`https://api.twelvedata.com/price`, {
      params: {
        symbol: symbols.join(','),
        apikey: process.env.TWELVEDAT,
      }
    });

    res.json(response.data);
  } catch (err) {
    console.error('❌ 오류:', err.message);
    res.status(500).json({ message: 'Twelve Data API 요청 실패', error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ 프록시 서버 실행됨: http://localhost:${PORT}`);
});