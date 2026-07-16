import React, { useState, useEffect, useCallback } from 'react';
import {Form, Pagination} from 'react-bootstrap';
import bsCustomFileInput from 'bs-custom-file-input';
// ProgressBar는 코드에서 사용되지 않아 제거 가능하지만, 원본에 따라 남겨둡니다.
import { ProgressBar } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import CustModal from "../common/Modal";
import {postHiring} from "../../api/hiringBoardApi";
import { Button } from 'react-bootstrap';


// export const  = () => {
function HiringList(){
    const { id } = useParams();

    const [isOpen, setIsOpen] = useState(false);
    const [isClose, setIsClose] = useState(false);
    const [header, setHeader] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPage] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    const itemsPerPage = 10;
    const [hiring,setHiring] = useState({
            hiringTitle:"",
            hiringText:""
        },[]);

    // 공고 리스트 호출
    // const fetchHirings = () => {
    //     axios.get(`${process.env.REACT_APP_API_URL}/hiring/getHirings`)
    //         .then(res => setHiring(res.data))
    //         .catch(err => console.error(err));
    // };
    const fetchHirings = useCallback((page, append = false) => {
        const validPage = isNaN(page) || !page ? 1 : page;

        axios.get(`${process.env.REACT_APP_API_URL}/hiring/getHirings`, {
            params: {
                page: validPage - 1,
                size: itemsPerPage
            }
        })
            .then(res => {
                const pageData = res.data || {};
                const newContent = pageData.content || [];
                const total = res.data.totalPages || 0;

                if (append) {
                    // 모바일 더보기 : 기존 목록 뒤에 새 데이터를 누적
                    setHiring(prev => ({
                        ...pageData,
                        content: [...(prev?.content || []), ...newContent]
                            }));
                } else {
                    // PC 페이징: 기존 데이터 '갈아끼우기'
                    setHiring(pageData);
                }
                setTotalPage(total);
            })
            .catch(err => {
                console.error("공고 로드 실패:", err);
            });
    }, []);

    useEffect(()=>{
        fetchHirings();

        const checkSize = () => {
            setIsMobile(window.innerWidth < 768); // 768px 미만이면 모바일로 판단
        };

        checkSize();
        window.addEventListener('resize', checkSize); //창 크기 바뀔 때마다 감지

        return ()=> window.removeEventListener('resize', checkSize); //청소
    }, []);

    useEffect(()=>{
        if(isMobile){
            // 모바일 모드일 때 : 처음에 리스트가 텅 비어있을 때만 첫 페이지를 조회해서 아래로 쌓아둔다.
            if(hiring.length === 0){
                fetchHirings(1, false);
            }
        }else{
            // PC 모드일 때: 페이지 번호(currentPage)가 바뀔 때마다 기존 데이터를 지우고 새로 갈아끼운다.
            fetchHirings(currentPage, false);
        }
    }, [currentPage, isMobile, fetchHirings, hiring.length]);


    const closeModalHandler = () => {
        setIsOpen(false);
    };

    const handleLoadMore = () =>{
        const nextPage = currentPage+1;
        if(nextPage <= totalPages){
            setCurrentPage(nextPage);
            fetchHirings(nextPage, true); // true를 넘겨서 데이터 누적시킴
        }
    };

  return (
      <div>
          <div className="page-header">
              <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="page-title">공고 리스트</h3>
              {isMobile ? (
                <div style={{textAlign:'right'}}>
                  <button type="button" className="btn btn-primary" onClick={() => setIsOpen(true)} style={{marginTop:'20px'}}>
                      작성하기
                  </button>
                </div>
              ): ('')}
              </div>
              <nav aria-label="breadcrumb"></nav>
          </div>
          {/* 💡 삼항 연산자 시작 */}
          {isMobile ? (
              /* ================= [모바일 모드: 카드 형태로 주욱 나열] ================= */
              <div className="mobile-list">
                  {hiring && hiring.content && hiring.content.map((hiringItem, index)=>(
                      <div key={hiringItem.hiringNo || index} className="card mb-3 p-3 shadow-sm" style={{borderRadius:'12px'}}>
                          <Link to={`/hiring/${hiringItem.hiringNo}`}>
                          <div className="fw-bold fs-5 mb-1">{hiringItem.hiringTitle}</div>
                          <div className="text-muted small mb-2">
                              {hiringItem.storeNm} | {hiringItem.rgstId} | {hiringItem.rgstDate ? String(hiringItem.rgstDate).substring(0, 10) : "-"} | {hiringItem.hiringStsNm}
                          </div>
                          </Link>
                      </div>
                  ))}
                  {/* 현재 페이지가 전체 페이지보다 작을 때만 더보기 버튼 노출 */}
                  {currentPage < totalPages && (
                      <div className="d-grid gap-2 mt-3 mb-5">
                          <Button variant="outline-primary" onClick={handleLoadMore}>
                              공고 더보기 👇
                          </Button>
                      </div>
                  )}
              </div>
          ) : (
              /* ================= [PC 모드] ================= */
              // 💡 두 개의 덩어리(테이블+모달)를 하나의 빈 태그(<></>)로 안전하게 묶어줍니다.
              <>
                  <div className="col-lg-12 grid-margin stretch-card">
                      <div className="card">
                          <div className="card-body">
                              <div className="table-responsive">
                                  <table className="table table-striped">
                                      <thead>
                                      <tr style={{textAlign: 'center'}}>
                                          <th>No</th>
                                          <th>지점명</th>
                                          <th>제목</th>
                                          <th>작성자</th>
                                          <th>공고확정여부</th>
                                          <th>등록일시</th>
                                      </tr>
                                      </thead>
                                      <tbody>
                                      {hiring && hiring.content && hiring.content.length > 0 ? (
                                          hiring.content.map((item, index) => (
                                              <tr key={item.id || index} style={{textAlign: 'center'}}>
                                                  <td>{item.hiringNo}</td>
                                                  <td>{item.storeNm}</td>
                                                  <td>
                                                      <Link to={`/hiring/${item.hiringNo}`} style={{ textDecoration: 'none', color: 'blue' }}>
                                                          {item.hiringTitle}
                                                      </Link>
                                                  </td>
                                                  <td>{item.rgstId}</td>
                                                  <td>{item.hiringStsNm}</td>
                                                  <td>{String(item.rgstDate).substring(0,19)}</td>
                                              </tr>
                                          ))
                                      ) : (
                                          <tr>
                                              <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>등록된 공고가 없습니다.</td>
                                          </tr>
                                      )}
                                      </tbody>
                                  </table>
                                  {/* PC에서만 하단 하이라이트 페이징 바 노출 */}
                                  {totalPages > 0 && (
                                      <div className="d-flex justify-content-center mt-4">
                                          <Pagination size="sm">
                                              <Pagination.Prev onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} />
                                              {[...Array(totalPages)].map((_, i) => (
                                                  <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => setCurrentPage(i + 1)}>
                                                      {i + 1}
                                                  </Pagination.Item>
                                              ))}
                                              <Pagination.Next onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} />
                                          </Pagination>
                                      </div>
                                  )}
                                  <div style={{textAlign:'right'}}>
                                      <button type="button" className="btn btn-primary" onClick={() => setIsOpen(true)} style={{marginTop:'20px'}}>
                                          작성하기
                                      </button>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>


              </>
          )}
          {/* 💡 삼항 연산자 깔끔하게 종료! */}
          <CustModal
              open={isOpen}
              close={closeModalHandler}
              onSaveSuccess={fetchHirings}
              header="공고작성"
          />
      </div>
  );
    };

export default HiringList;