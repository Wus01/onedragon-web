import React, { useState, useEffect, useCallback } from 'react';
import {Pagination} from 'react-bootstrap';
import {useParams, Link, useHistory} from 'react-router-dom';

import CustModal from "../common/Modal";

import { Button } from 'react-bootstrap';
import {getHiringList} from "../../api/hiringBoardApi";

function HiringList(){
    const { id } = useParams();

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isClose, setIsClose] = useState<boolean>(false);
    const [header, setHeader] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPage] = useState<number>(0);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const history = useHistory();
    const itemsPerPage = 10;

    interface HiringInfo {
        hiringTitle: string;
        hiringText: string;
        hiringNo: number;
        storeNm: string;
        rgstId: string;
        hiringStsNm: string;
        rgstDate: string;
    }
    const [hiring,setHiring] = useState<HiringResponse>({
            // hiringTitle:"",
            // hiringText:"",
            // hiringNo: 0,
            // storeNm: "",
            // rgstId: "",
            // hiringStsNm: "",
            // rgstDate: ""
            content:[]
        });

    interface HiringResponse{
        content: HiringInfo[];
        totalPages?: number;
        totalElements?: number;
        size?: number;
        number?: number;
    }

    // 공고 리스트 호출
    const fetchHirings = useCallback(async (page: number, append:boolean =false) => {
        const validPage = isNaN(Number(page)) || !page ? 1 : Number(page);

        try{
                const pageData = await getHiringList(validPage -1, itemsPerPage) || {};

                const newContent = pageData.content || [];
                const total = pageData.totalPages || 0;

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
            } catch (err) {
                console.error("공고 로드 실패:", err);
            }
    }, []);

    // 1. 최초 렌더링 및 모바일/PC 화면 감지
    useEffect(() => {
        const checkSize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkSize();
        window.addEventListener('resize', checkSize);

        // 💡 화면에 처음 들어왔을 때 딱 한 번만 1페이지 데이터를 불러옵니다.
        fetchHirings(1, false);

        return () => window.removeEventListener('resize', checkSize);
    }, [fetchHirings]);

    // 2. 페이지 번호(currentPage)가 바뀔 때의 동작 (PC 전용)
    useEffect(() => {
        // 💡 모바일은 '더보기 버튼(handleLoadMore)'이 직접 데이터를 누적하므로 개입하지 않습니다.
        // 💡 PC 환경(isMobile === false)일 때만 페이지 번호에 맞춰 데이터를 새로 갈아끼웁니다.
        if (!isMobile) {
            fetchHirings(currentPage, false);
        }
    }, [currentPage, isMobile, fetchHirings]);

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
          <div className="page-header mb-3 mb-md-4 mt-2 mt-md-0 px-2 px-md-0 border-bottom pb-2 pb-md-3">
              {/* 💡 position-relative를 주고 최소 높이를 잡아주어 내부 요소들이 absolute로 떠 있어도 영역이 무너지지 않게 합니다. */}
              <div className="d-flex align-items-center w-100 position-relative" style={{ minHeight: '32px' }}>

                  {/* 💡 isMobile이 true면 화면 정중앙에 고정, false면 일반적인 좌측 정렬 */}
                  <h3
                      className="page-title fs-5 fs-md-3 fw-bold mb-0"
                      style={
                          isMobile
                              ? { position: 'absolute', left: '50%', transform: 'translateX(-50%)', margin: 0 }
                              : { textAlign: 'left' }
                      }
                  >
                      공고 리스트
                  </h3>

                  {/* 💡 모바일일 때만 우측 끝에 작성하기 버튼 배치 */}
                  {isMobile && (
                      <button
                          type="button"
                          className="btn btn-primary btn-sm px-3"
                          onClick={() => setIsOpen(true)}
                          style={{ position: 'absolute', right: '0' }}
                      >
                          작성하기
                      </button>
                  )}

              </div>
          </div>

          {/* 💡 삼항 연산자 시작 */}
          {isMobile ? (
              /* ================= [모바일 모드: 카드 형태로 주욱 나열] ================= */
              <div className="mobile-list-wrapper">
                  {hiring.content && hiring.content.length > 0 ? (
                      hiring.content.map((hiringItem, index) => (
                      <div key={hiringItem.hiringNo || index} className="card mb-3 p-3 shadow-sm" style={{borderRadius:'12px'}}>
                          <Link to={`/hiring/${hiringItem.hiringNo}`}>
                          <div className="fw-bold fs-5 mb-1">{hiringItem.hiringTitle}</div>
                          <div className="text-muted small mb-2">
                              {hiringItem.storeNm} | {hiringItem.rgstId} | {hiringItem.rgstDate ? String(hiringItem.rgstDate).substring(0, 10) : "-"} | {hiringItem.hiringStsNm}
                          </div>
                          </Link>
                      </div>
                  ))
                  ):(
                      <div className="text-center py-5 text-muted">
                          <div className="mb-2 fs-1">📂</div>
                          <p className="mb-0">등록된 공고가 없습니다.</p>
                      </div>
                  )}
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
                                              <tr key={item.hiringNo || index} style={{textAlign: 'center'}}>
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
                                              <td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>등록된 공고가 없습니다.</td>
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
              onSaveSuccess={()=> fetchHirings(1, false)}
              header="공고작성"
          />
      </div>
  );
    };

export default HiringList;