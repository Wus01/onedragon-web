import '../../App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useParams, useHistory } from 'react-router-dom';
import {InputGroup, Form, Button, Modal} from 'react-bootstrap';
import StoreSearchPopup from "./StoreSearchPopup";

axios.defaults.withCredentials = true;

declare global {
    interface Window {
        receiveStoreInfo?: (id: number, name: string) => void;
    }
}

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

/** * 날짜 포맷 및 변환 유틸리티 */
const safeDate = (str: string | number | null | undefined):Date | null => {
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

const formatDate = (date: Date | null | undefined): string | null => {
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
    const { crrHstrNo: pathCrrHstrNo } = useParams();
    // const pathStoreId = "1";
    const history = useHistory();
    const storageUserId = localStorage.getItem('userId');
    // const isEditMode = Boolean(storageUserId && pathStoreId);
    const isEditMode = Boolean(storageUserId && pathCrrHstrNo);
    const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

    // 상태 관리
    const [storeId, setStoreId] = useState<number|null>(null);
    const [crrHstrNo, setCrrHstrNo]= useState<number| null>(
        pathCrrHstrNo ? Number(pathCrrHstrNo): null
    );
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
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

        if (pathCrrHstrNo) {
            setIsLoading(true);
            setStoreName("");
            // axios.get(`${API_BASE_URL}/crrHstr/${storageUserId}/${pathStoreId}`) // 고정 url 피하기 위함
            axios.get<CrrHstrDtl>(`${process.env.REACT_APP_API_URL}/crrHstr/select/${pathCrrHstrNo}`)
                .then(res => {
                    const result = res.data;
                    console.log("경력상세조회:",result);
                    if (result) {
                        setStoreId(result.storeId);
                        setCrrHstrNo(result.crrHstrNo);
                        setStartDate(safeDate(result.crrStrtDate));
                        setEndDate(safeDate(result.crrEndDate));
                        setStoreName(result.storeInfo.storeNm);
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
            setStoreId(null);
            setStoreName("");
            setStartDate(null);
            setEndDate(null);
            setStatus("");
        }
    }, [pathCrrHstrNo, storageUserId, history, API_BASE_URL]);

    // [2] 팝업창 연동
    useEffect(() => {
        window.receiveStoreInfo = (id:number, name:string) => {
            setStoreId(id);
            setStoreName(name);
        };
        return () => {delete window.receiveStoreInfo};
    }, []);

    // const openStoreSearch = () => {
    //     const width = 850;
    //     const height = 800;
    //
    //     // 💡 모니터의 전체 가로/세로 길이를 가져와 중앙 좌표 계산
    //     const left = window.screenX + (window.outerWidth - width) / 2;
    //     const top = window.screenY + (window.outerHeight - height) / 2;
    //
    //     window.open(
    //         '/storeSearchPopup',
    //         'StoreSearch',
    //         `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`
    //     );
    // };

    const [showModal, setShowModal] = useState(false);

    const openStoreSearch = () => {
        setShowModal(true);
    };

    // 💡 팝업에서 지점을 선택했을 때 실행될 함수
    const handleSelectStore = (id: number, nm: string) => {
        setStoreId(id);
        setStoreName(nm);

        setShowModal(false);
    };

    const getPayload = ():CrrHstrPayLoad => ({
        userId: storageUserId,
        storeId,
        crrStrtDate: formatDate(startDate),
        crrEndDate: formatDate(endDate),
        status: status || "01",
        authYn,
        delYn: false,
        crrHstrNo
    });

    const handleSave = () => {
        if (!storeId) return alert("지점을 선택해주세요.");
        axios.post(`${API_BASE_URL}/crrHstr`, getPayload())
            .then(res => {
                alert("등록 완료!");
                history.push(`/mypageHome`);

            })
            .catch(err => alert("등록 실패"));
    };

    const handleUpdate = () => {
        if (!window.confirm("수정하시겠습니까?")) return;
        axios.put<CrrHstrDtl>(`${API_BASE_URL}/crrHstr/update/${crrHstrNo}`, getPayload())
            .then((res) => {
                alert("수정 완료!");
                if(res.data){
                    const result = res.data;
                    // if (String(pathCrrHstrNo) !== String(result.crrHstrNo)) {
                    //     window.location.href = `/crrHstrCreate/${result.crrHstrNo}`;
                    // } else {
                    setStoreName(result.storeInfo.storeNm);
                    setStatus(result.status);
                    setStartDate(safeDate(result.crrStrtDate));
                    setEndDate(safeDate(result.crrEndDate));

                    history.push(`/mypageHome`)
                    // }
                }
            })
            .catch(err => {
                    if(err.response){
                        alert("수정 중 오류가 발생했습니다.");
                    }else{
                        console.error("서버 에러 내용: ", err);
                    }
                }
            );
    };

    const handleDelete = () => {
        if (!window.confirm("정말 이 기록을 삭제하시겠습니까?")) return;
        axios.delete(`${API_BASE_URL}/crrHstr/delete/${crrHstrNo}`, { data: getPayload() })
            .then(() => {
                alert("삭제되었습니다.");
                history.push("/mypageHome");
            })
            .catch(() => alert("삭제 실패"));
    };

    if (isLoading) return <div className="p-5 text-center">데이터 로딩 중...</div>;

    return (
        <>
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
                                onChange={(date: Date|null) => setStartDate(date)}
                                className="form-control"
                                dateFormat="yyyy-MM-dd"
                                placeholderText="시작일"
                                disabled={isReadOnly}
                            />
                            <span>~</span>
                            <DatePicker
                                selected={endDate}
                                onChange={(date: Date|null) => setEndDate(date)} // 💡 오타 수정: setStartDate -> setEndDate
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
                        <Button variant="light" onClick={() => history.push("/mypageHome")}>목록으로</Button>
                    </div>
                </Form>

            </div>
        </div>


            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                centered  // 화면 정중앙에 배치
                dialogClassName="custom-modal-size"
                scrollable
                style={{zIndex:1060}}
            >
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bold">🏢 지점 검색</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* 팝업 컴포넌트를 렌더링하고, 선택 시 실행할 함수를 props로 넘겨줍니다! */}
                    <StoreSearchPopup onSelectStore={handleSelectStore} />
                </Modal.Body>
            </Modal>



        </>

    );
};

export default CrrHstrCreate;