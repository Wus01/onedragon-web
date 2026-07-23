import axios from "axios";

export interface StoreData {
    storeAddr : string;
    storeNm : string;
}

// 점포 데이터 조회
export const getStoreList = async (currentPage: number, postsPerPage: number) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/store/getStores`, {
        params: {
            page: currentPage - 1,
            size: postsPerPage
        }
    });

    return res.data;
};

// 점포 데이터 insert.
export const postStoreList = (data: StoreData[]) => {
    axios.post(`${process.env.REACT_APP_API_URL}/store/batch`,data).then(res => {
        console.log(res.data);
    }).catch(err => {
        console.error(err);
    })
}
