import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, InputGroup, Form, Button, Pagination } from 'react-bootstrap';

const StoreSearchPopup = () => {
    const [keyword, setKeyword] = useState("");
    const [stores, setStores] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const itemsPerPage = 10;
    const pageGroupSize = 5; // 💡 한 번에 보여줄 페이지 번호 개수


    const API_BASE_URL = "http://localhost:8080/api/store"; // 백엔드 경로에 맞게 수정

    // 페이지 번호가 바뀔 때마다 자동으로 서버 호출
    useEffect(() => {
        fetchStores();
    }, [currentPage]);

    const fetchStores = () => {
        axios.get(`${API_BASE_URL}/search`, {
            params: {
                nm: keyword,
                page: currentPage,
                size: itemsPerPage
            }
        })
            .then(res => {
                // 💡 백엔드 응답 구조: res.data.data.items
                const responseData = res.data.data;
                if (responseData) {
                    setStores(responseData.items || []);
                    setTotalCount(responseData.totalCount || 0);
                }
            })
            .catch(err => {
                console.error("데이터 로드 실패:", err);
            });
    };

    const handleSearch = () => {
        setCurrentPage(1); // 새로운 검색 시 1페이지로 강제 이동
        fetchStores();
    };

    const selectStore = (id, nm) => {
        if (window.opener && !window.opener.closed) {
            window.opener.receiveStoreInfo(id, nm);
            window.close();
        }
    };

    const totalPages = Math.ceil(totalCount / itemsPerPage);
    // 💡 현재 페이지가 속한 그룹 계산 (1~5페이지면 그룹 0, 6~10페이지면 그룹 1)
    const currentGroup = Math.floor((currentPage - 1) / pageGroupSize);
    const startPage = currentGroup * pageGroupSize + 1;
    const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);
    const paginationItems = [];
    for (let i = startPage; i <= endPage; i++) {
        paginationItems.push(
            <Pagination.Item
                key={i}
                active={i === currentPage}
                onClick={() => setCurrentPage(i)}
            >
                {i}
            </Pagination.Item>
        );
    }

    return (
        <div className="p-3">
            <h5 className="fw-bold mb-3">🏢 지점 검색</h5>

            <InputGroup className="mb-3">
                <Form.Control
                    placeholder="지점명을 입력하세요"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button variant="primary" onClick={handleSearch}>검색</Button>
            </InputGroup>
            <Table hover size="sm" responsive className="text-center">
                <thead className="table-light">
                <tr>
                    <th>번호</th> {/* 💡 ID 대신 번호로 텍스트 변경 */}
                    <th>지점명</th>
                    <th>주소</th>
                </tr>
                </thead>
                <tbody>
                {stores.length > 0 ? (
                    stores.map((store, index) => {
                        // 💡 번호 계산 공식: (현재페이지 - 1) * 페이지당개수 + 현재인덱스 + 1
                        const displayNo = (currentPage - 1) * itemsPerPage + index + 1;

                        return (
                            <tr key={store.storeId}
                                onClick={() => selectStore(store.storeId, store.storeNm)}
                                style={{ cursor: 'pointer' }}>

                                {/* 💡 계산된 순번 표시 */}
                                <td>{displayNo}</td>

                                <td className="text-start"><strong>{store.storeNm}</strong></td>
                                <td className="text-start"><small>{store.storeAddr}</small></td>
                            </tr>
                        );
                    })
                ) : (
                    <tr><td colSpan="3" className="py-5 text-center">검색 결과가 없습니다.</td></tr>
                )}
                </tbody>
            </Table>
            {/* 페이지네이션 UI */}
            {totalPages > 0 && (
                <div className="d-flex justify-content-center mt-3">
                    <Pagination size="sm">
                        {/* 페이지네이션 UI */}
                        {totalPages > 0 && (
                            <div className="d-flex justify-content-center mt-3">
                                <Pagination size="sm">
                                    {/* 맨 처음으로 */}
                                    <Pagination.First
                                        onClick={() => setCurrentPage(1)}
                                        disabled={currentPage === 1}
                                    />
                                    {/* 이전 그룹으로 (현재 그룹의 첫 페이지 - 1) */}
                                    <Pagination.Prev
                                        onClick={() => setCurrentPage(Math.max(startPage - 1, 1))}
                                        disabled={startPage === 1}
                                    />

                                    {/* 💡 미리 계산된 5개의 페이지 번호 (paginationItems) */}
                                    {paginationItems}

                                    {/* 다음 그룹으로 (현재 그룹의 마지막 페이지 + 1) */}
                                    <Pagination.Next
                                        onClick={() => setCurrentPage(Math.min(endPage + 1, totalPages))}
                                        disabled={endPage === totalPages}
                                    />
                                    {/* 맨 끝으로 */}
                                    <Pagination.Last
                                        onClick={() => setCurrentPage(totalPages)}
                                        disabled={currentPage === totalPages}
                                    />
                                </Pagination>
                            </div>
                        )}
                    </Pagination>
                </div>
            )}
        </div>
    );
};

export default StoreSearchPopup;