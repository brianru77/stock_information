// src/pages/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:4000/api/login', form);
      localStorage.setItem('token', res.data.token);
      alert('로그인 성공!');
    } catch (err) {
      alert('로그인 실패: ' + err.response?.data?.message || '오류 발생');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>로그인</h2>
      <input name="email" onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" />
      <input type="password" name="password" onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" />
      <button type="submit">로그인</button>
    </form>
  );
}