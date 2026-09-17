import React, { useCallback, useEffect, useState } from 'react';
import { Button, Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getHiringList } from '../../api/hiringBoardApi';
import CustModal from '../common/Modal';

interface HiringInfo {
  hiringTitle: string;
  hiringText: string;
  hiringNo: number;
  storeNm: string;
  rgstId: string;
  hiringStsNm: string;
  rgstDate: string;
  workStartDate: string;
  workEndDate: string;
  payPerHour?: string;
  serviceType?: string;
}

interface HiringResponse {
  content: HiringInfo[];
  totalPages?: number;
  totalElements?: number;
  size?: number;
  number?: number;
}

const HiringList: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [hiring, setHiring] = useState<HiringResponse>({ content: [] });
  const itemsPerPage = 10;

  const fetchHirings = useCallback(async (page: number, append = false) => {
    const validPage = Number.isNaN(Number(page)) || !page ? 1 : Number(page);

    try {
      const pageData = await getHiringList(validPage - 1, itemsPerPage) || {};
      const newContent = pageData.content || [];

      setHiring((previous) => append ? {
        ...pageData,
        content: [...(previous.content || []), ...newContent],
      } : pageData);
      setTotalPages(pageData.totalPages || 0);
    } catch (error) {
      console.error('공고를 불러오지 못했습니다.', error);
    }
  }, []);

  useEffect(() => {
    const checkSize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', checkSize);
    fetchHirings(1);

    return () => window.removeEventListener('resize', checkSize);
  }, [fetchHirings]);

  useEffect(() => {
    if (!isMobile && currentPage > 1) fetchHirings(currentPage);
  }, [currentPage, isMobile, fetchHirings]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (page === 1) fetchHirings(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    if (nextPage > totalPages) return;

    setCurrentPage(nextPage);
    fetchHirings(nextPage, true);
  };

  const handleSaved = () => {
    setCurrentPage(1);
    fetchHirings(1);
  };

  return (
    <div className="jobs-page">
      <section className="jobs-hero">
        <div className="jobs-hero-copy">
          <span className="section-eyebrow">LOCAL JOBS</span>
          <h1>
            내게 맞는 일자리,<br />
            가까운 곳에서 <span className="jobs-title-nowrap">찾아보세요.</span>
          </h1>
          <p>근무 일정과 지점을 한눈에 비교하고 간편하게 지원할 수 있어요.</p>
        </div>
        <button type="button" className="btn btn-primary jobs-create-button" onClick={() => setIsOpen(true)}>
          <i className="mdi mdi-plus" aria-hidden="true" />
          공고 등록하기
        </button>
        <div className="jobs-hero-decoration" aria-hidden="true">
          <span><i className="mdi mdi-briefcase-outline" /></span>
          <span><i className="mdi mdi-map-marker-outline" /></span>
          <span><i className="mdi mdi-clock-fast" /></span>
        </div>
      </section>

      <div className="jobs-toolbar">
        <div>
          <h2>최근 채용 공고</h2>
          <p><strong>{hiring.totalElements ?? hiring.content.length}</strong>개의 일자리를 확인해 보세요.</p>
        </div>
        <span className="jobs-update-label">
          <i className="mdi mdi-refresh" aria-hidden="true" /> 실시간 업데이트
        </span>
      </div>

      {hiring.content.length > 0 ? (
        <div className="job-card-grid">
          {hiring.content.map((item, index) => {
            const isConfirmed = item.hiringStsNm === '확정';
            const startDate = item.workStartDate?.substring(5, 16) || '일정 협의';
            const endDate = item.workEndDate?.substring(5, 16) || '협의';

            return (
              <Link to={`/hiring/${item.hiringNo}`} className="job-card" key={item.hiringNo || index}>
                <div className="job-card-topline">
                  <span className={`job-status ${isConfirmed ? 'is-closed' : 'is-open'}`}>
                    <span />{item.hiringStsNm || '모집중'}
                  </span>
                  <span className="job-number">NO. {item.hiringNo}</span>
                </div>

                <div className="job-store">
                  <span className="job-store-icon"><i className="mdi mdi-storefront-outline" /></span>
                  <span>{item.storeNm || '지점 정보 확인'}</span>
                </div>

                <h3>{item.hiringTitle}</h3>
                <p className="job-description">{item.hiringText || '상세 근무 내용은 공고에서 확인해 주세요.'}</p>

                <div className="job-meta-list">
                  <span>
                    <i className="mdi mdi-calendar-blank-outline" aria-hidden="true" />
                    {startDate} ~ {endDate}
                  </span>
                  <span>
                    <i className="mdi mdi-cash-multiple" aria-hidden="true" />
                    {item.payPerHour ? `${Number(item.payPerHour).toLocaleString()}원` : '급여 협의'}
                  </span>
                </div>

                <div className="job-card-footer">
                  <div>
                    <span className="job-writer-avatar">{(item.rgstId || '일').charAt(0).toUpperCase()}</span>
                    <span>
                      <strong>{item.rgstId || '일용이네'}</strong>
                      <small>{String(item.rgstDate || '').substring(0, 10)}</small>
                    </span>
                  </div>
                  <span className="job-detail-link">상세보기 <i className="mdi mdi-arrow-right" /></span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="jobs-empty">
          <span><i className="mdi mdi-briefcase-search-outline" /></span>
          <h3>아직 등록된 공고가 없어요.</h3>
          <p>첫 번째 일자리를 등록하고 좋은 인재를 만나보세요.</p>
          <button type="button" className="btn btn-primary" onClick={() => setIsOpen(true)}>공고 등록하기</button>
        </div>
      )}

      {isMobile ? (
        currentPage < totalPages && (
          <Button className="jobs-load-more" variant="outline-primary" onClick={handleLoadMore}>
            공고 더보기 <i className="mdi mdi-chevron-down" />
          </Button>
        )
      ) : (
        totalPages > 1 && (
          <Pagination className="jobs-pagination">
            <Pagination.Prev onClick={() => handlePageChange(Math.max(currentPage - 1, 1))} disabled={currentPage === 1} />
            {[...Array(totalPages)].map((_, index) => (
              <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => handlePageChange(index + 1)}>
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))} disabled={currentPage === totalPages} />
          </Pagination>
        )
      )}

      <CustModal
        open={isOpen}
        close={() => setIsOpen(false)}
        onSaveSuccess={handleSaved}
        header="새 채용 공고"
      />
    </div>
  );
};

export default HiringList;
