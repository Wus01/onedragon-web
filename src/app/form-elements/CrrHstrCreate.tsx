import '../../App.css';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Form, Modal } from 'react-bootstrap';
import StoreSearchPopup from './StoreSearchPopup';
import CustomDatePicker from '../common/Datepicker';
import {
    deleteCrrHstrAPI,
    getCrrHstrAPI,
    saveCrrHstrAPI,
    updateCrrHstrAPI,
} from '../../api/mypageApi';

export interface CrrHstrDtl {
    storeId: number;
    crrHstrNo: number;
    crrStrtDate: string;
    crrEndDate: string;
    storeInfo: {
        storeNm: string;
    };
    status: string;
    authYn: boolean;
}

export interface CrrHstrPayLoad {
    userId: string;
    storeId: number | null;
    crrHstrNo: number | null;
    crrStrtDate: string;
    crrEndDate: string;
    status: string;
    authYn: boolean;
    delYn: boolean;
}

const safeDate = (value: string | number | null | undefined): Date | null => {
    if (!value) return null;

    if (typeof value === 'string' && /^\d{8}$/.test(value)) {
        const year = value.substring(0, 4);
        const month = value.substring(4, 6);
        const day = value.substring(6, 8);
        return new Date(`${year}-${month}-${day}`);
    }

    let dateString = String(value);
    if (dateString.includes(' ')) dateString = dateString.replace(' ', 'T');
    const date = new Date(dateString);
    return Number.isNaN(date.getTime()) ? null : date;
};

