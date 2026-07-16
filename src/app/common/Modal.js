import React, {useEffect, useReducer, useRef, useState} from 'react';
import CustomDatePicker from './Datepicker';
import { ko } from 'date-fns/locale';
import styled from '@emotion/styled';
import '../../assets/css/modal.css';
import dayjs from 'dayjs';
import { postHiring } from '../../api/hiringBoardApi';
import {useHistory} from "react-router-dom";


const CustModal = (props) => {
  // 열기, 닫기, 모달 헤더 텍스트를 부모로부터 받아옴
  const { open, close, header, onSaveSuccess} = props;
  const [selectedStore, setSelectedStore] = useState("");

  const handleSelect = (e) => {
    setSelectedStore(e.target.value);
  };

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
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [startDate, setStartDate] = useState(undefined);

  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [endDate, setEndDate] = useState(undefined);

  const [dateBtn, setDateBtn] = useState('전체');
  const [isDateDisabled, setIsDateDisabled] = useState(false);

  const [appointmentDate, setAppointmentDate] = useState(null);

  // 2. 시작 날짜 변경 핸들러
  const handleStartDateChange = (date) => {
    setDateBtn('');
    if (date) {
      setSelectedStartDate(date);
      setStartDate(dayjs(date).format('YYYY-MM-DD HH:mm')); // String()으로 감싸지 않아도 format은 문자열을 반환합니다.
    }
  };

  // 3. 종료 날짜 변경 핸들러
  const handleEndDateChange = (date) => {
    setDateBtn('');
    if (date) {
      setSelectedEndDate(date);
      setEndDate(dayjs(date).format('YYYY-MM-DD HH:mm'));
    }
  };

  // 업무 변경
  const handleWorkChange = (e) => {
    const value = e.target.value;
    setServiceTp(value);
    // console.log("선택된 업무 = ",value);

  }

  // 협의가능 변경
  const handleNegotiChange = (e) => {
    // console.log("event === ",e.target.checked)
    setIsChecked(e.target.checked);

  }

  // 긴급성 변경
  const handleUrgencyYnChange = (e) => {
    const value = e.target.value;
    setUrgencyYn(value);
  }

  // 제목 변경
  const handleTitleChange = (e) => {
    const value = e.target.value;
    setTitle(value);
  }

  // 내용 변경
  const handleTextChange = (e) => {
    const value = e.target.value;
    setText(value);
  }

  // 데이터 리프레시
  useEffect(()=> {
    setStore(selectedStore);
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
  // const saveHiring = () => {
    const saveHiring = async () => {

    console.log("지점 -- ", selectedStore);
    console.log("업종 -- ",serviceTp);
    console.log("시작일자 -- ", startDate);
    console.log("종료일자 -- ", endDate);
    console.log("협의가능 -- ",negotiYn);
    console.log("제목 -- ",title);
    console.log("내용 -- ",text);
    console.log("긴급성 -- ",urgencyYn);


    const userId = localStorage.getItem("userId");
    const hiringData ={
      storeInfo: {
        storeId: selectedStore // 현재 선택된 가게의 ID
      },
      userId: userId,
      hiringSts: '01', // 01 : 미확정, 02 : 확정
      serviceType: serviceTp,
      workStartDate: startDate,
      workEndDate: endDate,
      negotiableYn: negotiYn === true ? "Y":"N",
      hiringTitle: title,
      hiringText: text,
      payPerHour: 8,
      rgstId: userId
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
  // const list = [{value:'1',name:'석호중앙점'}];
  const list = [{value:'3',name:'석호중앙점'}, {value:'4', name:'고잔중앙점'}];

  // 지점 리스트가 1개일 경우엔 자동 세팅되도록
  useEffect(() => {
    if (list && list.length === 1) {
      setStore(list[0].value);
    }
  }, [list]); // list가 변경될 때마다 체크

  // 작성 후 초기화
  const resetForm = () => {
    setSelectedStore("");
    setNegotiYn(true);
    setTitle("");
    setText("");
    setSelectedStartDate("");
    setSelectedEndDate("");

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
            <div>
              <label style={{margin:15}}>지점</label>
              <select style={{marginLeft:30}} name="지점" onChange={handleSelect}
                // value={list.length === 1 ? list[0].value : (selectedStore|| "")}
                      value={selectedStore||""}
              >
                {/* 1개보다 많을 때만 "선택" 옵션을 보여줌 */}
                {/*{list.length > 1 && <option value="" disabled>선택</option>}*/}
                {selectedStore === "" && <option value="" disabled>선택</option>}
                
                {list.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{margin:15}}>업무</label>
              <label style={{marginLeft:30}}>
                <input
                  type="radio"
                  value="편의점"
                  name="업무"
                  checked={serviceTp === "편의점"}
                  onChange={handleWorkChange}
                />
                편의점
              </label>
              <label style={{marginLeft:10}}>
                <input
                  type="radio"
                  value="카페"
                  name="업무"
                  checked={serviceTp === "카페"}
                  onChange={handleWorkChange}
                />
                카페
              </label>
            </div>
            <div style={{ padding: '10px 15px' }}>
              <label style={{ marginBottom: '8px', display: 'block' }}>
                근무 일자
              </label>

              {/* flex-wrap: wrap 속성을 활용해 넓으면 가로 배치, 좁으면(모바일) 자동으로 위아래 배치! */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px',
                alignItems: 'center'
              }}>
                <div style={{ flex: '1 1 200px' }}>
                  <CustomDatePicker
                      selectedDate={selectedStartDate}
                      onChange={(date) => handleStartDateChange(date)}
                      placeholder="시작일자 및 시간"
                  />
                </div>

                <div style={{ flex: '1 1 200px' }}>
                  <CustomDatePicker
                      selectedDate={selectedEndDate}
                      onChange={(date) => handleEndDateChange(date)}
                      placeholder="종료일자 및 시간"
                  />
                </div>
              </div>

              {/* 협의가능 체크박스 */}
              <div style={{ marginTop: '10px' }}>
                <label style={{ cursor: 'pointer', fontSize: '14px' }}>
                  <input
                      type='checkbox'
                      checked={isChecked}
                      onChange={handleNegotiChange}
                      style={{ marginRight: '6px' }}
                  />
                  협의가능
                </label>
              </div>
            </div>
            {/*<div>*/}
            {/*  <label style={{margin:15}}>근무 일자</label>*/}
            {/*  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}></div>*/}
            {/*  <CustomDatePicker */}
            {/*    selectedDate={selectedStartDate} */}
            {/*    onChange={(date) => handleStartDateChange(date)} */}
            {/*    placeholder="시작일자"*/}
            {/*  />*/}
            {/*  <div style={{marginLeft:92}}>*/}
            {/*    <CustomDatePicker */}
            {/*      selectedDate={selectedEndDate} */}
            {/*      onChange={(date) => handleEndDateChange(date)} */}
            {/*      placeholder="종료일자"*/}
            {/*    />*/}
            {/*  </div>*/}
            {/*  */}
            {/*  <div style={{margin:15}}>*/}
            {/*    <label>*/}
            {/*      <input style={{marginLeft:75}} type='checkbox' checked={isChecked} onChange={handleNegotiChange} />*/}
            {/*      협의가능*/}
            {/*    </label>*/}
            {/*  </div>              */}
            {/*</div>*/}
            <div>
              <label style={{margin:15}}>긴급성</label>
              <label style={{margin:15}}>
                <input
                  type="radio"
                  value="일반"
                  name="긴급성"
                  checked={urgencyYn === "일반"}
                  onChange={handleUrgencyYnChange}                  
                />
                일반
              </label>
              <label>
                <input
                  type="radio"
                  value="급구"
                  name="긴급성"
                  checked={urgencyYn === "급구"}
                  onChange={handleUrgencyYnChange}
                />
                급구
              </label>
            </div>
            <div>
              <label style={{marginLeft:15, marginTop:15}}>
                제목
                <textarea 
                  style={{marginLeft:45, width:250, height:30, verticalAlign: 'top'}}
                  type='text'
                  value={title}
                  onChange={handleTitleChange}
                  placeholder='지점 + 업무 + 주/야간 + 긴급성'
                />
              </label>
            </div>
            <div>
              <label style={{marginLeft:15, marginTop:5}}>
                내용
                <textarea
                  style={{marginLeft:45, width:250, height:150, verticalAlign: 'top'}}
                  multiple={true}
                  type='text'
                  value={text}
                  onChange={handleTextChange}
                  placeholder='업무 내용 및 원하는 인재상??'
                />
              </label>
            </div>
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
    </div>
  );
};

export default CustModal;