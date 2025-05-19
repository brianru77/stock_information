//.env 환경변수 불러오기
require('dotenv').config();

//라이브러리 불러오기
const express = require('express');           //웹 서버 프레임워크
const cors = require('cors');                 //CORS 정책 우회
const bcrypt = require('bcrypt');             //비밀번호 해싱
const jwt = require('jsonwebtoken');          //JWT 토큰 생성/검증
const pool = require('./db');                 //PostgreSQL Pool 객체 (DB 연결 설정)

//Express 앱 초기화
const app = express();

//CORS 미들웨어 설정
app.use(cors({
  origin: 'http://localhost:3000', //요청 허용할 프론트엔드 주소
  credentials: true                //(선택) 쿠키 인증을 사용하는 경우 true
}));

//요청 body를 JSON으로 파싱
app.use(express.json());


//회원가입 API
//요청: POST /api/register
//body: { email, password }
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    //비밀번호를 해시 (saltRounds = 10)
    const hash = await bcrypt.hash(password, 10);

    //PostgreSQL의 users 테이블에 저장
    await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3)',
      [name, email, hash]
    );

    //성공 응답
    res.status(201).send({ message: '회원가입 성공!' });

  } catch (err) {
    //에러 처리 (예: 중복 이메일)
    console.error(err);
    res.status(500).send({
      message: '회원가입 실패',
      error: err.detail
    });
  }
});

//로그인 + JWT 발급 API
//요청: POST /api/login
//body: { email, password }
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    //이메일로 DB에서 사용자 조회
    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    const user = userResult.rows[0];

    //사용자 없을 경우
    if (!user) {
      return res.status(401).send({ message: '존재하지 않는 사용자입니다.' });
    }

    //입력된 비밀번호와 해시된 비밀번호 비교
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).send({ message: '비밀번호가 일치하지 않습니다.' });
    }

    //JWT 토큰 발급 (유효시간: 1시간)
    const token = jwt.sign(
      { id: user.id, email: user.email },    // payload
      process.env.JWT_SECRET,                // 서명 키
      { expiresIn: '1h' }                    // 옵션
    );

    //토큰과 메시지 응답
    res.send({ message: '로그인 성공!', token, name: user.name });

  } catch (err) {
    //로그인 중 오류 처리
    console.error(err);
    res.status(500).send({ message: '로그인 중 오류 발생' });
  }
});


//토큰 인증 미들웨어
//인증이 필요한 API에서 사용
const authenticate = (req, res, next) => {
  const auth = req.headers.authorization; // "Bearer <토큰>" 형식
  if (!auth) return res.status(401).send({ message: '토큰이 없습니다' });

  const token = auth.split(' ')[1]; // 토큰만 추출
  try {
    //토큰 유효성 검증
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  //사용자 정보 요청 객체에 주입
    next();              //다음 미들웨어/핸들러로 이동
  } catch {
    return res.status(403).send({ message: '유효하지 않은 토큰입니다' });
  }
};


//인증된 사용자 전용 API
//요청: GET /api/me
//헤더: Authorization: Bearer_JWT 토큰
app.get('/api/me', authenticate, (req, res) => {
  //미들웨어를 통과한 사용자만 응답
  res.send({
    message: '인증된 사용자입니다',
    user: req.user  // JWT에서 추출한 id, email
  });
});


//서버 실행
app.listen(4000, () => {
  console.log('서버 실행 중: http://localhost:4000');
});