import React, {useEffect, useState} from 'react';
import {Modal as BootstrapModal} from 'react-bootstrap';
import dayjs, {Dayjs} from 'dayjs';
import {postHiring} from '../../api/hiringBoardApi';
import StoreSearchPopup from '../form-elements/StoreSearchPopup';
import CustomDatePicker from './Datepicker';

interface CustModalProps {
  open: boolean;
  close: () => void;
  header: string;
  onSaveSuccess?: () => void;
}

const CustModal: React.FC<CustModalProps> = ({open, close, header, onSaveSuccess}) => {
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);
  const [storeName, setStoreName] = useState('');
  const [selectedStartDate, setSelectedStartDate] = useState<Date | Dayjs | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | Dayjs | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isNegotiable, setIsNegotiable] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showStoreSearch, setShowStoreSearch] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    const scrollY = window.scrollY;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !showStoreSearch) close();
    };

    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEscape);
      window.scrollTo(0, scrollY);
    };
  }, [open, showStoreSearch, close]);

  const handleStartDateChange = (date: Date | Dayjs | null) => {
    setSelectedStartDate(date);
    setStartDate(date ? dayjs(date).format('YYYY-MM-DD HH:mm') : '');
  };

  const handleEndDateChange = (date: Date | Dayjs | null) => {
    setSelectedEndDate(date);
    setEndDate(date ? dayjs(date).format('YYYY-MM-DD HH:mm') : '');
  };

  const handleSelectStore = (id: number, name: string) => {
    setSelectedStoreId(id);
    setStoreName(name);
    setShowStoreSearch(false);
  };

  const resetForm = () => {
    setSelectedStoreId(null);
    setStoreName('');
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    setStartDate('');
    setEndDate('');
    setIsNegotiable(true);
    setTitle('');
    setDescription('');
  };

  const saveHiring = async () => {
    if (!selectedStoreId) {
      alert('근무 지점을 선택해 주세요.');
      return;
    }
    if (!startDate || !endDate) {
      alert('근무 시작일과 종료일을 모두 선택해 주세요.');
      return;
    }
    if (dayjs(endDate).isBefore(dayjs(startDate))) {
      alert('종료일은 시작일보다 빠를 수 없습니다.');
      return;
    }
    if (!title.trim()) {
      alert('공고 제목을 입력해 주세요.');
      return;
    }
    if (!description.trim()) {
      alert('공고 내용을 입력해 주세요.');
      return;
    }

    setIsSaving(true);
    try {
      const response = await postHiring({
        storeInfo: {storeId: selectedStoreId},
        hiringSts: '01',
        serviceType: '편의점',
        workStartDate: startDate,
        workEndDate: endDate,
        negotiableYn: isNegotiable ? 'Y' : 'N',
        hiringTitle: title.trim(),
        hiringText: description.trim(),
        payPerHour: 8
      });

      if (!response || (response.status !== 200 && response.status !== 201)) {
        throw new Error('공고 등록 응답이 올바르지 않습니다.');
      }

      alert('공고가 성공적으로 등록되었습니다.');
      onSaveSuccess?.();
      resetForm();
      close();
    } catch (error) {
      console.error('공고 등록에 실패했습니다.', error);
      alert('등록에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div
        className={`hiring-modal-overlay ${open ? 'is-open' : ''}`}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        {open && (
          <section
            className="hiring-modal-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="hiring-modal-title"
          >
            <header className="hiring-modal-header">
              <div className="hiring-modal-heading">
                <span className="hiring-modal-heading-icon" aria-hidden="true">
                  <i className="mdi mdi-briefcase-plus" />
                </span>
                <div>
                  <span className="hiring-modal-eyebrow">NEW OPENING</span>
                  <h2 id="hiring-modal-title">{header}</h2>
                  <p>필요한 근무 조건을 입력하고 우리 동네 인재를 만나보세요.</p>
                </div>
              </div>
              <button className="hiring-modal-close" type="button" aria-label="팝업 닫기" onClick={close}>
                <i className="mdi mdi-close" aria-hidden="true" />
              </button>
            </header>

            <form onSubmit={(event) => { event.preventDefault(); saveHiring(); }}>
              <main className="hiring-modal-body">
                <div className="hiring-modal-progress" aria-label="공고 작성 순서">
                  <span className={selectedStoreId ? 'is-complete' : 'is-current'}><b>1</b> 지점 선택</span>
                  <i className="mdi mdi-chevron-right" aria-hidden="true" />
                  <span className={startDate && endDate ? 'is-complete' : selectedStoreId ? 'is-current' : ''}><b>2</b> 근무 일정</span>
                  <i className="mdi mdi-chevron-right" aria-hidden="true" />
                  <span className={title && description ? 'is-complete' : startDate && endDate ? 'is-current' : ''}><b>3</b> 공고 내용</span>
                </div>

                <section className="hiring-form-section">
                  <div className="hiring-form-section-title">
                    <span>01</span>
                    <div>
                      <h3>어디에서 근무하나요?</h3>
                      <p>채용을 진행할 지점을 선택해 주세요.</p>
                    </div>
                  </div>
                  <button
                    className={`hiring-store-selector ${storeName ? 'has-value' : ''}`}
                    type="button"
                    onClick={() => setShowStoreSearch(true)}
                  >
                    <span className="hiring-store-selector-icon"><i className="mdi mdi-store" /></span>
                    <span className="hiring-store-selector-copy">
                      <strong>{storeName || '근무 지점을 검색해 주세요'}</strong>
                      <small>{storeName ? '선택된 지점' : '등록된 지점 목록에서 선택할 수 있어요.'}</small>
                    </span>
                    <span className="hiring-store-search-action">
                      <i className="mdi mdi-magnify" />검색
                    </span>
                  </button>
                </section>

                <section className="hiring-form-section">
                  <div className="hiring-form-section-title">
                    <span>02</span>
                    <div>
                      <h3>근무 일정을 알려주세요.</h3>
                      <p>시작과 종료 날짜 및 시간을 선택해 주세요.</p>
                    </div>
                  </div>
                  <div className="hiring-date-grid">
                    <label className="hiring-date-field">
                      <span><i className="mdi mdi-calendar" />시작 일시</span>
                      <CustomDatePicker
                        selectedDate={selectedStartDate}
                        onChange={handleStartDateChange}
                        placeholder="시작일자 및 시간"
                      />
                    </label>
                    <span className="hiring-date-divider" aria-hidden="true"><i className="mdi mdi-arrow-right" /></span>
                    <label className="hiring-date-field">
                      <span><i className="mdi mdi-calendar" />종료 일시</span>
                      <CustomDatePicker
                        selectedDate={selectedEndDate}
                        onChange={handleEndDateChange}
                        placeholder="종료일자 및 시간"
                        placement="bottom-end"
                        minDate={selectedStartDate ? dayjs(selectedStartDate).toDate() : undefined}
                      />
                    </label>
                  </div>
                  <label className="hiring-negotiable-option">
                    <input
                      type="checkbox"
                      checked={isNegotiable}
                      onChange={(event) => setIsNegotiable(event.target.checked)}
                    />
                    <span className="hiring-checkmark"><i className="mdi mdi-check" /></span>
                    <span>
                      <strong>근무 일정 협의 가능</strong>
                      <small>지원자와 세부 일정을 조율할 수 있어요.</small>
                    </span>
                  </label>
                </section>

                <section className="hiring-form-section">
                  <div className="hiring-form-section-title">
                    <span>03</span>
                    <div>
                      <h3>공고 내용을 작성해 주세요.</h3>
                      <p>지원자가 빠르게 이해할 수 있도록 구체적으로 작성해 주세요.</p>
                    </div>
                  </div>
                  <label className="hiring-text-field">
                    <span>공고 제목 <b>{title.length}/60</b></span>
                    <input
                      className="form-control"
                      type="text"
                      value={title}
                      maxLength={60}
                      onChange={(event) => setTitle(event.target.value)}
                      placeholder="예: 중앙점 평일 저녁 근무자 모집"
                    />
                  </label>
                  <label className="hiring-text-field">
                    <span>상세 내용 <b>{description.length}/500</b></span>
                    <textarea
                      className="form-control"
                      value={description}
                      maxLength={500}
                      onChange={(event) => setDescription(event.target.value)}
                      placeholder="담당 업무, 근무 환경, 원하는 인재상 등을 알려주세요."
                    />
                  </label>
                </section>

                <div className="hiring-form-tip">
                  <i className="mdi mdi-lightbulb-on-outline" aria-hidden="true" />
                  <p><strong>작성 팁</strong> 구체적인 근무 시간과 업무 내용을 적으면 적합한 지원자를 더 빨리 만날 수 있어요.</p>
                </div>
              </main>

              <footer className="hiring-modal-footer">
                <button className="hiring-modal-cancel" type="button" onClick={close}>취소</button>
                <button className="hiring-modal-submit" type="submit" disabled={isSaving}>
                  {isSaving ? <><span className="hiring-submit-spinner" />등록 중...</> : <><i className="mdi mdi-check" />공고 등록하기</>}
                </button>
              </footer>
            </form>
          </section>
        )}
      </div>

      <BootstrapModal
        show={showStoreSearch}
        onHide={() => setShowStoreSearch(false)}
        centered
        dialogClassName="custom-modal-size store-search-modal"
        scrollable
        style={{zIndex: 1060}}
      >
        <BootstrapModal.Header closeButton>
          <BootstrapModal.Title><i className="mdi mdi-store-search-outline" />근무 지점 검색</BootstrapModal.Title>
        </BootstrapModal.Header>
        <BootstrapModal.Body>
          <StoreSearchPopup onSelectStore={handleSelectStore} />
        </BootstrapModal.Body>
      </BootstrapModal>
    </>
  );
};

export default CustModal;
