import React, { useState, useEffect } from 'react';
// 아이콘: 부트스트랩 환경이지만, 아이콘을 위해 react-icons는 유지
import { FaUserCircle, FaChevronRight } from 'react-icons/fa';
// axios import는 실제 API 연결 시 필요합니다.
// import axios from 'axios';

// 1. 화면 표시를 위한 더미 데이터 정의
const mockProfileData = {
    name: "홍길동",
    phone: "010-1234-5678",
    email: "abc123@gmail.com",
    profileImageUrl: null,
    applicationCount: 13,
};

const mockApplicationData = [
    { id: 1, status: "지원완료", title: "석호중앙점 주말 오전 알바구합니다.", company: "석호중앙점" },
    { id: 2, status: "서류검토중", title: "(급)내일 야간 1일 구함", company: "고잔점" },
    { id: 3, status: "면접제의", title: "평일 오전 2시간만 봐주실분", company: "사동점" },
    { id: 4, status: "최종합격", title: "평일 오후 4시부터 6시까지", company: "본오점" },
];

// 2. 지원 현황 카드 컴포넌트 (부트스트랩 스타일 적용)
const ApplicationCard = ({ application }) => {
    // 상태별 스타일 정의 (부트스트랩 뱃지 클래스 사용)
    let statusClass = 'bg-primary'; // 지원완료
    if (application.status === '서류검토중') statusClass = 'bg-secondary';
    if (application.status === '면접제의') statusClass = 'bg-warning text-dark';
    if (application.status === '최종합격') statusClass = 'bg-success';

    return (
        <div className="card shadow-sm p-3 me-3" style={{ width: '250px' }}>
            {/* 상태 뱃지 */}
            <span className={`badge ${statusClass} rounded-pill mb-3`} style={{ width: 'fit-content' }}>
                {application.status}
            </span>
            {/* 내용 */}
            <h4 className="card-title fs-5 mb-1 text-truncate">{application.title}</h4>
            <p className="card-text text-muted text-sm text-truncate">{application.company}</p>
            <div className="mt-3 text-end">
                <a href="#" className="btn btn-link btn-sm p-0 text-decoration-none">
                    상세보기
                </a>
            </div>
        </div>
    );
};


// 3. 메인 컴포넌트 (부트스트랩 스타일 적용)
const MyPageHome = () => {
    const [profile, setProfile] = useState(mockProfileData);
    const [applications, setApplications] = useState(mockApplicationData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // DB 연결이 안 되었으므로 로딩/API 호출 로직은 주석 처리
    /* useEffect(() => { ... API Logic ... }, []); */

    if (loading) {
        return <div className="p-4 text-center text-secondary">데이터 로딩 중...</div>;
    }

    if (error) {
        return <div className="p-4 text-center text-danger">에러: {error}</div>;
    }

    return (
        <div className="container-fluid py-4 bg-light min-vh-100">
            <h1 className="fs-4 fw-bold text-dark mb-4 border-bottom pb-2"># 마이페이지홈</h1>

            {/* -------------------- 1. 프로필 조회 영역 -------------------- */}
            <div className="card shadow mb-4 p-4 border-0 rounded-3">
                <div className="d-flex align-items-center gap-4">
                    {/* 프로필 사진 */}
                    <div className="rounded-circle bg-light d-flex align-items-center justify-content-center text-secondary" style={{ width: '80px', height: '80px' }}>
                        {profile.profileImageUrl ? (
                            <img src={profile.profileImageUrl} alt="프로필" className="img-fluid rounded-circle" />
                        ) : (
                            <FaUserCircle size={48} />
                        )}
                    </div>

                    {/* 정보 */}
                    <div className="flex-grow-1">
                        {/* 이름 */}
                        <h2 className="fs-5 fw-bold mb-1">{profile.name}</h2>
                        {/* 핸드폰 번호 */}
                        <p className="text-muted mb-1">{profile.phone}</p>
                        {/* 이메일 */}
                        <p className="text-muted mb-0">{profile.email}</p>
                    </div>

                    {/* 수정 버튼 */}
                    <button className="btn btn-link text-primary text-decoration-none p-0">
                        프로필 수정 &gt;
                    </button>
                </div>
            </div>

            <h2 className="fs-5 fw-semibold text-secondary mb-3">
                지원 현황 <span className="text-primary ms-1">{profile.applicationCount}건</span>
            </h2>

            {/* -------------------- 2. 지원 현황 리스트 영역 -------------------- */}
            <div className="card shadow p-4 border-0 rounded-3">
                {/* overflow-auto를 사용하여 수평 스크롤 가능하게 함 */}
                <div className="d-flex overflow-auto pb-2">
                    {applications.map((application, index) => (
                        <React.Fragment key={application.id}>
                            <ApplicationCard application={application} />

                            {/* 흐름 화살표 */}
                            {index < applications.length - 1 && (
                                <div className="d-flex align-items-center text-muted mx-1 flex-shrink-0">
                                    <FaChevronRight size={20} />
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MyPageHome;