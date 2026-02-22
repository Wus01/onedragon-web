import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Table, InputGroup, Form, Button, Pagination } from 'react-bootstrap';

const StoreSearchPopup = () => {
    const [searchType, setSearchType] = useState("nm");
    const [keyword, setKeyword] = useState("");
    const [stores, setStores] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const itemsPerPage = 10;
    const pageGroupSize = 5;
    const API_BASE_URL = "http://localhost:8080/api/store";

    const fetchStores = useCallback(() => {
        axios.get(`${API_BASE_URL}/search`, {
            params: {
                page: currentPage,
                size: itemsPerPage,
                type: searchType,
                keyword: keyword
            }
        })
            .then(res => {
                const responseData = res.data.data;
                if (responseData) {
                    setStores(responseData.items || []);
                    setTotalCount(responseData.totalCount || 0);
                }
            })
            .catch(err => console.error("데이터 로드 실패:", err));
    }, [currentPage, keyword, searchType]);

    useEffect(() => {
        fetchStores();
    }, [currentPage]);

    const handleSearch = () => {
        setCurrentPage(1);
        fetchStores();
    };

    const selectStore = (id, nm) => {
        if (window.opener && !window.opener.closed) {
            window.opener.receiveStoreInfo(id, nm);
            window.close();
        }
    };

    // 페이지네이션 계산
    const totalPages = Math.ceil(totalCount / itemsPerPage);
    const currentGroup = Math.floor((currentPage - 1) / pageGroupSize);
    const startPage = currentGroup * pageGroupSize + 1;
    const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);

    const renderPaginationItems = () => {
        const items = [];
        for (let i = startPage; i <= endPage; i++) {
            items.push(
                <Pagination.Item key={i} active={i === currentPage} onClick={() => setCurrentPage(i)}>
                    {i}
                </Pagination.Item>
            );
        }
        return items;
    };

    return (
        <div className="p-3">
            <h5 className="fw-bold mb-3">🏢 지점 검색</h5>

            <InputGroup className="mb-3">
                {/* 💡 에러 방지를 위해 Form.Select 대신 기본 select 태그 사용 */}
                <select
                    className="form-select"
                    style={{ maxWidth: '100px' }}
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                >
                    <option value="nm">지점명</option>
                    <option value="addr">주소</option>
                </select>

                <Form.Control
                    placeholder={searchType === 'nm' ? "지점명을 입력하세요" : "주소를 입력하세요"}
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button variant="primary" onClick={handleSearch}>검색</Button>
            </InputGroup>

            <Table hover size="sm" responsive className="text-center align-middle">
                <thead className="table-light">
                <tr>
                    <th style={{ width: '10%' }}>번호</th>
                    <th style={{ width: '30%' }}>지점명</th>
                    <th>주소</th>
                </tr>
                </thead>
                <tbody>
                {stores.length > 0 ? (
                    stores.map((store, index) => (
                        <tr key={store.storeId || index}
                            onClick={() => selectStore(store.storeId, store.storeNm)}
                            style={{ cursor: 'pointer' }}>
                            <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                            <td className="text-start fw-bold">{store.storeNm}</td>
                            <td className="text-start"><small>{store.storeAddr}</small></td>
                        </tr>
                    ))
                ) : (
                    <tr><td colSpan="3" className="py-5 text-center text-muted">검색 결과가 없습니다.</td></tr>
                )}
                </tbody>
            </Table>

            {totalPages > 0 && (
                <div className="d-flex justify-content-center mt-3">
                    <Pagination size="sm">
                        <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                        <Pagination.Prev onClick={() => setCurrentPage(Math.max(startPage - 1, 1))} disabled={startPage === 1} />
                        {renderPaginationItems()}
                        <Pagination.Next onClick={() => setCurrentPage(Math.min(endPage + 1, totalPages))} disabled={endPage === totalPages} />
                        <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
                    </Pagination>
                </div>
            )}
        </div>
    );
};

export default StoreSearchPopup;