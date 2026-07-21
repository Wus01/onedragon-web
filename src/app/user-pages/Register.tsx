import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import TestImage from "../../assets/images/temp.jpg";
import { TERMS_DATA } from "./TermsData";

function Register() {
    const history = useHistory();

    const [userNm, setUserNm] = useState("");
    const [userId, setUserId] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userPwd, setUserPwd] = useState("");
    const [confirm, setConfirm] = useState("");
    const [agreementTerms, setAgreementTerms] = useState(false);
    const [userPhoneNm, setUserPhoneNm] = useState("");

    // 약관 텍스트 창 표시 여부 상태
    const [showTerms, setShowTerms] = useState(false);

    // 약관 읽기 버튼 핸들러
    const toggleTerms = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
        e.preventDefault();
        setShowTerms(!showTerms);
    };

    const registerCheck = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        if (!userNm || !userId || !userEmail || !userPwd || !confirm || !userPhoneNm) {
            alert("모든 정보를 입력해주세요.");
            return;
        }

        if (userPwd !== confirm) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        if (!agreementTerms) {
            alert("약관에 동의해주세요.");
            return;
        }

        const payload = {
            userNm,
            userId,
            userEmail,
            userPwd,
            agreementTerms,
            userPhoneNm
        };

        try {
//            const res = await fetch("/api/userInfo/signup", {//절대 경로 통일을 위해 주석처리(26/07/08)
                const res = await fetch(`${process.env.REACT_APP_API_URL}/userInfo/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const raw = await res.text();
            let body;
            try {
                body = raw ? JSON.parse(raw) : null;
            } catch (jsonErr) {
                if (process.env.NODE_ENV === "development") {
                    console.groupCollapsed("[SIGNUP] 응답");
                    console.log("status:", res.status, res.statusText);
                    console.groupEnd();
                }
                body = raw || null;
            }

            if (res.ok) {
                alert("회원가입이 완료되었습니다.");
                history.push("/login");
            } else {
                const msg = (body && (body.message || body.error || body.detail)) || "회원가입 실패";
                alert(msg);
            }
        } catch (err) {
            console.error("[회원가입 요청 오류]", err);
            alert("서버와 통신 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        }
    };

    return (
        <div className="d-flex align-items-center auth px-0">
            <div className="row w-100 mx-0">
                <div className="col-lg-4 mx-auto">
                    <div className="auth-form-light text-left py-5 px-4 px-sm-5">
                        <div className="brand-logo">
                            <img src={TestImage} alt="로고" width="150" height="150" />
                        </div>
                        <h4>회원가입</h4>
                        <form className="pt-3" onSubmit={registerCheck}>
                            {/* 기존 인풋들 생략 (이름, 아이디, 이메일, 비번, 핸드폰번호) */}
                            <div className="form-group">
                                <input type="text" className="form-control form-control-lg" placeholder="이름 입력" value={userNm} onChange={(e) => setUserNm(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <input type="text" className="form-control form-control-lg" placeholder="아이디 입력" value={userId} onChange={(e) => setUserId(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <input type="email" className="form-control form-control-lg" placeholder="이메일 입력" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <input type="password" className="form-control form-control-lg" placeholder="비밀번호 입력" value={userPwd} onChange={(e) => setUserPwd(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <input type="password" className="form-control form-control-lg" placeholder="비밀번호 확인" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <input type="text" className="form-control form-control-lg" placeholder="핸드폰번호 입력" value={userPhoneNm} onChange={(e) => setUserPhoneNm(e.target.value)} />
                            </div>

                            {/* 약관 동의 및 내용 보기 영역 */}
                            <div className="mb-4">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="form-check">
                                        <label className="form-check-label text-muted">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                checked={agreementTerms}
                                                onChange={(e) => setAgreementTerms(e.target.checked)}
                                            />
                                            <i className="input-helper"></i> 약관 동의
                                        </label>
                                    </div>
                                    <button
                                        onClick={toggleTerms}
                                        className="btn btn-link p-0"
                                        style={{fontSize: '12px', textDecoration: 'none'}}
                                    >
                                        {showTerms ? "닫기" : "내용보기"}
                                    </button>
                                </div>

                                {showTerms && (
                                    <div className="mt-2 p-3 border rounded bg-light" style={{ maxHeight: '200px', overflowY: 'auto', fontSize: '12px', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>

                                        {/* 1. 이용약관 출력 */}
                                        <div className="mb-4">
                                            <h6 style={{ fontSize: '13px', fontWeight: 'bold' }}>{TERMS_DATA.service.title}</h6>
                                            <div className="text-muted">{TERMS_DATA.service.content}</div>
                                        </div>

                                        <hr />

                                        {/* 2. 개인정보 처리방침 출력 */}
                                        <div>
                                            <h6 style={{ fontSize: '13px', fontWeight: 'bold' }}>{TERMS_DATA.privacy.title}</h6>
                                            <div className="text-muted">{TERMS_DATA.privacy.content}</div>
                                        </div>

                                    </div>
                                )}
                            </div>

                            <div className="mt-3">
                                <button type="submit" className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn">
                                    가입하기
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;