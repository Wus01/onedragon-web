import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {Modal} from 'react-bootstrap';
import {
    getMypageApplyListAPI,
    getMyPageHiringListAPI,
    getMyPageInfoAPI
} from '../../api/mypageApi';
import MyPageEditModal from './MyPageEditModal';

export interface ApplyItem {
    applyDate: string;
    applySts: string;
    applySucYn: 'Y' | 'N';
    storeNm: string;
    hiringNo: number;
    applyStsNm: string;
    hiringStsNm: string;
}

export interface HiringItem {
    storeNm: string;
    hiringNo: number;
    hiringStsNm: string;
    workStartDate: string;
    workEndDate: string;
}

interface Profile {
    name: string;
    email: string;
    phone: string;
    userId: string;
}

export interface CrrHstrItem {
    crrHstrNo: number;
    crrStrtDate: string;
    crrEndDate: string;
    storeId?: number;
    storeNm: string;
    status?: string;
    applyDate?: string;
    delYn?: boolean;
    storeInfo: StoreInfo;
}

export interface StoreInfo {
    storeId?: number;
    storeNm?: string;
    storeAddr?: string;
}

interface SectionHeaderProps {
    icon: string;
    title: string;
    description: string;
    count: number;
    action?: React.ReactNode;
}

const formatDate = (value?: string) => value ? value.split('T')[0] : '-';

const formatDateTime = (value?: string) => {
    if (!value) return '-';
    return value.replace('T', ' ').substring(0, 16);
};

function SectionHeader({icon, title, description, count, action}: SectionHeaderProps) {
    return (
        <div className="mypage-section-header">
            <div className="mypage-section-heading">
                <span className="mypage-section-icon" aria-hidden="true">
                    <i className={`mdi ${icon}`} />
                </span>
                <div>
                    <div className="mypage-section-title-row">
                        <h2>{title}</h2>
                        <span className="mypage-count">{count}</span>
                    </div>
                    <p>{description}</p>
                </div>
            </div>
            {action}
        </div>
    );
}

function MyCrrHstrListCard({crrHstrItem}: {crrHstrItem: CrrHstrItem}) {
    const storeName = crrHstrItem.storeInfo?.storeNm || crrHstrItem.storeNm || '근무처 미등록';

    return (
        <article className="mypage-item-card mypage-career-card">
            <div className="mypage-item-topline">
                <span className="mypage-card-kicker">CAREER</span>
                <span className="mypage-status is-career">경력 정보</span>
            </div>
            <div className="mypage-store-icon" aria-hidden="true">
                <i className="mdi mdi-store" />
            </div>
            <h3 title={storeName}>{storeName}</h3>
            <p className="mypage-card-meta">
                <i className="mdi mdi-calendar" aria-hidden="true" />
                {formatDate(crrHstrItem.crrStrtDate)} ~ {formatDate(crrHstrItem.crrEndDate)}
            </p>
            {crrHstrItem.storeInfo?.storeAddr && (
                <p className="mypage-card-subtext" title={crrHstrItem.storeInfo.storeAddr}>
                    <i className="mdi mdi-map-marker" aria-hidden="true" />
                    {crrHstrItem.storeInfo.storeAddr}
                </p>
            )}
            <Link className="mypage-card-link" to={`/crrHstrCreate/${crrHstrItem.crrHstrNo}`}>
                경력 상세 보기
                <i className="mdi mdi-arrow-right" aria-hidden="true" />
            </Link>
        </article>
    );
}

