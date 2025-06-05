import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/api/register', form);
      alert('회원가입 성공!');
      navigate('/login'); // 회원가입 후 로그인으로 이동
    } catch (err) {
      alert('회원가입 실패: ' + (err.response?.data?.message || '오류 발생'));
    }
  };
  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '80vh', // 세로 중앙
      backgroundColor: '#fff3da'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      width: '300px',
      padding: '24px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9',
    },
  };

  return (
  <div style={styles.container}>
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2>회원가입</h2>
      <input
        name="name"
        placeholder="이름"
        value={form.name}
        onChange={handleChange}
        required
      />
      <input
        name="email"
        type="email"
        placeholder="이메일"
        value={form.email}
        onChange={handleChange}
        required
      />
      <input
        name="password"
        type="password"
        placeholder="비밀번호"
        value={form.password}
        onChange={handleChange}
        required
      />
      <button type="submit">회원가입</button>
    </form>
  </div>
);
}