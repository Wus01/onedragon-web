import axiosClient from "./axiosClient";

export const getApplyListAPI = async (id:string | number)=> {
    const response = await axiosClient.get(`/apply/list/${id}`);

    return response.data;
}

// 지원자 확정
export const confirmApplyAPI = async (confirmData: {
    applyNos: number[] | string[];
    hiringNo: number;
    userId: string | null;
    applySts: string;
})=>{
    const response = await axiosClient.post(`/apply/confirm`, confirmData);
    return response.data;
}


