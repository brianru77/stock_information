import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login({ setUser }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:4000/api/login', form);
      console.log('📦 로그인 응답:', res.data); 
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('name', res.data.name);
      setUser({ name: res.data.name });
      alert('로그인 성공!');
      navigate('/');
    } catch (err) {
      alert('로그인 실패: ' + (err.response?.data?.message || '오류 발생'));
    }
  };
  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '80vh', // 화면 세로 중앙
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
        <h2>로그인</h2>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="Email"
          required
        />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="Password"
          required
        />
        <button type="submit">로그인</button>
      </form>
    </div>
  );
}