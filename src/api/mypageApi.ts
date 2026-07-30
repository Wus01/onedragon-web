import axiosClient from "./axiosClient";
import {ApplyItem} from "../app/form-elements/MypageHome";
import { HiringItem } from "../app/form-elements/MypageHome";
import axios from "axios";
import {CrrHstrDtl} from "../app/form-elements/CrrHstrCreate";
import { CrrHstrPayLoad } from "../app/form-elements/CrrHstrCreate";


export const getMyPageInfoAPI = async (userId: string)=> {
    const response = await axiosClient.get(`/mypage/${userId}`);
    return response.data;
}

export const getMypageApplyListAPI = async (userId: string)=>{
    if (!userId) {
        throw new Error("로그인된 사용자 ID가 없습니다.");
    }

    const response = await axiosClient.get<ApplyItem[]>(`/mypage/myApplyList`,
        {
            params:{userId: userId}
        });

    return response.data;
}

export const getMyPageHiringListAPI = async (userId: string) => {
    const response = await axiosClient.get<HiringItem[]>(`/mypage/myHiringList`,
        {
            params:{userId: userId}
        });

    return response.data;
}

export const getCrrHstrAPI = async (pathCrrHstrNo: string | number) => {
    const response = await axiosClient.get<CrrHstrDtl>(`/crrHstr/select/${pathCrrHstrNo}`);

    return response.data;
}

export const saveCrrHstrAPI = async (payload: CrrHstrPayLoad) => {
    const response = await axiosClient.post(`/crrHstr`, payload);

    return response.data;
}

export const updateCrrHstrAPI = async (payload: CrrHstrPayLoad, crrHstrNo:number)=> {

    const response = await axiosClient.put<CrrHstrDtl>(`/crrHstr/update/${crrHstrNo}`, payload);

    return response.data;
}

export const deleteCrrHstrAPI = async (payload: CrrHstrPayLoad, crrHstrNo:number) => {
    const response = await axiosClient.delete(`/crrHstr/delete/${crrHstrNo}`, { data: payload });

    return response.data;
}

export const updateUserInfo = async (payload:{})=> {
    const response = await axiosClient.put(`/userInfo/updateUserInfo`,payload);
    return response.data;
}