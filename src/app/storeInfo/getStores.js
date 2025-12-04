import axios from "axios";

// 점포 데이터 조회
export const getStoreList = (currnetPage, postsPerPage) => {
    axios.get(`${process.env.REACT_APP_API_URL}/store/getStores`, {
        params: {
            page: currnetPage - 1,
            size: postsPerPage
        }
    })
    .then(response => {
        console.log("Success : ", response.data);
        return response.data;
        // setPosts(response.data.content);
        // setTotalPages(response.data.totalPages);
    })
    .catch(error => {
        console.error("Error : ", error);
    })
}

// 점포 데이터 insert.
export const postStoreList = (data) => {
    axios.post(`${process.env.REACT_APP_API_URL}/store/batch`,data).then(res => {
        console.log(res.data);
    }).catch(err => {
        console.error(err);
    })
}
