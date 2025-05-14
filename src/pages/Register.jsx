import React, { useState } from 'react';
import axios from 'axios';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/api/register', form);
      alert('회원가입 성공!');
    } catch (err) {
      alert('회원가입 실패: ' + err.response?.data?.message || '오류 발생');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="이름" onChange={handleChange} required />
      <input name="email" type="email" placeholder="이메일" onChange={handleChange} required />
      <input name="password" type="password" placeholder="비밀번호" onChange={handleChange} required />
      <button type="submit">회원가입</button>
    </form>
  );
}