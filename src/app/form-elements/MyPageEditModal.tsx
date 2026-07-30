import React, {ReactNode, useEffect, useReducer, useRef, useState} from 'react';

import '../../assets/css/modal.css';
import {updateUserInfo} from "../../api/mypageApi";

interface ModalProps {
  onClose: ()=> void;
  userId: string;
  userNm: string;
  userEmail: string;
  userPhoneNm: string;
}

const MyPageEditModal = ({
                           onClose, userId, userNm,
                           userPhoneNm: oldUserPhoneNm,
                           userEmail: oldUserEmail
}:ModalProps) => {
  // 열기, 닫기, 모달 헤더 텍스트를 부모로부터 받아옴
  // const { open, close, header} = props;
  // const [selectedStore, setSelectedStore] = useState("");
  //
  // const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   setSelectedStore(e.target.value);
  // };
  //
  // 상태관리
  // const [userNm, setUserNm] = useState("");
  // const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState(oldUserEmail);
  const [userPwd, setUserPwd] = useState("");
  const [userPwdConfirm, setUserPwdConfirm] = useState("");
  const [userPhoneNm, setUserPhoneNm] = useState(oldUserPhoneNm);
  // const [showModal, setShowModal] = useState(false);
  // const [store, setStore] = useState("");
  // const [serviceTp, setServiceTp] = useState("편의점");
  // const [negotiYn, setNegotiYn] = useState(true);
  // const [isChecked, setIsChecked] = useState(true);  // 협의 체크 데이터
  // const [urgencyYn, setUrgencyYn] = useState("일반");
  // const [hiringTitle, setHiringTitle] = useState("");
  // const [hiringText, setHiringText] = useState("");
  //
  // const [title, setTitle] = useState("")
  // const [text, setText] = useState("")
  //
  // // 1. State 선언 (타입 지정 부분 삭제)
  // const [selectedStartDate, setSelectedStartDate] = useState<Date | Dayjs | null>(null);
  // const [startDate, setStartDate] = useState<string | undefined>(undefined);
  //
  // const [selectedEndDate, setSelectedEndDate] = useState<Date | Dayjs | null>(null);
  // const [endDate, setEndDate] = useState<string | undefined>(undefined);
  //
  // const [dateBtn, setDateBtn] = useState('전체');
  // const [isDateDisabled, setIsDateDisabled] = useState(false);
  //
  //
  // // 2. 시작 날짜 변경 핸들러
  // const handleStartDateChange = (date: Date | Dayjs | null) => {
  //   setDateBtn('');
  //   if (date) {
  //     setSelectedStartDate(date);
  //     setStartDate(dayjs(date).format('YYYY-MM-DD HH:mm')); // String()으로 감싸지 않아도 format은 문자열을 반환합니다.
  //   }
  // };
  //
  // // 3. 종료 날짜 변경 핸들러
  // const handleEndDateChange = (date: Date | Dayjs | null) => {
  //   setDateBtn('');
  //   if (date) {
  //     setSelectedEndDate(date);
  //     setEndDate(dayjs(date).format('YYYY-MM-DD HH:mm'));
  //   }
  // };
  //
  // // 업무 변경
  // const handleWorkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = e.target.value;
  //   setServiceTp(value);
  //   // console.log("선택된 업무 = ",value);
  //
  // }
  //
  // // 협의가능 변경
  // const handleNegotiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   // console.log("event === ",e.target.checked)
  //   setIsChecked(e.target.checked);
  //
  // }
  //
  // // 긴급성 변경
  // const handleUrgencyYnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = e.target.value;
  //   setUrgencyYn(value);
  // }
  //
  // // 제목 변경
  // const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  //   const value = e.target.value;
  //   setTitle(value);
  // }
  //
  // // 내용 변경
  // const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  //   const value = e.target.value;
  //   setText(value);
  // }
  //
  // // 데이터 리프레시
  // useEffect(()=> {
  //   setStore(selectedStore);
  //   setNegotiYn(isChecked);
  //   setHiringTitle(title);
  //   setHiringText(text);
  //
  //   // 모달 띄울 때 부모화면 스크롤 방지
  //   if(open){
  //     const scrollY = window.scrollY;
  //     document.body.style.position = 'fixed';
  //     document.body.style.top = `-${scrollY}px`;
  //     document.body.style.left = '0';
  //     document.body.style.right = '0';
  //     document.body.style.overflow = 'hidden';
  //
  //   return () => {
  //     // 3. 모달 닫힐 때 원래 스타일 복원 및 스크롤 위치 복구
  //     document.body.style.position = '';
  //     document.body.style.top = '';
  //     document.body.style.left = '';
  //     document.body.style.right = '';
  //     document.body.style.overflow = '';
  //     window.scrollTo(0, scrollY);
  //   };
  //   };
  // }, [open]);
  //
  // const history = useHistory();
  //
  // // 공고 저장
  //   const saveHiring = async () => {
  //
  //   console.log("지점 -- ", selectedStore);
  //   console.log("업종 -- ",serviceTp);
  //   console.log("시작일자 -- ", startDate);
  //   console.log("종료일자 -- ", endDate);
  //   console.log("협의가능 -- ",negotiYn);
  //   console.log("제목 -- ",title);
  //   console.log("내용 -- ",text);
  //   console.log("긴급성 -- ",urgencyYn);
  //
  //
  //   const userId = localStorage.getItem("userId");
  //   const hiringData ={
  //     storeInfo: {
  //       storeId: Number(selectedStore) // 현재 선택된 가게의 ID
  //     },
  //     userId: userId,
  //     hiringSts: '01', // 01 : 미확정, 02 : 확정
  //     serviceType: serviceTp,
  //     workStartDate: startDate || "",
  //     workEndDate: endDate || "",
  //     negotiableYn: negotiYn === true ? "Y" as const : "N" as const ,
  //     hiringTitle: title,
  //     hiringText: text,
  //     payPerHour: 8,
  //     rgstId: userId
  //   }
  //   try{
  //     const response = await postHiring(hiringData);
  //
  //     if(response && (response.status === 200 || response.status === 201)){
  //       alert("공고가 성공적으로 등록되었습니다.");
  //       // if (onSaveSuccess) onSaveSuccess();
  //       resetForm();
  //       close();
  //     }else{
  //       throw new Error("서버 응답 이상");
  //     }
  //   }catch(e){
  //     alert("등록에 실패하였습니다.");
  //     console.error(e);
  //   }
  // }
  //
  //
  // // 작성 후 초기화
  // const resetForm = () => {
  //   setSelectedStore("");
  //   setNegotiYn(true);
  //   setTitle("");
  //   setText("");
  //   setSelectedStartDate(null);
  //   setSelectedEndDate(null);
  //
  // };
  const updateCheck= async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if ( !userEmail.trim() || !userPhoneNm.trim()) {
      alert("이메일, 핸드폰 번호를 입력해주세요.");
      return;
    }

    if(userPwd || userPwdConfirm){
      if (userPwd !== userPwdConfirm) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
      }
    }


    const payload = {
      userId,
      userNm,
      userEmail,
      userPwd,
      userPhoneNm
    };

    try {
      const result = await updateUserInfo(payload);
      // 모달닫기
      // onClose();

      alert("내 정보 수정에 성공하였습니다.");

      // 반영 후 재세팅
      setUserEmail(userEmail);
      setUserPhoneNm(userPhoneNm);
      setUserPwd("");
      setUserPwdConfirm("");



    } catch(error) {
      console.error("내 정보 수정 실패:",error);
      alert("내 정보 수정에 실패하였습니다.");

    }

  }
  return (
      // 모달이 열릴때 openModal 클래스가 생성된다.
      // <div className={open ? 'openModal modal' : 'modal'}>
      <div>

        <form className="pt-3"
            onSubmit={updateCheck}
        >
          <div className="form-group">
            <input type="text" className="form-control form-control-lg"
                value={userNm}
                // onChange={(e) => setUserNm(e.target.value)}
                readOnly={true}
            />
          </div>
          <div className="form-group">
            <input type="text" className="form-control form-control-lg"
                   placeholder="아이디 입력"
                value={userId}
                // onChange={(e) => setUserId(e.target.value)}
                readOnly={true}
            />
          </div>
          <div className="form-group">
            <input type="email" className="form-control form-control-lg"
                   placeholder="이메일 입력"
                value={userEmail}
                onChange={(e)=> setUserEmail(e.target.value)}
            />

          </div>
          <div className="form-group">
            <input type="text" className="form-control form-control-lg"
                   placeholder="핸드폰번호 입력"
                   value={userPhoneNm}
                onChange={(e) => setUserPhoneNm(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input type="password" className="form-control form-control-lg"
                   placeholder="비밀번호 입력"
                value={userPwd}
                onChange={(e) => setUserPwd(e.target.value)}
            />
          </div>

          <div className="form-group">
            <input type="password" className="form-control form-control-lg"
                   placeholder="비밀번호 확인"
                value={userPwdConfirm}
                onChange={(e) => setUserPwdConfirm(e.target.value)}
            />
          </div>

          <div className="mt-3" style={{marginBottom:'15px'}}>
            <button type="submit" className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn">
              수정하기
            </button>
          </div>
        </form>


      </div>
  );

}
export default MyPageEditModal;