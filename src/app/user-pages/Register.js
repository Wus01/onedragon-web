import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import TestImage from "../../assets/images/temp.jpg";

function Register() {
    const history = useHistory();

    const [id, setId] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [agree, setAgree] = useState(false);

    const registerCheck = (e) => {
        e.preventDefault();

        if (!id || !email || !password || !confirm) {
            alert("모든 정보를 입력해주세요.");
            return;
        }

        if (password !== confirm) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        if (!agree) {
            alert("약관에 동의해주세요.");
            return;
        }

        alert("회원가입이 완료되었습니다.");
        history.push("/dashboard");
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
                                    type="id"
                                    className="form-control form-control-lg"
                                    placeholder="아이디 입력"
                                    value={id}
                                    onChange={(e) => setId(e.target.value)}
                                />
                            </div><div className="form-group">
                                <input
                                    type="email"
                                    className="form-control form-control-lg"
                                    placeholder="이메일 입력"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="password"
                                    className="form-control form-control-lg"
                                    placeholder="비밀번호 입력"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
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
                                            checked={agree}
                                            onChange={(e) => setAgree(e.target.checked)}
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
