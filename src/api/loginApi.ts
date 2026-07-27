
import axiosClient from "./axiosClient";
import axios from "axios";

export const goLoginApi = async(payload:{}) => {

    const response = await axiosClient.post(`/userInfo/login`, payload);

    return response.data;
}

export const findIdApi = async (userEmail:string) => {
    const response = await axiosClient.post(`/userInfo/findId`, {userEmail});

    return response.data;
}

export const findPWApi = async (userEmail: string, userId: string) => {
    const response =  await axiosClient.post(`/userInfo/findPw`, { userEmail, userId });

    return response.data;
}