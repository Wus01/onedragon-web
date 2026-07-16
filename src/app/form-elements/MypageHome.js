import React, {useState, useEffect, useRef, useCallback} from 'react';
import { FaUserCircle, FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import axios from "axios";
import {Link, useHistory} from "react-router-dom";

const STATUS_LABEL = {
    '01': '지원완료', '02': '서류검토중', '03': '면접제의',
    '04': '최종합격', '05': '불합격', '09': '지원취소'
};

const MyCrrList = ({ application }) => (
    // {application.crrHstrList.delYn === true ?  }
    <div className="card shadow-sm p-3 border-0 rounded-3 application-card" style={{ minWidth: '250px' }}>
        {/* 추후 인증 상태로 표시 ㄱㄱ*/}
        {/*<span className="badge bg-primary rounded-pill mb-3" style={{ width: 'fit-content' }}>*/}
        {/*    {STATUS_LABEL[application.status] || '지원완료'}*/}
        {/*</span>*/}
        <h4 className="card-title fs-6 mb-1 text-truncate" title={application.storeInfo.storeNm}>{application.storeInfo.storeNm}</h4>
        <p className="card-text text-muted small">{application.crrStrtDate}~{application.crrEndDate}</p>
        <div className="mt-2 text-end">
            <Link to={`/crrHstrCreate/${application.crrHstrNo}`}>
            <button className="btn btn-link btn-sm p-0 text-decoration-none">상세보기</button>
            </Link>
        </div>
    </div>
);


const ApplicationCard2 = ({ myApplyList }) => (
        <div className="card shadow-sm p-3 border-0 rounded-3 application-card" style={{minWidth: '250px'}}>
            <div className="d-flex gap-2 mb-3">
                <span className="badge bg-primary rounded-pill mb-3" style={{width: 'fit-content'}}>
                    {myApplyList.hiringStsNm}
                </span>
                <span className="badge bg-warning text-dark rounded-pill mb-3" style={{width: 'fit-content'}}>
                    {myApplyList.applySts==='04' ? myApplyList.applyStsNm+ '🎉' : myApplyList.applyStsNm}
                </span>
            </div>
            <h4 className="card-title fs-6 mb-1 text-truncate" title={myApplyList.storeNm}>{myApplyList.storeNm}</h4>
            <p className="card-text text-muted small">지원일: {myApplyList.applyDate.substring(0, 19)}</p>
            <div className="mt-2 text-end">
                <Link to={`/hiring/${myApplyList.hiringNo}`}>
                    <button className="btn btn-link btn-sm p-0 text-decoration-none">상세보기</button>
                </Link>
            </div>
        </div>
);

const MyHiringList = ({ myHiringList }) => (
    <div className="card shadow-sm p-3 border-0 rounded-3 application-card" style={{minWidth: '250px'}}>
        <div className="d-flex gap-2 mb-3">
                <span className="badge bg-primary rounded-pill mb-3" style={{width: 'fit-content'}}>
                    {myHiringList.hiringStsNm}
                </span>
        </div>
        <h4 className="card-title fs-6 mb-1 text-truncate" title={myHiringList.storeNm}>{myHiringList.storeNm}</h4>

        <p className="card-text text-muted small">근무기간: {myHiringList.workStartDate} ~ {myHiringList.workEndDate}</p>
        <div className="mt-2 text-end">
            <Link to={`/hiring/${myHiringList.hiringNo}`}>
                <button className="btn btn-link btn-sm p-0 text-decoration-none">상세보기</button>
            </Link>
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

    // 1. 드래그 시작 (마우스 누름)
    const onDragStart = (e) => {
        e.preventDefault();
        setIsDrag(true);
        // e.currentTarget으로 현재 이벤트가 발생한 div 요소를 바로 가져옵니다!
        setStartX(e.pageX + e.currentTarget.scrollLeft);
    };

    // 2. 드래그 진행 중 (마우스 이동)
        const onDragMove = (e) => {
            if (!isDrag) return;
            // e.currentTarget의 scrollLeft를 마우스 이동량에 맞춰 변경
            e.currentTarget.scrollLeft = startX - e.pageX;
        };

    // 3. 드래그 종료 (마우스 뗌 / 영역 벗어남)
        const onDragEnd = () => {
            setIsDrag(false);
        };

    const crrScrollRef = useRef(null);
    const applyScrollRef = useRef(null);
    const hiringScrollRef = useRef(null);

    // 기존 버튼 클릭 이동 함수
    const handleScroll = (ref, direction) => {
        if(ref.current){
            const scrollAmount = 600;
            ref.current.scrollBy({
                left:direction === 'left'? -scrollAmount : scrollAmount,
                behavior:'smooth'
            });
        }
    };

    useEffect(() => {
        selectMyApplyList(); // 내 지원목록 조회
        selectMyHiringList(); // 내 공고목록 조회

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
                    // setApplications(json.data.applications);
                    setApplications(json.data.userInfo.crrHstrList);
                }
            })
            .finally(() => setLoading(false));
    }, [API_BASE_URL]);

    // 지원 목록 조회
    const [myApplyList, setMyApplyList] = useState([]);

    const selectMyApplyList = useCallback(async ()=>{
        const userId = localStorage.getItem('userId');

        if (!userId) {
            console.warn("로그인된 사용자 ID가 없습니다.");
            return;
        }
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/mypage/myApplyList`,
                {params:{userId: userId}});
            setMyApplyList(res.data);
        } catch (err) {
            console.error("내가 지원한 목록 로드 실패:", err);
        }
    }, []);

    // 내 공고 목록 조회
    const [myHiringList, setMyHiringList] = useState([]);

    const selectMyHiringList = useCallback(async ()=>{
        const userId = localStorage.getItem('userId');

        if (!userId) {
            console.warn("로그인된 사용자 ID가 없습니다.");
            return;
        }
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/mypage/myHiringList`,
                {params:{userId: userId}});
            setMyHiringList(res.data);
            console.log("내 공고리스트: ",res.data);
        } catch (err) {
            console.error("내 공고리스트 목록 로드 실패:", err);
        }
    }, []);

    const history = useHistory();

    function goToCreateCrr(){
        history.push('/crrHstrCreate');
    }


    // const [myCrrHstrList, setMyCrrHstrList] = useState([]);
    // const selectMyCrrHstrList = useCallback(async ()=>{
    //     const userId = localStorage.getItem('userId');
    //
    //     if (!userId) {
    //         console.warn("로그인된 사용자 ID가 없습니다.");
    //         return;
    //     }
    //     try {
    //         const res = await axios.get(`${process.env.REACT_APP_API_URL}/crrHstr/${userId}`,
    //             {params:{userId: userId}});
    //         setMyCrrHstrList(res.data);
    //         console.log("내 경력리스트: ",res.data);
    //     } catch (err) {
    //         console.error("내 경력리스트 목록 로드 실패:", err);
    //     }
    // }, []);

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

                <h3 className="fs-6 fw-bold text-secondary mb-3">내 경력</h3><button onClick={goToCreateCrr}>등록하기</button>

                <div className="position-relative d-flex align-items-center" style={{ maxWidth: '1100px' }}>
                    <button onClick={() => handleScroll(crrScrollRef,'left')} className="btn-move-arrow me-2">
                        <FaChevronLeft size={22} />
                    </button>

                    {/* 드래그 이벤트 연결 */}
                    <div
                        ref={crrScrollRef}
                        className={`d-flex overflow-auto gap-3 pb-3 scroll-container ${isDrag ? 'is-dragging' : ''}`}
                        onMouseDown={onDragStart}
                        onMouseMove={onDragMove}
                        onMouseUp={onDragEnd}
                        onMouseLeave={onDragEnd}
                    >
                        {applications
                            // ⭐️ app 자체가 경력 객체이므로 바로 .delYn으로 체크합니다!
                            .filter(app => app?.delYn === false)
                            .map((app, index, filteredArray) => (

                            <div key={index} className="d-flex align-items-center scroll-item">
                                <MyCrrList application={app} />
                                {index < filteredArray.length - 1 && (
                                    <FaChevronRight className="ms-3 text-muted opacity-50" style={{ fontSize: '14px' }} />
                                )}
                            </div>
                        ))}
                    </div>

                    <button onClick={() => handleScroll(crrScrollRef,'right')} className="btn-move-arrow ms-2">
                        <FaChevronRight size={22} />
                    </button>
                </div>

                {/* 지원 목록 */}
                <h3 className="fs-6 fw-bold text-secondary mb-3">내 지원 목록</h3>
                <div className="position-relative d-flex align-items-center" style={{ maxWidth: '1100px' }}>
                    <button onClick={() => handleScroll(applyScrollRef,'left')} className="btn-move-arrow me-2">
                        <FaChevronLeft size={22} />
                    </button>

                    {/* 드래그 이벤트 연결 */}
                    <div
                        ref={applyScrollRef}
                        className={`d-flex overflow-auto gap-3 pb-3 scroll-container ${isDrag ? 'is-dragging' : ''}`}
                        onMouseDown={onDragStart}
                        onMouseMove={onDragMove}
                        onMouseUp={onDragEnd}
                        onMouseLeave={onDragEnd}
                    >
                        {myApplyList.map((item, index) => (
                            <div key={index} className="d-flex align-items-center scroll-item">
                                <ApplicationCard2 myApplyList={item} >
                                {index < myApplyList.length - 1 && (
                                    <FaChevronRight className="ms-3 text-muted opacity-50" style={{ fontSize: '14px' }} />
                                )}
                                </ApplicationCard2>
                            </div>
                        ))}
                    </div>

                    <button onClick={() => handleScroll(applyScrollRef,'right')} className="btn-move-arrow ms-2">
                        <FaChevronRight size={22} />
                    </button>
                </div>

                {/* 내 공고 목록 */}
                <h3 className="fs-6 fw-bold text-secondary mb-3">내 공고 목록</h3>
                <div className="position-relative d-flex align-items-center" style={{ maxWidth: '1100px' }}>
                    <button onClick={() => handleScroll(hiringScrollRef,'left')} className="btn-move-arrow me-2">
                        <FaChevronLeft size={22} />
                    </button>

                    {/* 드래그 이벤트 연결 */}
                    <div
                        ref={hiringScrollRef}
                        className={`d-flex overflow-auto gap-3 pb-3 scroll-container ${isDrag ? 'is-dragging' : ''}`}
                        onMouseDown={onDragStart}
                        onMouseMove={onDragMove}
                        onMouseUp={onDragEnd}
                        onMouseLeave={onDragEnd}
                    >
                        {myHiringList.map((item, index) => (
                            <div key={index} className="d-flex align-items-center scroll-item">
                                <MyHiringList myHiringList={item} >
                                    {index < myHiringList.length - 1 && (
                                        <FaChevronRight className="ms-3 text-muted opacity-50" style={{ fontSize: '14px' }} />
                                    )}
                                </MyHiringList>
                            </div>
                        ))}
                    </div>

                    <button onClick={() => handleScroll(hiringScrollRef,'right')} className="btn-move-arrow ms-2">
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