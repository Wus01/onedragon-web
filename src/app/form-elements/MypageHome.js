import React, { useState, useEffect, useRef } from 'react';
import { FaUserCircle, FaChevronRight, FaChevronLeft } from 'react-icons/fa';

const STATUS_LABEL = {
    '01': '지원완료', '02': '서류검토중', '03': '면접제의',
    '04': '최종합격', '05': '불합격', '09': '지원취소'
};

const ApplicationCard = ({ application }) => (
    <div className="card shadow-sm p-3 border-0 rounded-3 application-card" style={{ minWidth: '250px' }}>
        <span className="badge bg-primary rounded-pill mb-3" style={{ width: 'fit-content' }}>
            {STATUS_LABEL[application.status] || '지원완료'}
        </span>
        <h4 className="card-title fs-6 mb-1 text-truncate" title={application.storeNm}>{application.storeNm}</h4>
        <p className="card-text text-muted small">지원일: {application.applyDate}</p>
        <div className="mt-2 text-end">
            <button className="btn btn-link btn-sm p-0 text-decoration-none">상세보기</button>
        </div>
    </div>
);

const MyPageHome = () => {
    const [profile, setProfile] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    // 드래그 상태 관리를 위한 변수
    const [isDrag, setIsDrag] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const API_BASE_URL = process.env.REACT_APP_API_URL;

    // 1. 마우스 드래그 시작
    const onDragStart = (e) => {
        e.preventDefault();
        setIsDrag(true);
        setStartX(e.pageX + scrollRef.current.scrollLeft);
    };

    // 2. 마우스 드래그 중
    const onDragMove = (e) => {
        if (!isDrag) return;
        const { scrollWidth, clientWidth } = scrollRef.current;

        scrollRef.current.scrollLeft = startX - e.pageX;

        if (scrollRef.current.scrollLeft <= 0) {
            setStartX(e.pageX);
        } else if (scrollRef.current.scrollLeft >= scrollWidth - clientWidth) {
            setStartX(e.pageX + scrollRef.current.scrollLeft);
        }
    };

    // 3. 마우스 드래그 종료
    const onDragEnd = () => {
        setIsDrag(false);
    };

    // 기존 버튼 클릭 이동 함수
    const handleScroll = (direction) => {
        if (scrollRef.current) {
            const moveDistance = 600;
            const currentScroll = scrollRef.current.scrollLeft;
            scrollRef.current.scrollTo({
                left: direction === 'left' ? currentScroll - moveDistance : currentScroll + moveDistance,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        const userId = localStorage.getItem('userId') || 'abc123';
        setLoading(true);
        fetch(`${API_BASE_URL}/mypage/${userId}`)
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    setProfile({
                        name: json.data.userInfo.userNm,
                        email: json.data.userInfo.userEmail,
                        count: json.data.applications.length
                    });
                    setApplications(json.data.applications);
                }
            })
            .finally(() => setLoading(false));
    }, [API_BASE_URL]);

    if (loading) return <div className="p-5 text-center">로딩 중...</div>;

    return (
        <div className="container-fluid p-0 m-0 bg-light min-vh-100">
            <div className="p-4" style={{ marginLeft: '10px' }}>
                <h1 className="fs-4 fw-bold mb-4">마이페이지</h1>

                <div className="card shadow-sm mb-5 p-4 border-0 rounded-3" style={{ maxWidth: '1000px' }}>
                    <div className="d-flex align-items-center gap-3">
                        <FaUserCircle size={60} className="text-primary opacity-75" />
                        <div>
                            <h2 className="fs-5 fw-bold mb-0">{profile?.name}님 <span className="ms-2 badge bg-info bg-opacity-10 text-primary fw-normal" style={{ fontSize: '12px' }}>개인회원</span></h2>
                            <p className="text-muted small mb-0">{profile?.email}</p>
                        </div>
                    </div>
                </div>

                <h3 className="fs-6 fw-bold text-secondary mb-3">최근 지원 현황</h3>

                <div className="position-relative d-flex align-items-center" style={{ maxWidth: '1100px' }}>
                    <button onClick={() => handleScroll('left')} className="btn-move-arrow me-2">
                        <FaChevronLeft size={22} />
                    </button>

                    {/* 드래그 이벤트 연결 */}
                    <div
                        ref={scrollRef}
                        className={`d-flex overflow-auto gap-3 pb-3 scroll-container ${isDrag ? 'is-dragging' : ''}`}
                        onMouseDown={onDragStart}
                        onMouseMove={onDragMove}
                        onMouseUp={onDragEnd}
                        onMouseLeave={onDragEnd}
                    >
                        {applications.map((app, index) => (
                            <div key={index} className="d-flex align-items-center scroll-item">
                                <ApplicationCard application={app} />
                                {index < applications.length - 1 && (
                                    <FaChevronRight className="ms-3 text-muted opacity-50" style={{ fontSize: '14px' }} />
                                )}
                            </div>
                        ))}
                    </div>

                    <button onClick={() => handleScroll('right')} className="btn-move-arrow ms-2">
                        <FaChevronRight size={22} />
                    </button>
                </div>
            </div>

            <style>{`
                .container-fluid { padding-left: 0 !important; }

                .scroll-container {
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                    cursor: grab;
                    scroll-snap-type: x mandatory; /* 드래그 후 딱 맞게 멈춤 */
                    user-select: none; /* 드래그 시 텍스트 선택 방지 */
                }
                .scroll-container::-webkit-scrollbar { display: none; }
                
                .scroll-container.is-dragging {
                    cursor: grabbing;
                    scroll-behavior: auto; /* 드래그 중에는 즉각적인 반응을 위해 smooth 끔 */
                    scroll-snap-type: none; /* 드래그 중에는 자석 효과 잠시 끔 */
                }

                .scroll-item {
                    scroll-snap-align: start;
                    flex-shrink: 0;
                }

                .btn-move-arrow {
                    background: none; border: none; color: #adb5bd;
                    padding: 0; display: flex; align-items: center; justify-content: center;
                    transition: all 0.2s; cursor: pointer;
                }
                .btn-move-arrow:hover { color: #6c757d; transform: scale(1.2); }
                
                
                .application-card {
        min-width: 250px;
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); /* 부드러운 움직임을 위한 곡선 */
        cursor: grab;
        background-color: white;
    }

    /* 마우스를 올렸을 때 움찔하는 효과 */
    .application-card:hover {
        transform: translateY(-10px) scale(1.02); /* 위로 10px 이동하고 2% 커짐 */
        box-shadow: 0 10px 20px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.06) !important; /* 그림자도 더 깊게 */
        z-index: 5; /* 옆 카드보다 위로 올라오게 */
    }

    .scroll-container.is-dragging .application-card:hover {
        transform: none; /* 드래그 중에는 움찔 효과 끄기 (어지러움 방지) */
    }
            `}</style>
        </div>
    );
};

export default MyPageHome;