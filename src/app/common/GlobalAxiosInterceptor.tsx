import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import axiosClient from "../../api/axiosClient";

const GlobalAxiosInterceptor = ({ children }: { children: React.ReactNode }) => {
    const history = useHistory();

    useEffect(() => {
        // 응답(Response)을 가로채는 인터셉터 설정
        const interceptor = axiosClient.interceptors.response.use(
            (response) => {
                return response;
            },
            (error) => {
                const status = error.response?.status;

                if (status >= 500) {
                    history.push({
                        pathname: '/error',
                        state: {
                            statusCode: status,
                            title: "서버 통신 오류",
                            message: "서버에서 문제가 발생했습니다.\n잠시 후 다시 시도해주세요."
                        }
                    });
                } else if (status === 401) {
                    history.push({
                        pathname: '/error',
                        state: {
                            statusCode: 401,
                            title: "인증 만료",
                            message: "로그인이 풀렸거나 인증이 필요한 서비스입니다.\n다시 로그인해 주세요."
                        }
                    });
                } else if (status === 403) {
                    history.push({
                        pathname: '/error',
                        state: {
                            statusCode: 403,
                            title: "접근 권한 없음",
                            message: "해당 메뉴를 열람하거나 실행할 수 있는 권한이 없습니다."
                        }
                    });
                }

                // 나머지 에러는 컴포넌트의 catch로 넘겨줌
                return Promise.reject(error);
            }
        );

        // 컴포넌트가 언마운트될 때 인터셉터 해제 (메모리 누수 방지)
        return () => {
            axiosClient.interceptors.response.eject(interceptor);
        };
    }, [history]);

    return <>{children}</>;
};

export default GlobalAxiosInterceptor;