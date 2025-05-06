// proxy-server.js
const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();
app.use(cors());

const PORT = 4000;

app.get('/gold', async (req, res) => {
  try {
    const response = await axios.get('https://www.goldapi.io/api/XAU/KRW', {
      headers: {
        'x-access-token': process.env.GOLDAPI_KEY,
        'Content-Type': 'application/json',
      }
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: 'Gold API 요청 실패', error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ 프록시 서버 실행됨: http://localhost:${PORT}`);
});