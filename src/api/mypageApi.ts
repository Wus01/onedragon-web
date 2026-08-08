import axiosClient from "./axiosClient";
import {ApplyItem} from "../app/form-elements/MypageHome";
import { HiringItem } from "../app/form-elements/MypageHome";
import axios from "axios";
import {CrrHstrDtl} from "../app/form-elements/CrrHstrCreate";
import { CrrHstrPayLoad } from "../app/form-elements/CrrHstrCreate";


export const getMyPageInfoAPI = async ()=> {
    const response = await axiosClient.get(`/mypage`);
    return response.data;
}

export const getMypageApplyListAPI = async ()=>{
    const response = await axiosClient.get<ApplyItem[]>(`/mypage/myApplyList`);

    return response.data;
}

export const getMyPageHiringListAPI = async () => {
    const response = await axiosClient.get<HiringItem[]>(`/mypage/myHiringList`);

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

export const getNotifications = async() => {
    const response = await axiosClient.get(`/noti/getNotifications`);
    return response.data;
}

export const markAllAsRead = async ()=> {
    const response = await axiosClient.post(`/noti/markAllAsRead`);

    return response.data;
}