function ApplicationCard({application}: {application: ApplyItem}) {
    const isAccepted = application.applySts === '04' || application.applySucYn === 'Y';

    return (
        <article className="mypage-item-card mypage-apply-card">
            <div className="mypage-item-topline">
                <span className="mypage-status is-hiring">{application.hiringStsNm || '채용 진행'}</span>
                <span className={`mypage-status ${isAccepted ? 'is-success' : 'is-pending'}`}>
                    {application.applyStsNm || '지원 완료'}
                </span>
            </div>
            <div className="mypage-store-icon" aria-hidden="true">
                <i className="mdi mdi-briefcase" />
            </div>
            <h3 title={application.storeNm}>{application.storeNm || '채용 공고'}</h3>
            <p className="mypage-card-meta">
                <i className="mdi mdi-clock-outline" aria-hidden="true" />
                지원일 {formatDateTime(application.applyDate)}
            </p>
            <Link className="mypage-card-link" to={`/hiring/${application.hiringNo}`}>
                지원 공고 보기
                <i className="mdi mdi-arrow-right" aria-hidden="true" />
            </Link>
        </article>
    );
}

function HiringCard({hiring}: {hiring: HiringItem}) {
    return (
        <article className="mypage-item-card mypage-hiring-card">
            <div className="mypage-item-topline">
                <span className="mypage-card-kicker">MY POST</span>
                <span className="mypage-status is-hiring">{hiring.hiringStsNm || '공고 등록'}</span>
            </div>
            <div className="mypage-store-icon" aria-hidden="true">
                <i className="mdi mdi-bullhorn" />
            </div>
            <h3 title={hiring.storeNm}>{hiring.storeNm || '등록한 공고'}</h3>
            <p className="mypage-card-meta">
                <i className="mdi mdi-calendar" aria-hidden="true" />
                {formatDate(hiring.workStartDate)} ~ {formatDate(hiring.workEndDate)}
            </p>
            <Link className="mypage-card-link" to={`/hiring/${hiring.hiringNo}`}>
                공고 상세 보기
                <i className="mdi mdi-arrow-right" aria-hidden="true" />
            </Link>
        </article>
    );
}

