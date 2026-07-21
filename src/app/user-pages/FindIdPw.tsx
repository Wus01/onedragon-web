import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Form, Nav } from 'react-bootstrap';
import axios from 'axios';
import TestImage from "../../assets/images/temp.jpg";

const FindIdPw = () => {
    const [activeTab, setActiveTab] = useState("id");
    const location = useLocation();

    // 입력 필드 상태 관리
    const [userEmail, setUserEmail] = useState("");
    const [userId, setUserId] = useState("");

    const baseUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        // 주소창의 ?type=pw 부분을 분석
        const queryParams = new URLSearchParams(location.search);
        const type = queryParams.get('type');

        if (type) {
            setActiveTab(type); // 'id'면 아이디 탭, 'pw'면 비밀번호 탭 활성화
        }
    }, [location]); // URL이 바뀔 때마다 감지

    const onSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        try {
            if (activeTab === "id") {
                const res = await axios.post(`${baseUrl}/userInfo/findId`, { userEmail });

                // 서버 응답 성공 시 (아이디를 찾았을 때)
                if (res.data.success) {
                    // 알림창(팝업)으로 바로 보여주기
                    alert(`찾으시는 아이디는 [ ${res.data.userId} ] 입니다.`);
                }
            } else {
                const res = await axios.post(`${baseUrl}/userInfo/findPw`, { userEmail, userId });

                if (res.data.success) {
                    const tempPw = res.data.userPwd;

                    // 클립보드 복사 로직
                    navigator.clipboard.writeText(tempPw).then(() => {
                        alert(`임시 비밀번호가 발급되었습니다: [ ${tempPw} ]\n\n클립보드에 복사되었습니다. 바로 붙여넣기(Ctrl+V) 하세요!`);
                    }).catch(err => {
                        // 구형 브라우저 대응용
                        alert(`임시 비밀번호: [ ${tempPw} ] (복사에 실패했습니다. 직접 입력해주세요.)`);
                    });
                }
            }

        } catch (err) {
            // 에러 처리
            alert(err.response?.data?.message || "일치하는 정보가 없습니다.");
        }
    };

    return (
        <div>
            <div className="d-flex align-items-center auth px-0">
                <div className="row w-100 mx-0">
                    <div className="col-lg-4 mx-auto">
                        <div className="auth-form-light text-left py-5 px-4 px-sm-5">
                            <div className="brand-logo">
                                <img src={TestImage} alt="logo" width="150px" height="150px" />
                            </div>

                            <h4>{activeTab === "id" ? "아이디 찾기" : "비밀번호 찾기"}</h4>
                            <p className="font-weight-light">등록된 이메일 주소를 입력해주세요.</p>

                            <Nav variant="tabs" activeKey={activeTab} className="mb-4">
                                <Nav.Item>
                                    <Nav.Link eventKey="id" onClick={() => setActiveTab("id")}>아이디 찾기</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="pw" onClick={() => setActiveTab("pw")}>비밀번호 찾기</Nav.Link>
                                </Nav.Item>
                            </Nav>

                            <Form className="pt-3" onSubmit={onSubmit}>
                                {activeTab === "pw" && (
                                    <Form.Group className="mb-3">
                                        <Form.Control
                                            type="text"
                                            placeholder="아이디"
                                            size="lg"
                                            value={userId}
                                            onChange={(e) => setUserId(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                )}

                                <Form.Group className="mb-3">
                                    <Form.Control
                                        type="email"
                                        placeholder="등록된 이메일 계정"
                                        size="lg"
                                        value={userEmail}
                                        onChange={(e) => setUserEmail(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <div className="mt-3">
                                    <button
                                        className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                                        type="submit"
                                    >
                                        {activeTab === "id" ? "아이디 찾기" : "임시 비밀번호 발송"}
                                    </button>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FindIdPw;