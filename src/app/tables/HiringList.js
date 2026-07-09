import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import bsCustomFileInput from 'bs-custom-file-input';
// ProgressBar는 코드에서 사용되지 않아 제거 가능하지만, 원본에 따라 남겨둡니다.
import { ProgressBar } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import CustModal from "../common/Modal";
import {postHiring} from "../../api/hiringBoardApi";


// export const  = () => {
function HiringDetail(){
    const { id } = useParams(); // alt+enter

    const [hiring,setHiring] = useState({
            hiringTitle:"",
            hiringText:""
        },[]);

    const fetchHirings = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/hiring/getHirings`)
            .then(res => setHiring(res.data))
            .catch(err => console.error(err));
    };

    useEffect(()=>{
        fetchHirings();
    }, []);

        // 공고 리스트 불러오기
        // useEffect(() => {
        //     axios.get(`${process.env.REACT_APP_API_URL}/hiring/getHirings`)
        //         .then(response => {
        //             console.log('공고리스트 가져오기 성공:', response.data);
        //             setHiring(response.data);
        //         })
        //         .catch(error => {
        //             console.error('공고리스트 가져오기 실패:', error);
        //             alert("공고리스트를 불러오는 데 실패했습니다.");
        //         });
        // }, [id]);

    const [isOpen, setIsOpen] = useState(false);
    const [isClose, setIsClose] = useState(false);
    const [header, setHeader] = useState('');

    const closeModalHandler = () => {
        setIsOpen(false);
    };

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title">공고 리스트</h3>
        <nav aria-label="breadcrumb">
        </nav>
      </div>

        <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                {/*<h4 className="card-title">공고 리스트</h4>*/}
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr style={{textAlign: 'center'}}>
                        <th>No</th>
                        <th>지점명</th>
                        <th>제목</th>
                        <th>작성자</th>
                        <th>공고확정여부</th>
                        <th>등록일시</th>
                      </tr>
                    </thead>
                    <tbody>
                        {hiring.content && hiring.content.length > 0 ? (
                            hiring.content.map((item, index) => (
                                <tr key={item.id || index} style={{textAlign: 'center'}}>
                                    <td>{item.hiringNo}</td>
                                    <td>{item.storeInfo.storeNm}</td>
                                    <td><Link to={`/hiring/${item.hiringNo}`} style={{ textDecoration: 'none', color: 'blue' }}>{item.hiringTitle}</Link></td>
                                    <td>{item.rgstId}</td>
                                    <td>{item.hiringSts === '01' ? '미확정' : '확정'}</td>
                                    <td>{item.rgstDate}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>등록된 공고가 없습니다.</td>
                            </tr>
                        )
                        }
                    </tbody>
                  </table>
                    <div style={{textAlign:'right'}}>
                        <button type="button" className="btn btn-primary" onClick={() => setIsOpen(true)}
                                style={{marginTop:'20px'}}>
                            작성하기
                        </button>
                    </div>
                </div>
              </div>
            </div>
            </div>
        <CustModal
            open={isOpen}
            close={closeModalHandler}
            onSaveSuccess={fetchHirings}
            header="공고작성"
        />
    </div>
  );
}

export default HiringDetail;