const MyPageHome: React.FC = () => {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [crrHstrList, setCrrHstrList] = useState<CrrHstrItem[]>([]);
    const [myApplyList, setMyApplyList] = useState<ApplyItem[]>([]);
    const [myHiringList, setMyHiringList] = useState<HiringItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isDrag, setIsDrag] = useState(false);
    const [startX, setStartX] = useState(0);

    const crrScrollRef = useRef<HTMLDivElement | null>(null);
    const applyScrollRef = useRef<HTMLDivElement | null>(null);
    const hiringScrollRef = useRef<HTMLDivElement | null>(null);
    const history = useHistory();

    const selectMyApplyList = useCallback(async () => {
        try {
            const data = await getMypageApplyListAPI();
            setMyApplyList(data || []);
        } catch (error) {
            console.error('지원 목록을 불러오지 못했습니다.', error);
        }
    }, []);

    const selectMyHiringList = useCallback(async () => {
        try {
            const data = await getMyPageHiringListAPI();
            setMyHiringList(data || []);
        } catch (error) {
            console.error('등록한 공고 목록을 불러오지 못했습니다.', error);
        }
    }, []);

    useEffect(() => {
        const fetchMyPage = async () => {
            setLoading(true);
            try {
                const result = await getMyPageInfoAPI();
                if (result.success) {
                    setProfile({
                        name: result.data.userInfo.userNm,
                        email: result.data.userInfo.userEmail,
                        phone: result.data.userInfo.userPhoneNm,
                        userId: result.data.userInfo.userId
                    });
                    setCrrHstrList(result.data.userInfo.crrHstrList || []);
                }
            } catch (error) {
                console.error('마이페이지 정보를 불러오지 못했습니다.', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMyPage();
        selectMyApplyList();
        selectMyHiringList();
    }, [selectMyApplyList, selectMyHiringList]);

    const onDragStart = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDrag(true);
        setStartX(event.pageX + event.currentTarget.scrollLeft);
    };

    const onDragMove = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!isDrag) return;
        event.currentTarget.scrollLeft = startX - event.pageX;
    };

    const onDragEnd = () => setIsDrag(false);

    const handleScroll = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
        ref.current?.scrollBy({
            left: direction === 'left' ? -640 : 640,
            behavior: 'smooth'
        });
    };

    const scrollHandlers = {
        onMouseDown: onDragStart,
        onMouseMove: onDragMove,
        onMouseUp: onDragEnd,
        onMouseLeave: onDragEnd
    };

    const validCrrHstrList = crrHstrList.filter(item => item?.delYn !== true);
    const displayName = profile?.name || '회원';
    const initial = displayName.trim().charAt(0) || 'O';

    if (loading) {
        return (
            <div className="mypage-loading">
                <span className="mypage-loading-spinner" />
                <p>나의 활동을 불러오고 있어요.</p>
            </div>
        );
    }

    return (
        <main className="mypage">
            <section className="mypage-hero">
                <div className="mypage-hero-copy">
                    <span className="mypage-eyebrow">MY WORKSPACE</span>
                    <h1>{displayName}님의<br />일자리 공간</h1>
                    <p>내 경력과 지원 현황을 한곳에서 확인하고 다음 기회를 준비해 보세요.</p>
                    <Link className="mypage-hero-link" to="/hiringList">
                        채용 공고 둘러보기
                        <i className="mdi mdi-arrow-right" aria-hidden="true" />
                    </Link>
                </div>
                <div className="mypage-summary" aria-label="나의 활동 요약">
                    <div className="mypage-summary-item">
                        <span>등록 경력</span>
                        <strong>{validCrrHstrList.length}</strong>
                    </div>
                    <div className="mypage-summary-item">
                        <span>지원 내역</span>
                        <strong>{myApplyList.length}</strong>
                    </div>
                    <div className="mypage-summary-item">
                        <span>등록 공고</span>
                        <strong>{myHiringList.length}</strong>
                    </div>
                </div>
                <span className="mypage-hero-shape shape-one" aria-hidden="true" />
                <span className="mypage-hero-shape shape-two" aria-hidden="true" />
            </section>

            <section className="mypage-profile-card">
                <div className="mypage-avatar" aria-hidden="true">{initial}</div>
                <div className="mypage-profile-main">
                    <span className="mypage-member-label">개인 회원</span>
                    <h2>{displayName}님, 반가워요!</h2>
                    <p>프로필 정보를 최신 상태로 유지하면 지원 과정이 더 편리해집니다.</p>
                </div>
                <dl className="mypage-profile-details">
                    <div>
                        <dt><i className="mdi mdi-email-outline" aria-hidden="true" />이메일</dt>
                        <dd>{profile?.email || '-'}</dd>
                    </div>
                    <div>
                        <dt><i className="mdi mdi-phone-outline" aria-hidden="true" />연락처</dt>
                        <dd>{profile?.phone || '-'}</dd>
                    </div>
                </dl>
                <button className="mypage-edit-button" type="button" onClick={() => setShowModal(true)}>
                    <i className="mdi mdi-pencil-outline" aria-hidden="true" />
                    정보 수정
                </button>
            </section>

            <section className="mypage-content-section">
                <SectionHeader
                    icon="mdi-file-document-edit-outline"
                    title="내 경력"
                    description="등록한 근무 이력을 확인하고 관리하세요."
                    count={validCrrHstrList.length}
                    action={(
                        <button className="mypage-primary-button" type="button" onClick={() => history.push('/crrHstrCreate')}>
                            <i className="mdi mdi-plus" aria-hidden="true" />신규 경력 등록
                        </button>
                    )}
                />
                <div className="mypage-carousel">
                    <button className="mypage-scroll-button is-left" type="button" aria-label="이전 경력 보기" onClick={() => handleScroll(crrScrollRef, 'left')}>
                        <i className="mdi mdi-chevron-left" />
                    </button>
                    <div ref={crrScrollRef} className={`mypage-scroll-track ${isDrag ? 'is-dragging' : ''}`} {...scrollHandlers}>
                        {validCrrHstrList.length > 0 ? validCrrHstrList.map(item => (
                            <MyCrrHstrListCard key={item.crrHstrNo} crrHstrItem={item} />
                        )) : (
                            <div className="mypage-empty">
                                <span><i className="mdi mdi-briefcase-plus-outline" /></span>
                                <strong>등록된 경력이 없어요.</strong>
                                <p>첫 경력을 등록하고 나의 업무 경험을 정리해 보세요.</p>
                            </div>
                        )}
                    </div>
                    <button className="mypage-scroll-button is-right" type="button" aria-label="다음 경력 보기" onClick={() => handleScroll(crrScrollRef, 'right')}>
                        <i className="mdi mdi-chevron-right" />
                    </button>
                </div>
            </section>

            <section className="mypage-content-section">
                <SectionHeader
                    icon="mdi-send"
                    title="내 지원 내역"
                    description="지원한 공고와 현재 진행 상태를 확인하세요."
                    count={myApplyList.length}
                />
                <div className="mypage-carousel">
                    <button className="mypage-scroll-button is-left" type="button" aria-label="이전 지원 보기" onClick={() => handleScroll(applyScrollRef, 'left')}>
                        <i className="mdi mdi-chevron-left" />
                    </button>
                    <div ref={applyScrollRef} className={`mypage-scroll-track ${isDrag ? 'is-dragging' : ''}`} {...scrollHandlers}>
                        {myApplyList.length > 0 ? myApplyList.map((item, index) => (
                            <ApplicationCard key={`${item.hiringNo}-${index}`} application={item} />
                        )) : (
                            <div className="mypage-empty">
                                <span><i className="mdi mdi-send-outline" /></span>
                                <strong>아직 지원한 공고가 없어요.</strong>
                                <p>나에게 맞는 일자리를 찾아 새로운 기회에 도전해 보세요.</p>
                            </div>
                        )}
                    </div>
                    <button className="mypage-scroll-button is-right" type="button" aria-label="다음 지원 보기" onClick={() => handleScroll(applyScrollRef, 'right')}>
                        <i className="mdi mdi-chevron-right" />
                    </button>
                </div>
            </section>

            <section className="mypage-content-section">
                <SectionHeader
                    icon="mdi-bullhorn"
                    title="내가 올린 공고"
                    description="직접 등록한 채용 공고를 한눈에 관리하세요."
                    count={myHiringList.length}
                />
                <div className="mypage-carousel">
                    <button className="mypage-scroll-button is-left" type="button" aria-label="이전 공고 보기" onClick={() => handleScroll(hiringScrollRef, 'left')}>
                        <i className="mdi mdi-chevron-left" />
                    </button>
                    <div ref={hiringScrollRef} className={`mypage-scroll-track ${isDrag ? 'is-dragging' : ''}`} {...scrollHandlers}>
                        {myHiringList.length > 0 ? myHiringList.map((item, index) => (
                            <HiringCard key={`${item.hiringNo}-${index}`} hiring={item} />
                        )) : (
                            <div className="mypage-empty">
                                <span><i className="mdi mdi-bullhorn-outline" /></span>
                                <strong>등록한 채용 공고가 없어요.</strong>
                                <p>필요한 인재를 찾을 수 있도록 새로운 공고를 작성해 보세요.</p>
                            </div>
                        )}
                    </div>
                    <button className="mypage-scroll-button is-right" type="button" aria-label="다음 공고 보기" onClick={() => handleScroll(hiringScrollRef, 'right')}>
                        <i className="mdi mdi-chevron-right" />
                    </button>
                </div>
            </section>

            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                centered
                dialogClassName="custom-modal-size mypage-edit-modal"
                scrollable
                style={{zIndex: 1060}}
            >
                <Modal.Header closeButton>
                    <Modal.Title>내 정보 수정</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {showModal && profile && (
                        <MyPageEditModal
                            onClose={() => setShowModal(false)}
                            userEmail={profile.email}
                            userId={profile.userId}
                            userNm={profile.name}
                            userPhoneNm={profile.phone}
                        />
                    )}
                </Modal.Body>
            </Modal>
        </main>
    );
};

export default MyPageHome;
