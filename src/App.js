import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home.jsx';     // 금/은 시세 화면
import Login from './pages/Login.jsx';   // 로그인 화면
import Register from './pages/Register.jsx'; // 회원가입 화면
import TodayRecommend from './pages/TodayRecommend.jsx'; //오늘의 추천 종목
import News from './pages/News.jsx'; //새로운 뉴스 소식
import MyPage from './pages/MyPage.jsx'; //내정보> 회원탈퇴

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const name = localStorage.getItem('name');
    if (name) setUser({ name });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    setUser(null);
  };

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
      {/* 상단 메뉴바 - 왼쪽과 오른쪽 정렬 */}
      <div className="topbar">
        <div className="left-menu">
          <Link to="/today_recommend">오늘의 추천 종목</Link>
          <Link to="/news"> AP|Reuters 금리&정책 소식</Link>
        </div>
        <div className="right-menu">
          {user ? (
            <>
              <span>{user.name}님</span>
              <button onClick={handleLogout} style={{ marginLeft: '10px' }}>로그아웃</button>
            </>
          ) : (
            <>
              <Link to="/login">로그인</Link>
              <Link to="/register">회원가입</Link>
            </>
          )}
          {user && (
            <>
              <Link to="/mypage">내 정보</Link>
            </>
          )}
        </div>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/today_recommend" element={<TodayRecommend />} />
        <Route path="/news" element={<News />} />
        <Route path="/mypage" element={<MyPage user={user} setUser={setUser} />} />
      </Routes>
    </Router>
  );
}

export default App;