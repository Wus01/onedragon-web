import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import TestImage from "../../assets/images/temp.jpg";

function Register() {
    const history = useHistory();

    const [userNm, setUserNm] = useState("");
    const [userId, setUserId] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userPwd, setUserPwd] = useState("");
    const [confirm, setConfirm] = useState("");
    const [agreementTerms, setAgreementTerms] = useState(false);

    const registerCheck = async (e) => {
        e.preventDefault();

        if (!userNm || !userId || !userEmail || !userPwd || !confirm) {
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

        // 백엔드로 보낼 데이터 묶음 세팅
        const payload = {
            userNm,
            userId,
            userEmail,
            userPwd,
            agreementTerms
        };

        try {
            // 백엔드 호출
            const res = await fetch("/api/userInfo/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            // 응답 파싱
            const raw = await res.text();
            let body;
            try {
                body = raw ? JSON.parse(raw) : null;
            } catch (e) {
                /**
                 * npm start 로컬 개발환경일 경우에만
                 * npm run build 배포 후에는 안 보이게
                 */
                if (process.env.NODE_ENV === "development") {
                    console.groupCollapsed("[SIGNUP] 응답");
                    console.log("status:", res.status, res.statusText);
                    console.log("ok:", res.ok);
                    console.log("body(raw):", raw);
                    console.log("body(parsed):", body);
                    console.groupEnd();
                }
                body = raw || null;
            }

            // 성공/실패 분기
            if (res.ok) {
                alert("회원가입이 완료되었습니다.");
                history.push("/dashboard");
            } else {
                const msg = (body && (body.message || body.error || body.detail)) || "회원가입 실패";
                alert(msg);
            }
        } catch (err) {
            console.error("[회원가입 요청 오류]", err);

            // 네트워크 단절, 서버 다운, CORS 오류 등 res 자체가 안 왔을 때
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
                            <div className="form-group">
                                <input
                                    type="text"
                                    className="form-control form-control-lg"
                                    placeholder="이름 입력"
                                    value={userNm}
                                    onChange={(e) => setUserNm(e.target.value)}
                                />
                            </div><div className="form-group">
                                <input
                                    type="text"
                                    className="form-control form-control-lg"
                                    placeholder="아이디 입력"
                                    value={userId}
                                    onChange={(e) => setUserId(e.target.value)}
                                />
                            </div><div className="form-group">
                                <input
                                    type="email"
                                    className="form-control form-control-lg"
                                    placeholder="이메일 입력"
                                    value={userEmail}
                                    onChange={(e) => setUserEmail(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="password"
                                    className="form-control form-control-lg"
                                    placeholder="비밀번호 입력"
                                    value={userPwd}
                                    onChange={(e) => setUserPwd(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="password"
                                    className="form-control form-control-lg"
                                    placeholder="비밀번호 확인"
                                    value={confirm}
                                    onChange={(e) => setConfirm(e.target.value)}
                                />
                            </div>
                            <div className="mb-4">
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
                            </div>
                            <div className="mt-3">
                                <button
                                    type="submit"
                                    className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                                >
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
