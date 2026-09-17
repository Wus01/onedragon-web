import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import DragonMascot from '../../assets/images/dragon-mascot-v2.png';
import { goLoginApi } from '../../api/loginApi';
import { useAuth } from '../shared/AuthContext';

const Login: React.FC = () => {
  const history = useHistory();
  const { login } = useAuth();
  const [userId, setUserId] = useState('');
  const [userPwd, setUserPwd] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
  }, []);

  const onLogin = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (isLoggingIn) return;

    if (!userId || !userPwd) {
      alert('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    setIsLoggingIn(true);

    try {
      const response = await goLoginApi({ userId, userPwd });

      if (response.token) {
        login(userId, response.token);
        history.push('/mypageHome');
      }
    } catch (error: any) {
      let errorMessage = '로그인에 실패했습니다.';

      if (error.response) {
        const status = error.response.status;
        if (status === 400 || status === 401 || status === 403) {
          errorMessage = '아이디 또는 비밀번호를 잘못 입력하셨습니다.';
        } else if (status >= 500) {
          errorMessage = '서버에 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.';
        }
      } else if (error.request) {
        errorMessage = '서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.';
      }

      alert(errorMessage);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <main className="auth onedragon-auth">
      <div className="onedragon-auth-shell">
        <section className="auth-visual" aria-label="일용이네 서비스 소개">
          <div className="auth-brand">
            <span className="auth-brand-mark"><i className="mdi mdi-briefcase-check-outline" /></span>
            <div>
              <strong>일용이네</strong>
              <small>동네 일자리 매칭</small>
            </div>
          </div>

          <div className="auth-visual-copy">
            <span className="auth-kicker">WORK NEARBY, LIVE BETTER</span>
            <h1>내 생활 가까이에서<br />딱 맞는 일을 만나요.</h1>
            <p>복잡한 과정 없이 공고를 찾고, 지원하고,<br className="d-none d-md-block" /> 경력까지 한곳에서 관리하세요.</p>
          </div>

          <div className="auth-mascot-frame">
            <img src={DragonMascot} alt="일자리 가방을 들고 손을 흔드는 일용이네 아기 용 캐릭터" />
            <span className="auth-floating-chip auth-floating-chip--top">
              <i className="mdi mdi-map-marker-radius-outline" /> 우리 동네 공고
            </span>
            <span className="auth-floating-chip auth-floating-chip--bottom">
              <i className="mdi mdi-check-decagram-outline" /> 간편한 지원 관리
            </span>
          </div>
        </section>

        <section className="auth-panel">
          <div className="auth-mobile-brand">
            <span className="auth-brand-mark"><i className="mdi mdi-briefcase-check-outline" /></span>
            <strong>일용이네</strong>
          </div>

          <div className="auth-panel-copy">
            <span className="auth-eyebrow">WELCOME BACK</span>
            <h2>다시 만나서 반가워요</h2>
            <p>로그인하고 오늘 올라온 일자리를 확인해 보세요.</p>
          </div>

          <Form className="auth-form" onSubmit={onLogin}>
            <Form.Group>
              <Form.Label htmlFor="login-user-id">아이디</Form.Label>
              <div className="auth-input-wrap">
                <i className="mdi mdi-account-outline" aria-hidden="true" />
                <Form.Control
                  id="login-user-id"
                  type="text"
                  placeholder="아이디를 입력해 주세요"
                  autoComplete="username"
                  value={userId}
                  onChange={(event) => setUserId(event.target.value)}
                />
              </div>
            </Form.Group>

            <Form.Group>
              <div className="d-flex justify-content-between align-items-center">
                <Form.Label htmlFor="login-password">비밀번호</Form.Label>
                <Link to="/findIdPw?type=pw" className="auth-inline-link">비밀번호 찾기</Link>
              </div>
              <div className="auth-input-wrap">
                <i className="mdi mdi-lock-outline" aria-hidden="true" />
                <Form.Control
                  id="login-password"
                  type="password"
                  placeholder="비밀번호를 입력해 주세요"
                  autoComplete="current-password"
                  value={userPwd}
                  onChange={(event) => setUserPwd(event.target.value)}
                />
              </div>
            </Form.Group>

            <button className="btn btn-primary auth-submit" type="submit" disabled={isLoggingIn}>
              {isLoggingIn ? (
                <><span className="auth-button-spinner" /> 로그인 중...</>
              ) : (
                <>로그인 <i className="mdi mdi-arrow-right" aria-hidden="true" /></>
              )}
            </button>
          </Form>

          <div className="auth-divider"><span>처음 방문하셨나요?</span></div>

          <Link to="/register" className="btn auth-register-link">무료로 회원가입</Link>

          <div className="auth-help-links">
            <Link to="/findIdPw?type=id">아이디 찾기</Link>
            <span />
            <p>가입과 이용은 무료예요.</p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Login;
