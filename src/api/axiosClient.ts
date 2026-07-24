import axios from 'axios';

// 전용 Axios 인스턴스 생성
const axiosClient = axios.create({

    baseURL: process.env.REACT_APP_API_URL,
    timeout: 5000, // (선택) 5초 이상 응답이 없으면 에러 처리
    headers: {
        'Content-Type': 'application/json',
    },

});



export default axiosClient;