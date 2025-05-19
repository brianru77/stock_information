import React from 'react';

const recommendedStocks = [
  { name: '삼성전자', 추천강도: '강력추천' },
  { name: 'NAVER', 추천강도: '추천' },
  { name: '현대차', 추천강도: '관심필요' },
];

function TodayRecommend() {
  return (
    <div style={styles.page}>
      <h2 style={styles.title}>오늘의 추천 종목</h2>
      <ul style={styles.list}>
        {recommendedStocks.map((stock, index) => (
          <li key={index} style={styles.item}>
            <span style={styles.name}>🏆 {stock.name}</span>
            <span style={styles.level}>{stock.추천강도}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  page: {
    padding: '40px',
    backgroundColor: '#fdfdfd',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    textAlign: 'center',
    marginBottom: '32px',
    fontSize: '24px',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    maxWidth: '600px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    padding: '16px',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
  },
  name: {
    fontWeight: 'bold',
  },
  level: {
    color: '#555',
  },
};

export default TodayRecommend;