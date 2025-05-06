// function ExchangeRatesOnly() {
//     const [exchangeRates, setExchangeRates] = useState({});
//     const [loading, setLoading] = useState(true);
  
//     const fetchExchangeRates = async () => {
//       try {
//         const res = await axios.get(
//           'https://v6.exchangerate-api.com/v6/EXCHANGE_RATES/latest/KRW'
//         );
//         const { USD, JPY, CHF } = res.data.conversion_rates;
//         setExchangeRates({ USD, JPY, CHF });
//       } catch (error) {
//         console.error('환율 가져오기 실패:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     useEffect(() => {
//       fetchExchangeRates();
//     }, []);
  
//     const format = (v) =>
//       v?.toLocaleString('ko-KR', {
//         minimumFractionDigits: 2,
//         maximumFractionDigits: 2,
//       });
//       return (
//         <div>
//           <h2>🌐 환율 정보 (1 단위당 원화)</h2>
//           {loading ? (
//             <p>로딩 중...</p>
//           ) : (
//             <ul>
//               <li>🇺🇸 USD: {format(1 / exchangeRates.USD)} 원</li>
//               <li>🇯🇵 JPY: {format(1 / exchangeRates.JPY)} 원</li>
//               <li>🇨🇭 CHF: {format(1 / exchangeRates.CHF)} 원</li>
//             </ul>
//           )}
//         </div>
//       );
//     }