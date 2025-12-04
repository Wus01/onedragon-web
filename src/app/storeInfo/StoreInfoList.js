// 1. JSON 파일 가져오기
import rawData from '../../json/Ansan-si_GS25_list.json'; 
import axios from "axios";
import { postStoreList } from './getStores';

function ShopListFromFile() {
  // 2. 불러온 데이터에서 'results' 배열 GET
  const results = rawData.results;

  // shopData 변수에 JSON 파일의 내용(JavaScript 객체)이 저장됨
  // 3. 'address'와 'shopName'만 추출
  const shopData = results.map(item => ({
    storeAddr: item.address,
    storeNm: item.shopName,
  }));

  const onClickSubmit = () => {
      // 백앤드로 데이터 전송
      try{
        postStoreList(shopData);

      }catch(e){
        console.error(e);
      }
  }

  return (
    <div>
      <div style={{display: 'flex', margin:10}}>
        <h3>💾 JSON 파일에서 로드된 정보</h3>
        <button type="sumit" className="btn btn-primary" style={{margin:10}} onClick={onClickSubmit}>데이터 저장</button>
      </div>
      
      {shopData.length > 0 && (
        <ul>
          {shopData.map((shop, index) => (
            <li key={index}>
              {shop.storeNm}: {shop.storeAddr}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ShopListFromFile;