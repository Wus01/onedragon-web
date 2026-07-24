import React from 'react';
import {useHistory} from 'react-router-dom';

interface ErrorPageProps {
    location?: {
        state?: {
            statusCode?: number;
            title?: string;
            message?: string;
        }
    };
    history?: any;
}

const ErrorPage = ({ location, history }: ErrorPageProps) => {
    const errorState = location.state || {};
    const statusCode = errorState.statusCode || 404;
    const title = errorState.title || "페이지를 찾을 수 없습니다";
    const message = errorState.message || "존재하지 않는 주소를 입력하셨거나,\\n요청하신 페이지의 주소가 변경, 삭제되어 찾을 수 없습니다.";

        
    
    return (
        // 💡 min-vh-100과 d-flex를 조합해 화면 정중앙에 에러 메시지를 배치합니다.
        <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light px-3 text-center pt-5">

            {/* 💡 에러 아이콘 (부트스트랩 아이콘) */}
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="bi bi-exclamation-triangle text-warning mb-4" viewBox="0 0 16 16">
                <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/>
                <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z"/>
            </svg>

            <h1 className="display-3 fw-bold text-dark mb-2">{statusCode}</h1>
            <h2 className="fs-5 fw-bold text-dark mb-3">{title}</h2>

            {/* 💡 whiteSpace: 'pre-line'을 주면 \n 줄바꿈이 정상적으로 화면에 나타납니다. */}
            <p className="text-muted mb-4 pb-2" style={{ whiteSpace: 'pre-line', fontSize: '0.9rem', lineHeight: '1.6' }}>
                {message}
            </p>

            <div className="d-flex gap-2">
                <button
                    className="btn btn-outline-secondary px-4 py-2"
                    style={{ fontSize: '0.9rem' }}
                    onClick={() => history.push(-1)} // 이전 페이지로 이동
                >
                    이전으로
                </button>
                <button
                    className="btn btn-primary px-4 py-2"
                    style={{ fontSize: '0.9rem' }}
                    onClick={() => history.push('/mypageHome')} // 메인 홈으로 이동
                >
                    홈으로 가기

                </button>
            </div>
        </div>
    );
};

export default ErrorPage;