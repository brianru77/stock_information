import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function MyPage({ user, setUser }) {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyInfo = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://localhost:4000/api/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEmail(res.data.user.email);
      } catch (err) {
        alert('사용자 정보를 불러오지 못했습니다.');
      }
    };

    fetchMyInfo();
  }, []);

  const handleDeleteAccount = async () => {
    if (!window.confirm('정말로 회원 탈퇴하시겠습니까?')) return;

    const token = localStorage.getItem('token');
    try {
      await axios.delete('http://localhost:4000/api/user', {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('회원 탈퇴가 완료되었습니다.');
      localStorage.removeItem('token');
      localStorage.removeItem('name');
      setUser(null);
      navigate('/');
    } catch (err) {
      alert('회원 탈퇴 실패: ' + (err.response?.data?.message || '오류 발생'));
    }
  };

  return (
    <div style={{ padding: '40px' }}>
      <h2>내 정보</h2>
      <p><strong>이름:</strong> {user?.name}</p>
      <p><strong>이메일:</strong> {email}</p>
      <button onClick={handleDeleteAccount} style={{ color: 'red' }}>
        회원 탈퇴
      </button>
    </div>
  );
}