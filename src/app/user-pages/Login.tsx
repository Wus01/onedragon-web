import React, {useEffect, useState} from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import TestImage from "../../assets/images/temp.jpg";
import {useAuth} from "../shared/AuthContext";
import {goLoginApi} from "../../api/loginApi";

const Login = () => {
    const history = useHistory();

    const [userId, setUserId] = useState("");
    const [userPwd, setUserPwd] = useState("");
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const { login } = useAuth();

    useEffect(() => {
        // 로컬스트리지 초기화
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
    }, []);

    const onLogin = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        if(isLoggingIn){
            alert("로그인 처리 중입니다. 잠시만 기다려주세요.");
            return;
        }

        if (!userId || !userPwd) {
            alert("아이디와 비밀번호를 입력해주세요.");
            return;
        }

        setIsLoggingIn(true);

        try {
            const payload = {
                userId,
                userPwd
            };

            const res = await goLoginApi(payload);
            // 서버에서 JWT 발급한다고 가정
            if (res.token) {
                login(userId, res.token);
                alert("로그인 성공!");
                history.push("/mypageHome");
            }

        } catch (err: any) {
            console.error("로그인 에러: ", err);
            let errorMessage = "로그인에 실패했습니다.";

            if (err.response) {
                const status = err.response.status;

                if (status === 401 || status === 400 || status === 403) {
                    errorMessage = "아이디 또는 비밀번호를 잘못 입력하셨습니다.";

                } else if (status >= 500) {
                    errorMessage = "서버에 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.";
                }
            } else if (err.request) {
                // 서버에 요청은 갔으나 응답을 받지 못한 경우 (네트워크 오류, 서버 다운 등)
                errorMessage = "서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.";
            }

            alert(errorMessage);
        } finally {
            setIsLoggingIn(false);
        }
    };

    return (
        <div>
            <div className="d-flex align-items-center auth px-0">
                <div className="row w-100 mx-0">
                    <div className="col-lg-4 mx-auto">
                        <div className="auth-form-light text-left py-5 px-4 px-sm-5">
                            <div className="brand-logo" style={{}}>
                                <img src={TestImage} alt="" width="150px" height="150px" className="d-block mx-auto"/>
                            </div>

                            <h4 className="text-center">일용이네</h4>

                            <Form className="pt-3" onSubmit={onLogin}>
                                <Form.Group className="d-flex search-field">
                                    <Form.Control
                                        type="text"
                                        placeholder="아이디"
                                        size="lg"
                                        className="h-auto"
                                        value={userId}
                                        onChange={(e) => setUserId(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="d-flex search-field">
                                    <Form.Control
                                        type="password"
                                        placeholder="비밀번호"
                                        size="lg"
                                        className="h-auto"
                                        value={userPwd}
                                        onChange={(e) => setUserPwd(e.target.value)}
                                    />
                                </Form.Group>

                                <div className="mt-3">
                                    <button
                                        className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                                        type="submit"
                                    >
                                        로그인
                                    </button>
                                </div>

                                <div className="my-2 d-flex justify-content-between align-items-center">
                                    <Link to="/register" className="auth-link text-black">회원가입</Link>
                                    <Link to="/findIdPw?type=id" className="auth-link text-black">아이디 찾기</Link>
                                    <Link to="findIdPw?type=pw" className="auth-link text-black">비밀번호 찾기</Link>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
