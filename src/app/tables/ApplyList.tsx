import React, { useEffect, useState } from 'react';
import {useParams} from "react-router-dom";
import axios from "axios";
import {confirmApplyAPI, getApplyListAPI} from "../../api/applyApi";

interface ApplicantsProps {
    hiring:{
        hiringNo: number;
        hiringSts: string;
    };
    hiringNo : number;
}

interface ApplicantsData {
    hiringNo: number;
    applyNos: number[];
    rgstId: string;
    applySucYn : 'Y' | 'N';
    applySts : string;
    applyNo: number;
    userInfo? : {
        userNm: string;
        crrHstrList?: CrrHstr[];
    };
}

interface CrrHstr {
    crrStrtDate?: string | Date;
    crrEndDate?: string | Date | null;
    storeInfo?: {
        storeNm: string;
    };
}

const ApplyList: React.FC<ApplicantsProps> = ({hiringNo, hiring})=>{
    // 지원자목록 불러오기
    const [applyList, setApplyList] = useState<ApplicantsData[]>([]);

    useEffect(() => {
        const fetchApplies = async () => {
            try {
                const data = await getApplyListAPI(hiringNo);

                setApplyList(data);
            } catch (error) {
                console.error('지원자목록 가져오기 실패:', error);
                alert("지원자목록을 불러오는 데 실패했습니다.");
            }
        }
        fetchApplies();
    }, [hiringNo]);


    // 컴포넌트 내부 상단
    const [selectedApplyNos, setSelectedApplyNos] = useState<number[]>([]);
    const handleCheck = (applyNo:number) => {

        setSelectedApplyNos((prev:number[]) =>
            prev.includes(applyNo)
                ? prev.filter((id) => id !== applyNo) // 이미 있으면 제거
                : [...prev, applyNo]                  // 없으면 추가
        );
    };
    const fn_confirm = async () => {
        if (selectedApplyNos.length === 0) {
            alert("확정할 지원자를 선택해주세요.");
            return;
        }

        if (window.confirm("확정하시겠습니까?")) {
            const hiringNo = Number(hiring.hiringNo);

            try {
                await confirmApplyAPI({
                    applyNos: selectedApplyNos,
                    hiringNo: hiringNo,
                    userId: localStorage.getItem("userId"),
                    applySts: '04' //확정
                });

                alert("성공적으로 확정되었습니다.");
                window.location.reload();
            } catch (error) {
                console.error("에러 발생:", error);
                alert("확정처리에 실패하였습니다.");
            }
        }
    }

    const calculateTotalExperience = (crrHstrList:CrrHstr[]) => {
        if (!crrHstrList || crrHstrList.length === 0) return "신입";

        let totalDays = 0;

        crrHstrList.forEach((hstr) => {
            const start = new Date(hstr.crrStrtDate);
            const end = hstr.crrEndDate ? new Date(hstr.crrEndDate) : new Date(); // 종료일 없으면 오늘 기준

            const diffTime = Math.abs(end.getTime() - start.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // 밀리초를 일 단위로 변환
            totalDays += diffDays;
        });

        const years = Math.floor(totalDays / 365);
        const months = Math.floor((totalDays % 365) / 30);

        let result = "";
        if (years > 0) result += `${years}년 `;
        if (months > 0) result += `${months}개월`;

        return result || "1개월 미만";
    };
  return (
        <div className="mt-4">
            {/* 💡 하드코딩된 엄청 큰 폰트 사이즈(30)를 지우고, fs-4 (Bootstrap 폰트 사이즈)로 모바일/PC 모두 예쁘게 맞춤 */}
            <h4 className="fw-bold text-center mb-4 fs-4">
                지원자 목록({applyList.length}명)
            </h4>

            {/* 💡 핵심포인트 1: table-responsive 클래스로 감싸서 모바일에서만 가로 스크롤 생성 */}
            <div className="table-responsive">
                {/* 💡 핵심포인트 2: text-nowrap을 넣어 글자가 좁은 칸에서 억지로 두세 줄로 쪼개지는 것 방지 */}
                <table className="table table-hover text-nowrap align-middle mb-0">
                    <thead className="table-light">
                    <tr className="text-center">
                        <th><input type="checkbox" /></th>
                        {/* 💡 꿀팁: 모바일(좁은 화면)에서는 굳이 안 봐도 되는 '번호' 열을 숨김 (d-none d-md-table-cell) */}
                        <th className="d-none d-md-table-cell">번호</th>
                        <th>이름</th>
                        <th>지점명</th>
                        <th>경력</th>
                        <th>상태</th>
                    </tr>
                    </thead>
                    <tbody>
                    {applyList && applyList.length > 0 ? (
                        applyList.map((apply, index) => (
                            <tr key={apply.applyNo || index} className="text-center">
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedApplyNos.includes(apply.applyNo)}
                                        onChange={() => handleCheck(apply.applyNo)}
                                    />
                                </td>
                                <td className="d-none d-md-table-cell">{index + 1}</td>
                                <td>{apply.userInfo?.userNm || '-'}</td>
                                <td>
                                    {apply.userInfo?.crrHstrList?.length > 0
                                        ? apply.userInfo.crrHstrList[0].storeInfo?.storeNm
                                        : '-'}
                                </td>
                                <td>
                                    {apply.userInfo?.crrHstrList?.length > 0
                                        ? `총 ${calculateTotalExperience(apply.userInfo.crrHstrList)}`
                                        : '-'}
                                </td>
                                <td>
                                    {/* 💡 확정/미확정 상태를 예쁜 뱃지(Badge) 모양으로 변경 */}
                                    <span className={`badge ${apply.applySucYn === 'Y' ? 'bg-success' : 'bg-secondary'}`}>
                    {apply.applySucYn === 'Y' ? '확정' : '미확정'}
                  </span>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} className="text-center py-4 text-muted">
                                지원자가 없습니다.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            <div className="text-center mt-4">
                <button
                    type="button"
                    className="btn btn-primary px-4 py-2"
                    onClick={fn_confirm}
                    disabled={applyList.length === 0 || hiring.hiringSts === '02'}
                >
                    확정
                </button>
            </div>
        </div>
    // <div>
    //     <h4 style={{fontWeight:'bold', fontSize:'30', textAlign:'center', marginTop:'30px'}}>지원자 목록({applyList.length}명)</h4>
    //       <div className="" style={{marginTop:'20px'}}>
    //         <table className="table">
    //           <thead>
    //             <tr style={{textAlign:'center'}}>
    //               <th style={{fontWeight:'bold', fontSize:'25'}}><input type="checkbox" /></th>
    //               <th>번호</th>
    //               <th>이름</th>
    //               <th>지점명</th>
    //               <th>경력</th>
    //               <th>상태</th>
    //             </tr>
    //           </thead>
    //           <tbody>
    //             {applyList && applyList.length > 0 ? (
    //               applyList.map((apply, index) => (
    //                 <tr key={apply.applyNo || index} style={{textAlign:'center'}}>
    //                   <td><input type="checkbox" checked={selectedApplyNos.includes(apply.applyNo)} onChange={() => handleCheck(apply.applyNo)}/></td>
    //                   <td>{index + 1}</td>
    //                   <td>{apply.userInfo?.userNm || ''}</td>
    //                   <td>{apply.userInfo?.crrHstrList?.length > 0
    //                                   ? apply.userInfo.crrHstrList[0].storeInfo?.storeNm
    //                                   : ''}</td>
    //                   <td>{apply.userInfo?.crrHstrList?.length > 0
    //                             ? `총 ${calculateTotalExperience(apply.userInfo.crrHstrList)}`
    //                             : ''}</td>
    //                   <td>{apply.applySucYn === 'Y'?'확정':'미확정'}</td>
    //                 </tr>
    //               ))
    //             ) : (
    //               <tr>
    //                 <td colSpan={6} className="text-center">지원자가 없습니다.</td>
    //               </tr>
    //             )}
    //           </tbody>
    //         </table>
    //       </div>
    //         <div className="text-center">
    //         <button type="button" className="btn btn-primary mr-2"
    //             onClick={fn_confirm}
    //             disabled={applyList.length === 0 || hiring.hiringSts === '02'}
    //             style={{ marginTop: '20px', textAlign:'center' }}>확정</button>
    //         </div>
    // </div>
  );
}

export default ApplyList;