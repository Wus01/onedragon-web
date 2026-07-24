import axiosClient from "./axiosClient";
// axios 통신 모음

interface HiringData{
    storeInfo: {
        storeId: number;
    },
    userId: string;
    hiringSts: string;
    serviceType: string;
    workStartDate: string;
    workEndDate: string;
    negotiableYn: 'Y' | 'N';
    hiringTitle: string;
    hiringText: string;
    payPerHour: number;
    rgstId: string;
}

interface ApplyData{
    hiringNo : number,
    rgstId: string,
    applySucYn : 'Y' | 'N',
    applySts : string //지원완료
}



// 공고 데이터 조회 : 안쓰고 있음
// export const getHiringList = async (currnetPage, postsPerPage) => {
//     const res = await axios.get(`${process.env.REACT_APP_API_URL}/hiring/getHirings`, {
//         params: {
//             page: currnetPage - 1,
//             size: postsPerPage
//         }
//     });
//
//     return res.data;
// };

// 공고 목록 조회
export const getHiringList = async (page: number, size:number)=> {
    const response = await axiosClient.get('/hiring/getHirings', {
        params: {
            page: page,
            size: size
        }
    });
    return response.data;
}

// 공고 데이터 insert.
export const postHiring = (data: HiringData) => {
    return axiosClient.post(`${process.env.REACT_APP_API_URL}/hiring/add`, data);
}

// 공고 상세보기
export const getHiringDetailAPI = async (id:string | number)=>{
    const response = await axiosClient.get(`/hiring/${id}`);

    return response.data;
}

// 지원하기
export const insertApply = (data: ApplyData) => {
    return axiosClient.post(`${process.env.REACT_APP_API_URL}/apply/insertApply`,data).then(res => {
        console.log(res.data);
        alert("지원에 성공하였습니다.");
    }).catch(err => {
        console.error(err);
    })
}

