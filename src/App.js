import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Home from './pages/Home.jsx';     // 금/은 시세 화면
import Login from './pages/Login.jsx';   // 로그인 화면
import Register from './pages/Register.jsx'; // 회원가입 화면

function App() {
  return (
    <Router>
      {/* 상단 중앙에 로고 이미지 */}
      <div style={{
        backgroundColor: '#fff3da',    
        padding: '16px 0',
        textAlign: 'center',
        borderBottom: '1px solid #ddd'
      }}>
        <Link to="/">
          <img
            src="/images/Back.png"
            alt="brianru페이지"
            style={{ height: '60px' }}
          />
        </Link>
      </div>

      {/* 오른쪽 정렬된 네비게이션 메뉴 */}
      <nav className="navbar">
        <Link to="/login">로그인</Link>
        <Link to="/register">회원가입</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;