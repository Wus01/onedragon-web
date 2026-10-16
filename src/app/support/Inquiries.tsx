import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { createInquiry, getMyInquiries, InquiryPage } from '../../api/inquiryApi';

const questions = [
  {
    title: '회원 정보는 어디에서 수정하나요?',
    answer: '마이페이지의 정보 수정 버튼에서 이메일, 연락처 등 회원 정보를 변경할 수 있습니다.',
    path: '/mypageHome',
    linkLabel: '마이페이지로 이동',
  },
  {
    title: '근무 경력은 어떻게 등록하나요?',
    answer: '경력 등록 메뉴에서 근무한 점포와 기간 등 경력 정보를 입력해 주세요. 등록된 경력은 마이페이지에서 확인할 수 있습니다.',
    path: '/crrHstrCreate',
    linkLabel: '경력 등록으로 이동',
  },
  {
    title: '사이트 데이터를 삭제했더니 로그인이 풀렸어요.',
    answer: '사이트 데이터를 삭제하면 저장된 로그인 정보도 삭제됩니다. 로그인 화면에서 아이디와 비밀번호를 입력해 다시 로그인해 주세요.',
  },
];

const Inquiries: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const [submitError, setSubmitError] = useState('');
  const [success, setSuccess] = useState('');
  const [page, setPage] = useState(0);
  const [refresh, setRefresh] = useState(0);
  const [inquiries, setInquiries] = useState<InquiryPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [listError, setListError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setListError('');
    getMyInquiries(page)
      .then((result) => { if (!cancelled) setInquiries(result); })
      .catch(() => { if (!cancelled) setListError('문의 내역을 불러오지 못했습니다. 다시 시도해 주세요.'); })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, [page, refresh]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submittingRef.current) return;
    setSubmitError('');
    setSuccess('');
    if (!title.trim() || !content.trim()) {
      setSubmitError('제목과 내용을 모두 입력해 주세요.');
      return;
    }
    submittingRef.current = true;
    setIsSubmitting(true);
    try {
      const saved = await createInquiry(title, content);
      setTitle('');
      setContent('');
      setSuccess(`문의가 접수되었습니다. (접수번호: ${saved.inquiryNo})`);
      setPage(0);
      setRefresh((value) => value + 1);
    } catch (error: any) {
      const message = error.response?.status === 400 ? error.response?.data?.message : null;
      setSubmitError(message || '문의를 접수하지 못했습니다. 입력 내용은 유지되니 다시 시도해 주세요.');
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
  <main className="inquiries-page">
    <section className="inquiries-hero" aria-labelledby="inquiries-title">
      <div>
        <span className="inquiries-eyebrow">HELP & SUPPORT</span>
        <h1 id="inquiries-title">무엇이 궁금하신가요?</h1>
        <p>일용이네 이용 중 궁금한 점을 확인해 보세요.</p>
      </div>
      <span className="inquiries-hero-icon" aria-hidden="true">
        <i className="mdi mdi-comment-question-outline" />
      </span>
    </section>

    <section className="inquiries-card" aria-labelledby="inquiries-faq-title">
      <div className="inquiries-section-heading">
        <span className="inquiries-section-icon" aria-hidden="true">
          <i className="mdi mdi-help-circle-outline" />
        </span>
        <div>
          <h2 id="inquiries-faq-title">문의사항</h2>
          <p>자주 묻는 질문을 먼저 확인해 보세요.</p>
        </div>
      </div>
      <div className="inquiries-faq-list">
        {questions.map((question) => (
          <details className="inquiries-faq" key={question.title}>
            <summary>
              <span>{question.title}</span>
              <i className="mdi mdi-chevron-down" aria-hidden="true" />
            </summary>
            <div className="inquiries-answer">
              <p>{question.answer}</p>
              {question.path && <Link to={question.path}>{question.linkLabel} →</Link>}
            </div>
          </details>
        ))}
      </div>
    </section>

    <section className="inquiries-card" aria-labelledby="inquiries-compose-title">
      <div className="inquiries-section-heading">
        <span className="inquiries-section-icon" aria-hidden="true"><i className="mdi mdi-comment-question-outline" /></span>
        <div>
          <h2 id="inquiries-compose-title">1:1 문의하기</h2>
          <p>문의 내용은 작성자 본인만 확인할 수 있습니다.</p>
        </div>
      </div>
      <form className="inquiries-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="inquiry-title">제목</label>
          <input id="inquiry-title" className="form-control" value={title}
            onChange={(event) => setTitle(event.target.value)} required maxLength={100}
            placeholder="문의 제목을 입력해 주세요" disabled={isSubmitting} />
          <span className="inquiries-character-count">{title.length} / 100</span>
        </div>
        <div>
          <label htmlFor="inquiry-content">문의 내용</label>
          <textarea id="inquiry-content" className="form-control" value={content}
            onChange={(event) => setContent(event.target.value)} required maxLength={5000} rows={7}
            aria-describedby="inquiry-content-help" disabled={isSubmitting}
            placeholder="어떤 점이 궁금하신가요? 문제가 발생한 화면과 상황을 자세히 알려주세요." />
          <span className="inquiries-character-count">{content.length} / 5,000</span>
          <p id="inquiry-content-help" className="inquiries-form-help">비밀번호 등 민감한 정보는 입력하지 마세요.</p>
        </div>
        {submitError && <p className="inquiries-feedback is-error" role="alert">{submitError}</p>}
        {success && <p className="inquiries-feedback" role="status">{success}</p>}
        <div className="inquiries-form-actions">
          <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? '접수 중...' : '문의 접수하기'}
          </button>
        </div>
      </form>
    </section>

    <section className="inquiries-card" aria-labelledby="inquiries-history-title" aria-busy={isLoading}>
      <div className="inquiries-section-heading">
        <span className="inquiries-section-icon" aria-hidden="true"><i className="mdi mdi-format-list-bulleted" /></span>
        <div>
          <h2 id="inquiries-history-title">내 문의 내역</h2>
          <p>접수한 문의를 최신순으로 확인할 수 있습니다.</p>
        </div>
      </div>
      {isLoading ? <p role="status">문의 내역을 불러오고 있어요.</p> : listError ? (
        <div className="inquiries-list-message">
          <p role="alert">{listError}</p>
          <button type="button" className="btn btn-outline-primary" onClick={() => setRefresh((value) => value + 1)}>다시 불러오기</button>
        </div>
      ) : !inquiries?.items.length ? (
        <p className="inquiries-list-message">아직 접수한 문의가 없습니다. 궁금한 점을 남겨 주세요.</p>
      ) : (
        <>
          <p className="inquiries-form-help">총 {inquiries.totalElements}건 · 제목을 누르면 내용을 확인할 수 있습니다.</p>
          {inquiries.items.map((inquiry) => (
            <details className="inquiries-history-item" key={inquiry.inquiryNo}>
              <summary>
                <span className="inquiries-receipt-badge">접수 완료</span>
                <strong>{inquiry.title}</strong>
                <time dateTime={inquiry.createdAt}>{new Date(inquiry.createdAt).toLocaleString('ko-KR')}</time>
              </summary>
              <div className="inquiries-history-content">
                <small>접수번호: {inquiry.inquiryNo}</small>
                <p>{inquiry.content}</p>
              </div>
            </details>
          ))}
          {inquiries.totalPages > 1 && (
            <nav className="inquiries-pagination" aria-label="문의 내역 페이지">
              <button type="button" className="btn btn-outline-primary" disabled={page === 0}
                onClick={() => setPage((value) => value - 1)}>이전</button>
              <span>{inquiries.page + 1} / {inquiries.totalPages}</span>
              <button type="button" className="btn btn-outline-primary" disabled={page >= inquiries.totalPages - 1}
                onClick={() => setPage((value) => value + 1)}>다음</button>
            </nav>
          )}
        </>
      )}
    </section>

    <aside className="inquiries-notice">
      <i className="mdi mdi-information-outline" aria-hidden="true" />
      <div>
        <strong>문의 전 확인해 주세요</strong>
        <p>문제가 발생한 화면과 상황을 정리해 두면 도움이 됩니다. 비밀번호 등 민감한 정보는 공유하지 마세요.</p>
      </div>
    </aside>
  </main>
  );
};

export default Inquiries;
