import axios from "axios";

// 점포 데이터 조회
export const getStoreList = async (currnetPage, postsPerPage) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/store/getStores`, {
        params: {
            page: currnetPage - 1,
            size: postsPerPage
        }
    });

    return res.data;
};

// 점포 데이터 insert.
export const postStoreList = (data) => {
    axios.post(`${process.env.REACT_APP_API_URL}/store/batch`,data).then(res => {
        console.log(res.data);
    }).catch(err => {
        console.error(err);
    })
}
