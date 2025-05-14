// 🔧 환경변수(.env)를 불러오기 위한 설정
require('dotenv').config();

// 🔌 필요한 라이브러리 불러오기
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db'); // DB 연결 파일 (pg Pool 객체)

// ✅ express 앱 초기화는 반드시 require 이후에!
const app = express();

// ✅ 미들웨어
//app.use(cors()); // 프론트 요청 허용
app.use(cors({
  origin: 'http://localhost:3000',  // 프론트엔드 주소
  credentials: true                 // 쿠키 인증이 필요할 경우 true (현재는 토큰 방식이라 없어도 작동은 함)
}));
app.use(express.json()); // JSON 바디 파싱


// ✅ 회원가입 API
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 🔒 비밀번호 해시 처리
    const hash = await bcrypt.hash(password, 10);

    // 🗄️ users 테이블에 email, password_hash 저장
    await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2)',
      [email, hash]
    );

    res.status(201).send({ message: '회원가입 성공!' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: '회원가입 실패', error: err.detail });
  }
});


// ✅ 로그인 + JWT 토큰 발급 API
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 📥 이메일로 사용자 조회
    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    const user = userResult.rows[0];

    // ❌ 사용자 없을 경우
    if (!user) {
      return res.status(401).send({ message: '존재하지 않는 사용자입니다.' });
    }

    // 🔒 비밀번호 비교
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).send({ message: '비밀번호가 일치하지 않습니다.' });
    }

    // ✅ JWT 토큰 생성 (1시간 유효)
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.send({ message: '로그인 성공!', token });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: '로그인 중 오류 발생' });
  }
});


// ✅ 토큰 검증 미들웨어
const authenticate = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).send({ message: '토큰이 없습니다' });

  const token = auth.split(' ')[1]; // "Bearer <token>" 구조
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // 🔐 토큰 유효성 검증
    req.user = decoded; // 이후 req.user.id, req.user.email 사용 가능
    next();
  } catch {
    return res.status(403).send({ message: '유효하지 않은 토큰입니다' });
  }
};


// ✅ 인증된 사용자만 접근 가능한 API
app.get('/api/me', authenticate, (req, res) => {
  res.send({ message: '인증된 사용자입니다', user: req.user });
});


// ✅ 서버 시작
app.listen(4000, () => {
  console.log('🚀 서버 실행 중: http://localhost:4000');
});