const formatDate = (date: Date | null | undefined): string => {
    if (!date) return '';

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const statusContent: Record<string, { label: string; message: string; className: string }> = {
    '01': { label: '인증 대기', message: '지점에 재직 이력 인증을 요청할 수 있어요.', className: 'is-waiting' },
    '02': { label: '인증 요청 중', message: '지점에서 재직 정보를 확인하고 있어요.', className: 'is-reviewing' },
    '03': { label: '인증 완료', message: '지점 확인이 완료된 경력이에요.', className: 'is-approved' },
    '04': { label: '인증 실패', message: '입력한 정보를 확인한 뒤 다시 시도해 주세요.', className: 'is-rejected' },
};

export const CrrHstrCreate: React.FC = () => {
    const { crrHstrNo: pathCrrHstrNo } = useParams<{ crrHstrNo?: string }>();
    const history = useHistory();
    const storageUserId = localStorage.getItem('userId');
    const isEditMode = Boolean(storageUserId && pathCrrHstrNo);

    const [storeId, setStoreId] = useState<number | null>(null);
    const [crrHstrNo, setCrrHstrNo] = useState<number | null>(
        pathCrrHstrNo ? Number(pathCrrHstrNo) : null,
    );
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [storeName, setStoreName] = useState('');
    const [status, setStatus] = useState('');
    const [authYn, setAuthYn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const isReadOnly = isEditMode && status !== '01';
    const currentStatus = statusContent[status] || statusContent['01'];

    useEffect(() => {
        if (!storageUserId) {
            alert('로그인이 필요한 서비스입니다.');
            history.push('/login');
            return;
        }

        if (!pathCrrHstrNo) {
            setStoreId(null);
            setStoreName('');
            setStartDate(null);
            setEndDate(null);
            setStatus('');
            return;
        }

        const fetchCareer = async () => {
            setIsLoading(true);
            setStoreName('');

            try {
                const data = await getCrrHstrAPI(pathCrrHstrNo);
                if (!data) return;

                setStoreId(data.storeId);
                setCrrHstrNo(data.crrHstrNo);
                setStartDate(safeDate(data.crrStrtDate));
                setEndDate(safeDate(data.crrEndDate));
                setStoreName(data.storeInfo.storeNm);
                setStatus(data.status);
                setAuthYn(data.authYn);
            } catch (error) {
                console.error('경력 정보를 불러오지 못했습니다.', error);
                alert('데이터를 불러오는 중 오류가 발생했습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCareer();
    }, [pathCrrHstrNo, storageUserId, history]);

    const handleSelectStore = (id: number, name: string) => {
        setStoreId(id);
        setStoreName(name);
        setShowModal(false);
    };

    const getPayload = (): CrrHstrPayLoad => ({
        userId: storageUserId || '',
        storeId,
        crrHstrNo,
        crrStrtDate: formatDate(startDate),
        crrEndDate: formatDate(endDate),
        status: status || '01',
        authYn,
        delYn: false,
    });

    const validateCareer = (): boolean => {
        if (!storeId) {
            alert('근무했던 지점을 선택해주세요.');
            return false;
        }

        if (!startDate || !endDate) {
            alert('근무 시작일과 종료일을 모두 선택해주세요.');
            return false;
        }

        if (endDate < startDate) {
            alert('종료일은 시작일보다 빠를 수 없습니다.');
            return false;
        }

        return true;
    };

    const handleSave = async () => {
        if (!validateCareer()) return;

        try {
            await saveCrrHstrAPI(getPayload());
            alert('경력이 등록되었습니다.');
            history.push('/mypageHome');
        } catch (error) {
            console.error('경력 등록에 실패했습니다.', error);
            alert('등록에 실패하였습니다.');
        }
    };

    const handleUpdate = async () => {
        if (!validateCareer() || !window.confirm('수정하시겠습니까?')) return;

        try {
            await updateCrrHstrAPI(getPayload(), crrHstrNo);
            alert('경력 정보가 수정되었습니다.');
            history.push('/mypageHome');
        } catch (error) {
            console.error('경력 수정에 실패했습니다.', error);
            alert('수정 중 오류가 발생했습니다.');
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('정말 이 기록을 삭제하시겠습니까?')) return;

        try {
            await deleteCrrHstrAPI(getPayload(), crrHstrNo);
            alert('경력 기록이 삭제되었습니다.');
            history.push('/mypageHome');
        } catch (error) {
            console.error('경력 삭제에 실패했습니다.', error);
            alert('삭제에 실패하였습니다.');
        }
    };

    if (isLoading) {
        return (
            <div className="career-loading" role="status">
                <span className="career-loading-spinner" />
                <strong>경력 정보를 불러오고 있어요.</strong>
                <p>잠시만 기다려 주세요.</p>
            </div>
        );
    }

    return (
        <div className="career-page">
            <header className="career-page-header">
                <div>
                    <span className="section-eyebrow">CAREER PROFILE</span>
                    <h1>{isEditMode ? '경력 정보 확인' : '신규 경력 등록'}</h1>
                    <p>{isEditMode
                        ? '등록한 근무 정보와 인증 상태를 확인할 수 있어요.'
                        : '근무했던 지점과 기간을 입력하면 나만의 경력이 완성돼요.'}
                    </p>
                </div>
                {isEditMode && (
                    <span className={`career-header-status ${currentStatus.className}`}>
                        <span />{currentStatus.label}
                    </span>
                )}
            </header>

            <div className="career-layout">
                <section className="career-form-card">
                    <div className="career-card-heading">
                        <span><i className="mdi mdi-file-document-edit-outline" aria-hidden="true" /></span>
                        <div>
                            <h2>근무 정보</h2>
                            <p>정확한 경력 인증을 위해 실제 근무 정보를 입력해 주세요.</p>
                        </div>
                    </div>

                    <Form className="career-form">
                        <Form.Group className="career-field-group">
                            <div className="career-field-label">
                                <span>01</span>
                                <div>
                                    <Form.Label>근무 지점</Form.Label>
                                    <small>근무했던 지점을 검색해 선택해 주세요.</small>
                                </div>
                            </div>

                            <button
                                type="button"
                                className={`career-store-selector ${storeName ? 'has-value' : ''}`}
                                onClick={!isReadOnly ? () => setShowModal(true) : undefined}
                                disabled={isReadOnly}
                            >
                                <span className="career-selector-icon"><i className="mdi mdi-storefront-outline" /></span>
                                <span className="career-selector-copy">
                                    <strong>{storeName || '지점을 검색해 주세요'}</strong>
                                    <small>{storeName ? '선택한 지점' : '지점명 또는 주소로 검색할 수 있어요.'}</small>
                                </span>
                                {!isReadOnly && <span className="career-search-action"><i className="mdi mdi-magnify" /> 검색</span>}
                                {isReadOnly && <i className="mdi mdi-lock-outline career-lock-icon" aria-label="수정할 수 없음" />}
                            </button>
                        </Form.Group>

                        <Form.Group className="career-field-group">
                            <div className="career-field-label">
                                <span>02</span>
                                <div>
                                    <Form.Label>근무 기간</Form.Label>
                                    <small>첫 근무일과 마지막 근무일을 입력해 주세요.</small>
                                </div>
                            </div>

                            <div className="career-date-grid">
                                <label className="career-date-field">
                                    <span>근무 시작일</span>
                                    <div>
                                        <CustomDatePicker
                                            selectedDate={startDate}
                                            onChange={(date) => setStartDate(date)}
                                            showTime={false}
                                            placeholder="날짜 선택"
                                            disabled={isReadOnly}
                                        />
                                    </div>
                                </label>

                                <span className="career-date-arrow"><i className="mdi mdi-arrow-right" /></span>

                                <label className="career-date-field">
                                    <span>근무 종료일</span>
                                    <div>
                                        <CustomDatePicker
                                            selectedDate={endDate}
                                            onChange={(date) => setEndDate(date)}
                                            showTime={false}
                                            placeholder="날짜 선택"
                                            disabled={isReadOnly}
                                            minDate={startDate}
                                        />
                                    </div>
                                </label>
                            </div>
                        </Form.Group>

                        {isEditMode && (
                            <div className={`career-status-panel ${currentStatus.className}`}>
                                <span className="career-status-icon">
                                    <i className={status === '03' ? 'mdi mdi-check-decagram-outline' : 'mdi mdi-shield-clock-outline'} />
                                </span>
                                <div>
                                    <span>현재 인증 상태</span>
                                    <strong>{currentStatus.label}</strong>
                                    <p>{currentStatus.message}</p>
                                </div>
                            </div>
                        )}

                        <div className="career-form-actions">
                            <Button type="button" variant="light" onClick={() => history.push('/mypageHome')}>
                                <i className="mdi mdi-arrow-left" /> 목록으로
                            </Button>
                            <div>
                                {isEditMode && (
                                    <Button type="button" variant="outline-danger" onClick={handleDelete}>
                                        <i className="mdi mdi-trash-can-outline" /> 삭제
                                    </Button>
                                )}
                                <Button
                                    type="button"
                                    variant="primary"
                                    onClick={isEditMode ? handleUpdate : handleSave}
                                    disabled={isReadOnly}
                                >
                                    <i className={isEditMode ? 'mdi mdi-content-save-outline' : 'mdi mdi-check'} />
                                    {isEditMode ? '변경사항 저장' : '경력 등록하기'}
                                </Button>
                            </div>
                        </div>
                    </Form>
                </section>

                <aside className="career-guide">
                    <div className="career-progress-card">
                        <span className="section-eyebrow">REGISTRATION GUIDE</span>
                        <h2>이렇게 등록돼요</h2>
                        <ol>
                            <li className={storeName ? 'is-complete' : 'is-current'}>
                                <span>{storeName ? <i className="mdi mdi-check" /> : '1'}</span>
                                <div><strong>근무 지점 선택</strong><small>등록된 점포에서 검색</small></div>
                            </li>
                            <li className={startDate && endDate ? 'is-complete' : storeName ? 'is-current' : ''}>
                                <span>{startDate && endDate ? <i className="mdi mdi-check" /> : '2'}</span>
                                <div><strong>근무 기간 입력</strong><small>시작일과 종료일 선택</small></div>
                            </li>
                            <li className={storeName && startDate && endDate ? 'is-current' : ''}>
                                <span>3</span>
                                <div><strong>경력 등록 완료</strong><small>마이페이지에서 확인</small></div>
                            </li>
                        </ol>
                    </div>

                    <div className="career-tip-card">
                        <span><i className="mdi mdi-lightbulb-on-outline" /></span>
                        <div>
                            <strong>알아두세요</strong>
                            <p>인증이 진행 중이거나 완료된 경력은 수정할 수 없어요. 등록 전 정보를 한 번 더 확인해 주세요.</p>
                        </div>
                    </div>
                </aside>
            </div>

            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                centered
                dialogClassName="custom-modal-size store-search-modal"
                scrollable
                style={{ zIndex: 1060 }}
            >
                <Modal.Header closeButton>
                    <Modal.Title><i className="mdi mdi-store-search-outline mr-2" />근무 지점 검색</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <StoreSearchPopup onSelectStore={handleSelectStore} />
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default CrrHstrCreate;
