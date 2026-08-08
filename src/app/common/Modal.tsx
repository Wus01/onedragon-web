import React, {useEffect, useReducer, useRef, useState} from 'react';
import CustomDatePicker from './Datepicker';
import { ko } from 'date-fns/locale';
import styled from '@emotion/styled';
import '../../assets/css/modal.css';
import dayjs, {Dayjs} from 'dayjs';
import { postHiring } from '../../api/hiringBoardApi';
import {useHistory} from "react-router-dom";
import {Form, InputGroup, Modal} from "react-bootstrap";
import StoreSearchPopup from "../form-elements/StoreSearchPopup";

interface CustModalProps {
  open: boolean;
  close: ()=> void;
  header: string;
  onSaveSuccess?: () => void;
}
const CustModal = (props: CustModalProps) => {
  // 열기, 닫기, 모달 헤더 텍스트를 부모로부터 받아옴
  const { open, close, header, onSaveSuccess} = props;
  const [selectedStoreId, setSelectedStoreId] = useState<number|null>(null);
  const [storeName, setStoreName] = useState("");

  // const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   setSelectedStoreId(e.target.value);
  // };

  // 지점, 업무, 협의여부, 긴급성, 제목, 내용
  const [store, setStore] = useState("");
  const [serviceTp, setServiceTp] = useState("편의점");
  const [negotiYn, setNegotiYn] = useState(true);
  const [isChecked, setIsChecked] = useState(true);  // 협의 체크 데이터
  const [urgencyYn, setUrgencyYn] = useState("일반");
  const [hiringTitle, setHiringTitle] = useState("");
  const [hiringText, setHiringText] = useState("");

  const [title, setTitle] = useState("")
  const [text, setText] = useState("")
  
  // 1. State 선언 (타입 지정 부분 삭제)
  const [selectedStartDate, setSelectedStartDate] = useState<Date | Dayjs | null>(null);
  const [startDate, setStartDate] = useState<string | undefined>(undefined);

  const [selectedEndDate, setSelectedEndDate] = useState<Date | Dayjs | null>(null);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);

  const [dateBtn, setDateBtn] = useState('전체');
  const [isDateDisabled, setIsDateDisabled] = useState(false);

  // const [storeId, setStoreId] = useState<number|null>(null);
  const [status, setStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  // 💡 01(인증대기) 상태가 아닐 경우 읽기 전용 처리
  // const isReadOnly = status !== '01';



  const openStoreSearch = () => {
    setShowModal(true);
  };


  // 2. 시작 날짜 변경 핸들러
  const handleStartDateChange = (date: Date | Dayjs | null) => {
    setDateBtn('');
    if (date) {
      setSelectedStartDate(date);
      setStartDate(dayjs(date).format('YYYY-MM-DD HH:mm')); // String()으로 감싸지 않아도 format은 문자열을 반환합니다.
    }
  };

  // 3. 종료 날짜 변경 핸들러
  const handleEndDateChange = (date: Date | Dayjs | null) => {
    setDateBtn('');
    if (date) {
      setSelectedEndDate(date);
      setEndDate(dayjs(date).format('YYYY-MM-DD HH:mm'));
    }
  };

  // 업무 변경
  const handleWorkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setServiceTp(value);
    // console.log("선택된 업무 = ",value);

  }

  // 협의가능 변경
  const handleNegotiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log("event === ",e.target.checked)
    setIsChecked(e.target.checked);

  }

  // 긴급성 변경
  const handleUrgencyYnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrgencyYn(value);
  }

  // 제목 변경
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitle(value);
  }

  // 내용 변경
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setText(value);
  }

  // 데이터 리프레시
  useEffect(()=> {
    // setStore(selectedStoreId);
    setNegotiYn(isChecked);
    setHiringTitle(title);
    setHiringText(text);

    // 모달 띄울 때 부모화면 스크롤 방지
    if(open){
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';

    return () => {
      // 3. 모달 닫힐 때 원래 스타일 복원 및 스크롤 위치 복구
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      window.scrollTo(0, scrollY);
    };
    };
  }, [open]);

  const history = useHistory();

  // 공고 저장
    const saveHiring = async () => {

    console.log("지점 -- ", selectedStoreId);
    console.log("업종 -- ",serviceTp);
    console.log("시작일자 -- ", startDate);
    console.log("종료일자 -- ", endDate);
    console.log("협의가능 -- ",negotiYn);
    console.log("제목 -- ",title);
    console.log("내용 -- ",text);
    console.log("긴급성 -- ",urgencyYn);

    const hiringData ={
      storeInfo: {
        storeId: selectedStoreId // 현재 선택된 가게의 ID
      },
      hiringSts: '01', // 01 : 미확정, 02 : 확정
      serviceType: serviceTp,
      workStartDate: startDate || "",
      workEndDate: endDate || "",
      negotiableYn: negotiYn === true ? "Y" as const : "N" as const ,
      hiringTitle: title,
      hiringText: text,
      payPerHour: 8
    }
    try{
      const response = await postHiring(hiringData);

      if(response && (response.status === 200 || response.status === 201)){
        alert("공고가 성공적으로 등록되었습니다.");
        if (onSaveSuccess) onSaveSuccess();
        resetForm();
        close();
      }else{
        throw new Error("서버 응답 이상");
      }
    }catch(e){
      alert("등록에 실패하였습니다.");
      console.error(e);
    }
  }

  // 점포 등록 개수에 따라 달라지게 !!
  // const list = [{value:'3',name:'석호중앙점'}, {value:'4', name:'고잔중앙점'}];
  //
  // // 지점 리스트가 1개일 경우엔 자동 세팅되도록
  // useEffect(() => {
  //   if (list && list.length === 1) {
  //     setStore(list[0].value);
  //   }
  // }, [list]); // list가 변경될 때마다 체크

  // 💡 팝업에서 지점을 선택했을 때 실행될 함수
  const handleSelectStore = (id: number, nm: string) => {
    console.log("지점 선택 store_id: "+id);
    setSelectedStoreId(id);
    setStoreName(nm);

    setShowModal(false);
  };


  // 작성 후 초기화
  const resetForm = () => {
    setSelectedStoreId(null);
    setNegotiYn(true);
    setTitle("");
    setText("");
    setSelectedStartDate(null);
    setSelectedEndDate(null);


    setStoreName("");

  };
  return (
    // 모달이 열릴때 openModal 클래스가 생성된다.
    <div className={open ? 'openModal modal' : 'modal'}>
      {open ? (
        <section style={{
          marginTop: '60px',
          maxHeight: '80vh',        /* ⭐️ 모달 전체 높이가 화면 높이의 85%를 넘지 않게 고정 */
          maxWidth: '500px',        /* 모바일/PC 모두 적절한 최대 너비 */
          width: '90%',             /* 모바일에서는 화면 너비의 90% 차치 */
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '12px',
          overflow: 'hidden'

        }}>
          <header>
            {header}
            <button className="close" onClick={close}>
              &times;
            </button>
          </header>
          {/* <main>{props.children}</main> */}
          <main style={{
            flex: 1,
            overflowY: 'auto',      /* ⭐️ 내용이 길면 main 안에서만 스크롤! */
            padding: '15px'
          }}>
            <div className="row mb-3 align-items-center text-nowrap">
              {/* 💡 col-sm-3 대신 col-3 (또는 col-4)을 쓰면 모바일에서도 줄바꿈 없이 비율을 유지합니다 */}
              <label className="col-3 col-sm-2 fw-bold">지점명</label>

              <div className="col-9 col-sm-10">
                {/* 💡 input-group: 인풋과 버튼을 한 덩어리로 예쁘게 붙여줍니다! */}
                <div className="input-group">
                  <input
                      type="text"
                      className="form-control" // 👈 부트스트랩 기본 인풋 폼 스타일
                      placeholder="지점을 검색하세요"
                      value={storeName || ""}
                      readOnly
                      onClick={openStoreSearch}
                      style={{
                        cursor: 'pointer',
                        backgroundColor: '#fff',
                        color: '#495057'
                      }}
                  />
                  <button
                      className="btn btn-outline-secondary" // 👈 버튼 테두리 스타일
                      type="button"
                      onClick={openStoreSearch}
                  >
                    🔍
                  </button>
                </div>
              </div>
            </div>
            {/* 1. 업무 (라디오 버튼) : 일단 편의점만이니까 지워봄*/}
            {/*<div className="row mb-3 align-items-center">*/}
            {/*  /!* 왼쪽 라벨 *!/*/}
            {/*  <label className="col-3 col-sm-2 fw-bold mb-0">업무</label>*/}

            {/*  <div className="col-9 col-sm-10">*/}
            {/*    /!* 💡 form-check-inline: 라디오 버튼들을 가로로 예쁘게 배치해주는 부트스트랩 공식 클래스 *!/*/}
            {/*    /!* 💡 me-4 (margin-end-4): '편의점'과 다음 '카페' 라디오 버튼 사이를 시원하게 띄워줍니다 *!/*/}
            {/*    <div className="form-check form-check-inline me-4">*/}
            {/*      <input*/}
            {/*          className="form-check-input"*/}
            {/*          type="radio"*/}
            {/*          value="편의점"*/}
            {/*          name="업무"*/}
            {/*          id="workConvenience"*/}
            {/*          checked={serviceTp === "편의점"}*/}
            {/*          onChange={handleWorkChange}*/}
            {/*      />*/}
            {/*      <label className="form-check-label" htmlFor="workConvenience">*/}
            {/*        편의점*/}
            {/*      </label>*/}
            {/*    </div>*/}

            {/*    <div className="form-check form-check-inline">*/}
            {/*      <input*/}
            {/*          className="form-check-input"*/}
            {/*          type="radio"*/}
            {/*          value="카페"*/}
            {/*          name="업무"*/}
            {/*          id="workCafe"*/}
            {/*          checked={serviceTp === "카페"}*/}
            {/*          onChange={handleWorkChange}*/}
            {/*      />*/}
            {/*      <label className="form-check-label" htmlFor="workCafe">*/}
            {/*        카페*/}
            {/*      </label>*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*</div>*/}

            {/* 2. 근무 일자 (데이트 피커 + 체크박스) */}
            <div className="row mb-3 align-items-center">
              <label className="col-3 col-sm-2 fw-bold mb-0">
                근무<br />일시
              </label>
              <div className="col-9 col-sm-10">

                <div className="d-flex align-items-center flex-wrap gap-2">

                  {/* 💡 겉 껍데기(div) 테두리는 지웠습니다! */}
                  <div>
                    <CustomDatePicker
                        selectedDate={selectedStartDate}
                        onChange={(date) => handleStartDateChange(date)}
                        placeholder="시작일자 및 시간"
                    />
                  </div>

                  {/* 💡 text-secondary를 제거해서 완전 진한 색(기본 검정)으로 눈에 확 띄게 바꿨습니다. mx-1로 양옆 여백도 살짝 줬습니다. */}
                  <span className="fw-bold mx-1">~</span>

                  <div>
                    <CustomDatePicker
                        selectedDate={selectedEndDate}
                        onChange={(date) => handleEndDateChange(date)}
                        placeholder="종료일자 및 시간"
                        placement="bottom-end"
                    />
                  </div>

                </div>

                {/* 협의가능 체크박스 */}
                <div className="mt-2">
                  <label className="d-flex align-items-center mb-0 text-muted" style={{ fontSize: '14px', cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={handleNegotiChange}
                        style={{ marginRight: '6px' }}
                    />
                    협의가능
                  </label>
                </div>

              </div>
            </div>

            {/* 3. 긴급성 (라디오 버튼) : 어차피 다 급할거같아서 일단 지워봄 */}
            {/*<div className="row mb-3 align-items-center">*/}
            {/*  <label className="col-3 col-sm-2 fw-bold">긴급성</label>*/}
            {/*  <div className="col-9 col-sm-10 d-flex gap-3">*/}
            {/*    <div className="form-check mb-0">*/}
            {/*      <input className="form-check-input" type="radio" value="일반" name="긴급성" id="urgencyNormal" checked={urgencyYn === "일반"} onChange={handleUrgencyYnChange} />*/}
            {/*      <label className="form-check-label" htmlFor="urgencyNormal">일반</label>*/}
            {/*    </div>*/}
            {/*    <div className="form-check mb-0">*/}
            {/*      <input className="form-check-input" type="radio" value="급구" name="긴급성" id="urgencyUrgent" checked={urgencyYn === "급구"} onChange={handleUrgencyYnChange} />*/}
            {/*      <label className="form-check-label" htmlFor="urgencyUrgent">급구</label>*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*</div>*/}

            {/*/!* 4. 제목 (입력창) *!/*/}
            <div className="row mb-3 align-items-center">
              {/* 입력창과 라벨 높이를 맞추기 위해 pt-1(padding-top) 추가 */}
              <label className="col-3 col-sm-2 fw-bold pt-1">제목</label>
              <div className="col-9 col-sm-10">
                {/* height: 30인 textarea는 사실 input text와 같으므로 깔끔하게 input으로 변경했습니다 */}
                <input
                    type="text"
                    className="form-control"
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="지점 + 업무 + 주/야간 + 긴급성"
                />
              </div>
            </div>

            {/* 5. 내용 (텍스트 에어리어) */}
            <div className="row mb-3">
              {/* 여기는 textarea가 크니까 수직 중앙 정렬(align-items-center)을 빼서 라벨이 위로 붙게 했습니다 */}
              <label className="col-3 col-sm-2 fw-bold pt-2">내용</label>
              <div className="col-9 col-sm-10">
    <textarea
        className="form-control"
        style={{ height: '150px' }}
        value={text}
        onChange={handleTextChange}
        placeholder="업무 내용 및 원하는 인재상"
    />
              </div>
            </div>


            {/*<div className="row mb-3 align-items-center">*/}
            {/*  <label className="col-sm-3 fw-bold" style={{margin:15}}>지점명</label>*/}
            {/*  <div className="col-sm-6" >*/}
            {/*      <input*/}
            {/*          type="text"*/}
            {/*          placeholder="지점을 검색하세요"*/}
            {/*          value={storeName|| ""}*/}
            {/*          readOnly*/}
            {/*          // 💡 '01' 상태일 때만 클릭 시 팝업이 뜨도록 설정합니다.*/}
            {/*          onClick={ openStoreSearch }*/}
            {/*          style={{*/}
            {/*            // 💡 클릭 가능 여부에 따라 커서 모양 변경*/}
            {/*            cursor: 'pointer',*/}
            {/*            // 💡 상태가 '01'이면 흰색(#fff), 아니면 부트스트랩 기본 회색(#e9ecef)*/}
            {/*            backgroundColor: '#fff',*/}
            {/*            // 💡 disabled 속성을 제거했으므로 글자색이 흐려지지 않습니다.*/}
            {/*            color: '#495057',*/}
            {/*            marginLeft: '-65px'*/}
            {/*          }}*/}
            {/*          // 💡 disabled={isReadOnly} 를 제거하여 회색 필터가 씌워지는 것을 방지합니다.*/}
            {/*      />*/}
            {/*      <button*/}
            {/*          onClick={ openStoreSearch }*/}
            {/*          style={{*/}
            {/*            cursor:  'pointer',*/}
            {/*            backgroundColor:  '#fff'*/}
            {/*          }}*/}
            {/*      >*/}
            {/*        🔍*/}
            {/*      </button>*/}
            {/*  </div>*/}
            {/*</div>*/}
            {/*<div>*/}
            {/*  <label style={{margin:15}}>업무</label>*/}
            {/*  <label style={{marginLeft:30}}>*/}
            {/*    <input*/}
            {/*      type="radio"*/}
            {/*      value="편의점"*/}
            {/*      name="업무"*/}
            {/*      checked={serviceTp === "편의점"}*/}
            {/*      onChange={handleWorkChange}*/}
            {/*    />*/}
            {/*    편의점*/}
            {/*  </label>*/}
            {/*  <label style={{marginLeft:10}}>*/}
            {/*    <input*/}
            {/*      type="radio"*/}
            {/*      value="카페"*/}
            {/*      name="업무"*/}
            {/*      checked={serviceTp === "카페"}*/}
            {/*      onChange={handleWorkChange}*/}
            {/*    />*/}
            {/*    카페*/}
            {/*  </label>*/}
            {/*</div>*/}
            {/*<div style={{ padding: '10px 15px' }}>*/}
            {/*  <label style={{ marginBottom: '8px', display: 'block' }}>*/}
            {/*    근무 일자*/}
            {/*  </label>*/}

            {/*  /!* flex-wrap: wrap 속성을 활용해 넓으면 가로 배치, 좁으면(모바일) 자동으로 위아래 배치! *!/*/}
            {/*  <div style={{*/}
            {/*    display: 'flex',*/}
            {/*    alignItems: 'center'*/}
            {/*  }}>*/}
            {/*    <div>*/}
            {/*      <CustomDatePicker*/}
            {/*          selectedDate={selectedStartDate}*/}
            {/*          onChange={(date) => handleStartDateChange(date)}*/}
            {/*          placeholder="시작일자 및 시간"*/}
            {/*      />*/}
            {/*    </div>*/}
            {/*      <div style={{*/}
            {/*        // flex: '0 0 auto',       // 💡 크기가 늘어나거나 줄어들지 않고 딱 자기 크기만 유지!*/}
            {/*        // textAlign: 'center',    // 💡 텍스트 중앙 정렬*/}
            {/*        fontWeight: 'bold',     // (선택) 조금 두껍게 하면 더 잘 보입니다.*/}
            {/*        color: '#6c757d',       // (선택) 너무 튀지 않게 약간 회색으로 처리*/}
            {/*        // padding: '0 5px'        // 양옆 여백을 살짝 줍니다.*/}
            {/*        margin: '0 15px'*/}
            {/*      }}>*/}
            {/*        ~*/}
            {/*      </div>*/}
            {/*    <div style={{ flex: '0 1 200px' }}>*/}
            {/*      <CustomDatePicker*/}
            {/*          selectedDate={selectedEndDate}*/}
            {/*          onChange={(date) => handleEndDateChange(date)}*/}
            {/*          placeholder="종료일자 및 시간"*/}
            {/*      />*/}
            {/*    </div>*/}
            {/*  </div>*/}

            {/*  /!* 협의가능 체크박스 *!/*/}
            {/*  <div style={{ marginTop: '10px' }}>*/}
            {/*    <label style={{ cursor: 'pointer', fontSize: '14px' }}>*/}
            {/*      <input*/}
            {/*          type='checkbox'*/}
            {/*          checked={isChecked}*/}
            {/*          onChange={handleNegotiChange}*/}
            {/*          style={{ marginRight: '6px' }}*/}
            {/*      />*/}
            {/*      협의가능*/}
            {/*    </label>*/}
            {/*  </div>*/}
            {/*</div>*/}
            {/*<div>*/}
            {/*  <label style={{margin:15}}>긴급성</label>*/}
            {/*  <label style={{margin:15}}>*/}
            {/*    <input*/}
            {/*      type="radio"*/}
            {/*      value="일반"*/}
            {/*      name="긴급성"*/}
            {/*      checked={urgencyYn === "일반"}*/}
            {/*      onChange={handleUrgencyYnChange}                  */}
            {/*    />*/}
            {/*    일반*/}
            {/*  </label>*/}
            {/*  <label>*/}
            {/*    <input*/}
            {/*      type="radio"*/}
            {/*      value="급구"*/}
            {/*      name="긴급성"*/}
            {/*      checked={urgencyYn === "급구"}*/}
            {/*      onChange={handleUrgencyYnChange}*/}
            {/*    />*/}
            {/*    급구*/}
            {/*  </label>*/}
            {/*</div>*/}
            {/*<div>*/}
            {/*  <label style={{marginLeft:15, marginTop:15}}>*/}
            {/*    제목*/}
            {/*    <textarea*/}
            {/*      style={{marginLeft:45, width:346, height:30, verticalAlign: 'top'}}*/}
            {/*      value={title}*/}
            {/*      onChange={handleTitleChange}*/}
            {/*      placeholder='지점 + 업무 + 주/야간 + 긴급성'*/}
            {/*    />*/}
            {/*  </label>*/}
            {/*</div>*/}
            {/*<div>*/}
            {/*  <label style={{marginLeft:15, marginTop:5}}>*/}
            {/*    내용*/}
            {/*    <textarea*/}
            {/*      style={{marginLeft:45, width:346, height:150, verticalAlign: 'top'}}*/}
            {/*      value={text}*/}
            {/*      onChange={handleTextChange}*/}
            {/*      placeholder='업무 내용 및 원하는 인재상??'*/}
            {/*    />*/}
            {/*  </label>*/}
            {/*</div>*/}
          </main>
          <footer>
            <button onClick={close}>
              close
            </button>
            <button onClick={saveHiring} style={{marginLeft:10, backgroundColor:'#1388f6ff'}}>
              save
            </button>
          </footer>
        </section>
      ) : null}

      {/* 공고작성> 지점검색 팝업 모달*/}
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
    </div>
  );
};

export default CustModal;