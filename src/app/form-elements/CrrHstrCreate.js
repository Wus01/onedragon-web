import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useParams, useHistory } from 'react-router-dom';
import { InputGroup, Form, Button } from 'react-bootstrap';

axios.defaults.withCredentials = true;

/** * 날짜 포맷 및 변환 유틸리티 */
const safeDate = (str) => {
    if (!str) return null;
    if (typeof str === 'string' && /^\d{8}$/.test(str)) {
        const yyyy = str.substring(0, 4);
        const mm = str.substring(4, 6);
        const dd = str.substring(6, 8);
        return new Date(`${yyyy}-${mm}-${dd}`);
    }
    let dateStr = String(str);
    if (dateStr.includes(" ")) dateStr = dateStr.replace(" ", "T");
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
};

const formatDate = (date) => {
    if (!date) return null;
    try {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    } catch (e) {
        return null;
    }
};

export const CrrHstrCreate = () => {
    const { storeId: pathStoreId } = useParams();
    const history = useHistory();
    const storageUserId = localStorage.getItem('userId');
    const isEditMode = Boolean(storageUserId && pathStoreId);
    const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

    // 상태 관리
    const [storeId, setStoreId] = useState(pathStoreId || "");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [storeName, setStoreName] = useState("");
    const [status, setStatus] = useState("");
    const [authYn, setAuthYn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // 💡 01(인증대기) 상태가 아닐 경우 읽기 전용 처리
    const isReadOnly = isEditMode && status !== '01';

    // [1] 데이터 로드
    useEffect(() => {
        if (!storageUserId) {
            alert("로그인이 필요한 서비스입니다.");
            history.push("/login");
            return;
        }

        if (pathStoreId) {
            setIsLoading(true);
            setStoreName("");
            // axios.get(`${API_BASE_URL}/crrHstr/${storageUserId}/${pathStoreId}`) // 고정 url 피하기 위함
            axios.get(`${process.env.REACT_APP_API_URL}/crrHstr/${storageUserId}/${pathStoreId}`)
                .then(res => {
                    const result = res.data.data;
                    if (result) {
                        setStoreId(result.storeId);
                        setStartDate(safeDate(result.crrStrtDate));
                        setEndDate(safeDate(result.crrEndDate));
                        setStoreName(result.storeName);
                        setStatus(result.status);
                        setAuthYn(result.authYn);
                    }
                })
                .catch(err => {
                    console.error("데이터 로드 실패:", err);
                    alert("데이터를 불러오는 중 오류가 발생했습니다.");
                })
                .finally(() => setIsLoading(false));
        } else {
            setStoreId("");
            setStoreName("");
            setStartDate(null);
            setEndDate(null);
            setStatus("");
        }
    }, [pathStoreId, storageUserId, history, API_BASE_URL]);

    // [2] 팝업창 연동
    useEffect(() => {
        window.receiveStoreInfo = (id, name) => {
            setStoreId(id);
            setStoreName(name);
        };
        return () => delete window.receiveStoreInfo;
    }, []);

    const openStoreSearch = () => {
        const width = 850;
        const height = 800;

        // 💡 모니터의 전체 가로/세로 길이를 가져와 중앙 좌표 계산
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        window.open(
            '/StoreSearchPopup',
            'StoreSearch',
            `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`
        );
    };

    const getPayload = () => ({
        userId: storageUserId,
        storeId: parseInt(storeId),
        crrStrtDate: formatDate(startDate),
        crrEndDate: formatDate(endDate),
        status: status || "01",
        authYn: authYn,
        delYn: false
    });

    const handleSave = () => {
        if (!storeId) return alert("지점을 선택해주세요.");
        axios.post(`${API_BASE_URL}/crrHstr`, getPayload())
            .then(res => {
                alert("등록 완료!");
                history.push(`/CrrHstrCreate/${res.data.data.storeId}`);
            })
            .catch(err => alert("등록 실패"));
    };

    const handleUpdate = () => {
        if (!window.confirm("수정하시겠습니까?")) return;
        axios.put(`${API_BASE_URL}/crrHstr/${storageUserId}/${pathStoreId}`, getPayload())
            .then((res) => {
                alert("수정 완료!");
                const result = res.data.data;
                if (String(pathStoreId) !== String(result.storeId)) {
                    window.location.href = `/CrrHstrCreate/${result.storeId}`;
                } else {
                    setStoreName(result.storeName);
                    setStatus(result.status);
                    setStartDate(safeDate(result.crrStrtDate));
                    setEndDate(safeDate(result.crrEndDate));
                }
            })
            .catch(err => alert("수정 중 오류가 발생했습니다."));
    };

    const handleDelete = () => {
        if (!window.confirm("정말 이 기록을 삭제하시겠습니까?")) return;
        axios.delete(`${API_BASE_URL}/crrHstr/${storageUserId}/${pathStoreId}`, { data: getPayload() })
            .then(() => {
                alert("삭제되었습니다.");
                history.push("/MypageHome");
            })
            .catch(() => alert("삭제 실패"));
    };

    if (isLoading) return <div className="p-5 text-center">데이터 로딩 중...</div>;

    return (
        <div className="p-4 bg-light min-vh-100">
            <div className="card shadow-sm border-0 rounded-4 p-4 mx-auto" style={{ maxWidth: '700px' }}>
                <h3 className="fw-bold mb-4 text-primary border-bottom pb-3">
                    {isEditMode ? "🏠 재직 정보 상세/수정" : "➕ 신규 재직 등록"}
                </h3>
                <Form>
                    <Form.Group className="row mb-3 align-items-center">
                        <Form.Label className="col-sm-3 fw-bold">지점명</Form.Label>
                        <div className="col-sm-6">
                            <InputGroup>
                                <Form.Control
                                    type="text"
                                    placeholder="지점을 검색하세요"
                                    value={storeName}
                                    // 💡 항상 readOnly로 두어 직접 타이핑은 막습니다.
                                    readOnly
                                    // 💡 '01' 상태일 때만 클릭 시 팝업이 뜨도록 설정합니다.
                                    onClick={!isReadOnly ? openStoreSearch : undefined}
                                    style={{
                                        // 💡 클릭 가능 여부에 따라 커서 모양 변경
                                        cursor: isReadOnly ? 'default' : 'pointer',
                                        // 💡 상태가 '01'이면 흰색(#fff), 아니면 부트스트랩 기본 회색(#e9ecef)
                                        backgroundColor: isReadOnly ? '#e9ecef' : '#fff',
                                        // 💡 disabled 속성을 제거했으므로 글자색이 흐려지지 않습니다.
                                        color: '#495057'
                                    }}
                                    // 💡 disabled={isReadOnly} 를 제거하여 회색 필터가 씌워지는 것을 방지합니다.
                                />
                                <InputGroup.Text
                                    onClick={!isReadOnly ? openStoreSearch : undefined}
                                    style={{
                                        cursor: isReadOnly ? 'default' : 'pointer',
                                        backgroundColor: isReadOnly ? '#e9ecef' : '#fff'
                                    }}
                                >
                                    🔍
                                </InputGroup.Text>
                            </InputGroup>
                            <input type="hidden" value={storeId} />
                        </div>
                    </Form.Group>

                    <Form.Group className="row mb-4 align-items-center">
                        <Form.Label className="col-sm-3 fw-bold">근무 기간</Form.Label>
                        <div className="col-sm-9 d-flex gap-2 align-items-center">
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                className="form-control"
                                dateFormat="yyyy-MM-dd"
                                placeholderText="시작일"
                                disabled={isReadOnly}
                            />
                            <span>~</span>
                            <DatePicker
                                selected={endDate}
                                onChange={(date) => setEndDate(date)} // 💡 오타 수정: setStartDate -> setEndDate
                                className="form-control"
                                dateFormat="yyyy-MM-dd"
                                placeholderText="종료일"
                                disabled={isReadOnly}
                            />
                        </div>
                    </Form.Group>

                    {isEditMode && (
                        <Form.Group className="row mb-4 align-items-center">
                            <Form.Label className="col-sm-3 fw-bold">상태</Form.Label>
                            <div className="col-sm-9">
                                <div className="d-flex flex-column align-items-start">
                                    {status === '01' && <span className="badge bg-warning text-dark mb-2">인증 대기</span>}
                                    {status === '02' && <span className="badge bg-info text-dark mb-2">인증 요청 중</span>}
                                    {status === '03' && <span className="badge bg-success mb-2">인증 완료</span>}
                                    {status === '04' && <span className="badge bg-danger mb-2">인증 실패</span>}

                                    <small className="text-muted">
                                        {status === '01' && "* 지점에 재직이력 인증을 요청해 주세요."}
                                        {status === '04' && "* 지점으로부터 거절되었습니다."}
                                        {isReadOnly && status !== '04' && "* 인증이 진행 중이거나 완료된 기록은 수정할 수 없습니다."}
                                    </small>
                                </div>
                            </div>
                        </Form.Group>
                    )}

                    <div className="d-flex justify-content-end gap-2 border-top pt-4">
                        {isEditMode ? (
                            <>
                                <Button variant="primary" onClick={handleUpdate} disabled={isReadOnly}>
                                    수정 내용 저장
                                </Button>
                                <Button variant="outline-danger" onClick={handleDelete}>기록 삭제</Button>
                            </>
                        ) : (
                            <Button variant="success" onClick={handleSave}>등록 후 확인</Button>
                        )}
                        <Button variant="light" onClick={() => history.push("/MypageHome")}>목록으로</Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default CrrHstrCreate;