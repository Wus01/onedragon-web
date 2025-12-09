import axios from "axios";
// axios 통신 모음

// 공고 데이터 조회
export const getHiringList = async (currnetPage, postsPerPage) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/hiring/getHirings`, {
        params: {
            page: currnetPage - 1,
            size: postsPerPage
        }
    });

    return res.data;
};