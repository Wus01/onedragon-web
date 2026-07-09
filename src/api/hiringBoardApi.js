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

// 공고 데이터 insert.
export const postHiring = (data) => {
    axios.post(`${process.env.REACT_APP_API_URL}/hiring/add`,data).then(res => {
        console.log(res.data);
    }).catch(err => {
        console.error(err);
    })
}

// 지원하기
export const insertApply = (data) => {
    return axios.post(`${process.env.REACT_APP_API_URL}/apply/insertApply`,data).then(res => {
        console.log(res.data);
        alert("지원에 성공하였습니다.");
    }).catch(err => {
        console.error(err);
    })
}