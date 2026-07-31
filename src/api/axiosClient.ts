import axios from 'axios';

// 전용 Axios 인스턴스 생성
const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    timeout: 5000, // (선택) 5초 이상 응답이 없으면 에러 처리
    headers: {
        'Content-Type': 'application/json',
    },

});


// 요청 인터셉터
axiosClient.interceptors.request.use(
    (config) => {
        // 1. 로컬 스토리지(또는 쿠키)에서 로그인할 때 저장해둔 토큰을 꺼냅니다.
        const token = localStorage.getItem('token'); // 저장하신 키 이름에 맞게 수정!

        // 2. 토큰이 존재하면, 모든 요청의 헤더에 알아서 Authorization을 붙여줍니다.
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 💡 백엔드 응답을 가로채는 응답(response) 인터셉터
axiosClient.interceptors.response.use(
    (response) => {
        // 응답이 정상적으로 잘 왔을 때는 건드리지 않고 그대로 패스!
        return response;
    },
    (error) => {
        // 에러가 발생했을 때 이곳을 탑니다.

        // 1. 에러 응답이 존재하고, 상태 코드가 401(권한 없음/만료)인 경우
        if (error.response && error.response.status === 401) {

            // 2. 쓸모없어진 만료된 토큰을 스토리지에서 깨끗하게 지워줍니다.
            localStorage.removeItem('accessToken'); // ⚠️ 쓰시는 키 이름으로 변경!

            // 3. (선택사항) 사용자에게 상황 알림
            alert('로그인 시간이 만료되었습니다. 다시 로그인해 주세요 🥲');

            // 4. 로그인 페이지로 강제 이동! (쫓아내기)
            // ⚠️ React Router의 useNavigate는 여기서 못 쓰기 때문에 window.location 사용
            window.location.href = '/login'; // ⚠️ 프로젝트의 실제 로그인 페이지 경로로 변경!
        }

        // 401 에러가 아닌 다른 에러들은 원래대로 던져서 화면에서 처리하게 둡니다.
        return Promise.reject(error);
    }
);


export default axiosClient;