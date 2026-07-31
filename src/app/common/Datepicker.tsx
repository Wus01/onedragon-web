import React, {forwardRef, useEffect, useState} from 'react';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale';
import "react-datepicker/dist/react-datepicker.css";
import {Dayjs} from "dayjs";

interface CustomInputProps {
  value? : string;
  onClick? : (e: React.MouseEvent<HTMLButtonElement>) => void;

}

// 입력창을 커스텀하고 싶을 때 사용하는 내부 컴포넌트
const CustomInput = forwardRef<HTMLButtonElement, CustomInputProps>(({ value, onClick }, ref) => (
  <button className="custom-datepicker-button" onClick={onClick} ref={ref}>
    {value || "날짜를 선택하세요"}
  </button>
));

CustomInput.displayName = 'CustomInput'; //forwardRef 사용 시 에러 방지용 이름 지정

interface CustomDatePickerProps {
  selectedDate: Date | Dayjs | null;
  onChange: (date: Date | null, event: React.SyntheticEvent<any> | undefined) => void; //react-datepicker 전용 onChange 타입
  showTime?: boolean; // 있을 수도 없을 수도 있으니 ? 추가
  placeholder?: string;
  placement?: string;
}

const CustomDatePicker = ({ 
  selectedDate, 
  onChange, 
  showTime = true, 
  placeholder,
  placement
}: CustomDatePickerProps) => {
  const [isMobile, setIsMobile] = useState(false); // 모바일 여부 체크

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();

    window.addEventListener('resize', checkIsMobile);
    return ()=> window.removeEventListener('resize', checkIsMobile);
  }, []);

  const handleNativeChange = (e) => {
    const newDate = new Date(e.target.value);
    onChange(newDate, e);
  };

  // 4. Date 객체를 네이티브 input에 맞는 문자열 포맷(YYYY-MM-DDThh:mm)으로 변환
  const getNativeValue = (date) => {
    if (!date) return "";
    // 한국 시간대(KST)에 맞춰서 포맷팅
    const offset = date.getTimezoneOffset() * 60000;
    const localISOTime = new Date(date - offset).toISOString().slice(0, 16);
    return showTime ? localISOTime : localISOTime.split('T')[0];
  };

  // 5. 조건부 렌더링: 모바일일 때는 네이티브 input 반환
  if (isMobile) {
    return (
        <input
            type={showTime ? "datetime-local" : "date"}
            value={getNativeValue(selectedDate)}
            onChange={handleNativeChange}
            className="form-control" // 부트스트랩 클래스 그대로 유지
            placeholder={placeholder}
        />
    );
  }

  return (
    <DatePicker
      selected={selectedDate}
      onChange={onChange}
      locale={ko}
      // 시간 선택 여부를 props로 조절
      showTimeSelect={showTime}
      timeIntervals={15}
      timeCaption="시간"
      dateFormat={showTime ? "yyyy-MM-dd HH:mm" : "yyyy-MM-dd"}
      placeholderText={placeholder}
      // 커스텀 입력창을 쓰고 싶다면 아래 주석을 해제하세요
      // customInput={<CustomInput />} 
      // className="common-datepicker-input"
      className="form-control"
      popperPlacement={placement || "bottom-start"}
    />
  );
};

export default CustomDatePicker;