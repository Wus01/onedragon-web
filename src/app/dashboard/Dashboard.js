import React, { useState, useEffect } from "react";
import { Line, Bar, Radar } from "react-chartjs-2";
import { Link } from "react-router-dom";
import axios from "axios";
import { ProgressBar, Dropdown, Modal } from "react-bootstrap";
import GaugeChart from "react-gauge-chart";
import { VectorMap } from "react-jvectormap";
import { getStoreList } from '../../api/storeApi'
import { getHiringList } from "../../api/hiringBoardApi";
import CustModal from "../common/Modal";

const mapData = {
  CN: 100000,
  IN: 9900,
  SA: 86,
  EG: 70,
  SE: 0,
  FI: 0,
  FR: 0,
  US: 20
};

function Dashboard() {
  /** ------------------------------------
   *  pagination / store list
   * ------------------------------------ */
  // const [stores, setStores] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [hiring, setHiring] = useState([]);
  // const storesPerPage = 10;
  const hiringsPerPage = 10;

  // 점포 데이터 호출
  // const storeList = async () => {
  //   try{
  //     const list = await getStoreList(currentPage,storesPerPage)
  //     console.log("list ===> ",list.content);
  //     setStores(list.content);

  //   }catch(e){
  //     console.error(e);
  //   }
  // };

  // 공고 데이터 호출
  const hiringList = async () => {
    try{
      const list = await getHiringList(currentPage,hiringsPerPage)
      console.log("list ===> ",list.content);
      setHiring(list.content);

    }catch(e){
      console.error(e);
    }
  }

  useEffect(() => {
    // storeList();
    hiringList();
  }, []);

  // useEffect(() => {
  //   storeList();
  // }, [currentPage]);

  const handlePageChange = (page) => setCurrentPage(page);

  /** ------------------------------------
   *  chart-related states
   * ------------------------------------ */
  const [active, setActive] = useState("");
  const [chartState, setChartState] = useState({
    labels: [],
    datasets: [],
  });

  const [visitChartData, setVisitChartData] = useState({});
  const [impressionChartData, setImpressionChartData] = useState({});
  const [conversionChartData, setConversionChartData] = useState({});
  const [downloadChartData, setDownloadChartData] = useState({});
  const [salesStatisticsChartData, setSalesStatisticsChartData] = useState({});
  const [netProfitChartData, setNetProfitChartData] = useState({});
  const [totaltransactionChartData, setTotaltransactionChartData] = useState({});

  /** ------------------------------------
   *  options
   * ------------------------------------ */
  const salesStaticsOptions = {
    responsive: true,
    animation: { animateScale: true, animateRotate: true },
    elements: {
      point: { radius: 3 },
      line: { tension: 0 },
    },
    layout: { padding: { left: 0, right: 0, top: 0, bottom: 0 } },
    legend: false,
    scales: {
      xAxes: [
        {
          display: false,
          ticks: { display: false },
          gridLines: { drawBorder: false, color: "#f8f8f8" },
        },
      ],
      yAxes: [
        {
          ticks: {
            max: 200,
            min: 0,
            stepSize: 50,
            fontColor: "#8b9298",
          },
          gridLines: { display: true, drawBorder: false, color: "#f8f8f8" },
        },
      ],
    },
  };

  const netProfitOptions = {
    scale: {
      ticks: { beginAtZero: true, display: false },
      pointLabels: { fontSize: 14, fontColor: "#6c757c" },
      angleLines: { color: "#f3f3f3" },
      gridLines: { color: "#f3f3f3" },
    },
    legend: false,
  };

  const totaltransactionChartOptions = {
    responsive: true,
    animation: { animateScale: true, animateRotate: true },
    legend: false,
    scales: {
      xAxes: [{ gridLines: { display: false }, ticks: { display: false } }],
      yAxes: [{ gridLines: { display: false }, ticks: { display: false } }],
    },
  };

  /** ------------------------------------
   *  todo
   * ------------------------------------ */
  const [todos, setTodos] = useState([
    { id: 1, task: "Pick up kids from school", isCompleted: false },
    { id: 2, task: "Prepare for presentation", isCompleted: false },
    { id: 3, task: "Print Statements", isCompleted: false },
    { id: 4, task: "Create invoice", isCompleted: false },
    { id: 5, task: "Call John", isCompleted: false },
  ]);
  const [inputValue, setInputValue] = useState("");

  const statusChangedHandler = (e, id) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, isCompleted: e.target.checked } : t
      )
    );
  };

  const addTodo = (e) => {
    e.preventDefault();
    setTodos((prev) => [
      {
        id: prev.length ? prev[prev.length - 1].id + 1 : 1,
        task: inputValue,
        isCompleted: false,
      },
      ...prev,
    ]);
    setInputValue("");
  };

  const removeTodo = (idx) => {
    setTodos((prev) => prev.filter((_, i) => i !== idx));
  };

  /** ------------------------------------
   *  chart tab switching functions
   * ------------------------------------ */
  const switchChart = (id, newData, newData1) => {
    setActive((prev) => (prev === id ? "" : id));

    setChartState((prev) => {
      const ds1 = { ...prev.datasets[0], data: newData };
      const ds2 = { ...prev.datasets[1], data: newData1 };
      return { ...prev, datasets: [ds1, ds2] };
    });
  };

  const changeChartOneData = (e) =>
    switchChart(e.target.id, [...Array(11)].map((_, i) => (i + 1) * 10), [
      0, 25, 20, 40, 70, 52, 49, 90, 70, 94, 110,
    ]);

  const changeChartTwoData = (e) =>
    switchChart(e.target.id, [130, 145, 155, 60, 75, 65, 130, 110, 145, 149, 170], [
      0, 70, 52, 90, 25, 20, 40, 70, 49, 94, 110, 135,
    ]);

  const changeChartThreeData = (e) =>
    switchChart(e.target.id, [130, 75, 65, 130, 110, 145, 155, 60, 145, 149, 170], [
      0, 70, 52, 94, 110, 135, 90, 25, 20, 40, 70, 49,
    ]);

  const changeChartFourData = (e) =>
    switchChart(e.target.id, [130, 145, 65, 130, 75, 145, 149, 170, 110, 155, 60], [
      0, 70, 90, 25, 40, 20, 94, 110, 135, 70, 49, 52,
    ]);

  /** ------------------------------------
   *  ComponentDidMount → useEffect
   * ------------------------------------ */
  useEffect(() => {
    const visitData = {
      labels: [...Array(13)].map((_, i) => `Day ${i + 1}`),
      datasets: [
        {
          label: "Profit",
          data: [7, 6, 9, 7, 8, 6, 8, 5, 7, 8, 6, 7, 7],
          borderColor: "#6d7cfc",
          borderWidth: 3,
          fill: true,
        },
      ],
    };
    setVisitChartData(visitData);

    const Datas = [60, 75, 65, 130, 130, 145, 110, 145, 155, 149, 170];
    const Datas1 = [0, 25, 20, 40, 70, 52, 49, 90, 70, 94, 110, 135];

    const salesData = {
      labels: ["Jan 1", "Jan 7", "Jan 14", "Jan 21", "Jan 28", "Feb 4", "Feb 11", "Feb 18"],
      datasets: [
        { label: "Revenue", data: Datas, borderColor: "#8862e0", borderWidth: 2, fill: true },
        { label: "Sales", data: Datas1, borderColor: "#5ed2a1", borderWidth: 2, fill: true },
      ],
    };
    setSalesStatisticsChartData(salesData);
    setChartState(salesData); // 메인 Line chart 연결

    setNetProfitChartData({
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
      datasets: [
        {
          label: "Sales",
          backgroundColor: "rgba(88, 208, 222,0.8)",
          data: [54, 45, 60, 70, 54, 75, 60, 54],
        },
        {
          label: "Orders",
          backgroundColor: "rgba(150, 77, 247,1)",
          data: [65, 75, 70, 80, 60, 80, 36, 60],
        },
      ],
    });

    setTotaltransactionChartData({
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Sessions",
          data: [320, 280, 300, 280, 300, 270, 350],
          borderColor: "#fa394e",
          pointBackgroundColor: "#fa394e",
          pointRadius: 7,
        },
      ],
    });
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const [isClose, setIsClose] = useState(false);
  const [header, setHeader] = useState('');

  const closeModalHandler = () => {
    setIsOpen(false);
  };

  /** ------------------------------------
   *  Render
   * ------------------------------------ */
  return (
    <div>
      {/** ------------ page title ------------ */}
      <div className="row page-title-header">
          <div className="col-12">
            <div className="page-header">
              <h4 className="page-title">Dashboard</h4>
              <div className="quick-link-wrapper w-100 d-md-flex flex-md-wrap">
                <ul className="quick-links">
                  <li><a href="!#" onClick={evt =>evt.preventDefault()}>ICE Market data</a></li>
                  <li><a href="!#" onClick={evt =>evt.preventDefault()}>Own analysis</a></li>
                  <li><a href="!#" onClick={evt =>evt.preventDefault()}>Historic market data</a></li>
                </ul>
                <ul className="quick-links ml-auto">
                  <li><a href="!#" onClick={evt =>evt.preventDefault()}>Settings</a></li>
                  <li><a href="!#" onClick={evt =>evt.preventDefault()}>Analytics</a></li>
                  <li><a href="!#" onClick={evt =>evt.preventDefault()}>Watchlist</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-12">
            <div className="page-header-toolbar">
              <div className="btn-group toolbar-item" role="group" aria-label="Basic example">
                <button type="button" className="btn btn-secondary"><i className="mdi mdi-chevron-left"></i></button>
                <button type="button" className="btn btn-secondary">01/10/2025 - 31/10/2025</button>
                <button type="button" className="btn btn-secondary"><i className="mdi mdi-chevron-right"></i></button>
              </div>
              <div className="filter-wrapper">
                <div className="dropdown toolbar-item">
                  <Dropdown>
                    <Dropdown.Toggle variant="btn btn-secondary dropdown-toggle" id="dropdownMenuButton1">
                    All Day
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Header>Last Day</Dropdown.Header>
                      <Dropdown.Item>Last Month</Dropdown.Item>
                      <Dropdown.Item>Last Year</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <a href="!#" onClick={evt =>evt.preventDefault()} className="advanced-link toolbar-item">Advanced Options</a>
              </div>
              <div className="sort-wrapper justify-content-between">
              <button type="button" className="btn btn-primary" onClick={() => setIsOpen(true)}>작성하기</button>
                <Dropdown>
                  <Dropdown.Toggle variant="btn btn-secondary dropdown-toggle  toolbar-item" id="dropdownMenuButton2">
                    Export
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Header>Export as PDF</Dropdown.Header>
                    <Dropdown.Item>Export as DOCX</Dropdown.Item>
                    <Dropdown.Item>Export as CDR</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </div>
        </div>

      {/** ------------ 알바 공고 테이블 ------------ */}
      <div className="row">
          <div className="col-md-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">알바 모집 공고 !!</h4>
                <p className="card-description"> Add className <code>.table-hover</code>
                </p>
                <div className="">
                  <table className="table">
                    <thead>
                      <tr>
                        <th style={{fontWeight:'bold', fontSize:'25'}}>지역</th>
                        <th>일용이 모집글</th>
                        <th>급여</th>
                        <th> 지원여부</th>
                      </tr>
                    </thead>
                    {/* <tbody>
                      <tr>
                        <td>시흥 배곧동</td>
                        <td><Link to={`/hiring/1`}>배곧점 GS25 야간 <span className='text-danger'>급구</span>(30분 전)</Link></td>
                        <td> 10,320원 </td>
                        <td><label className="badge badge-warning">지원하기</label></td>
                      </tr>
                    </tbody> */}
                    {hiring.map((item) => (
                      <tbody>
                        <tr key={item.hiringNo}>
                          <td>{item.storeInfo.storeNm}</td>
                          <td><Link to={`/hiring/${item.hiringNo}`}>{item.hiringTitle}</Link></td>
                          <td>{item.payPerHour}</td>
                          {/* <td>석호중앙점 GS25 야간 <span className='text-danger'>급구</span>(1시간 전)</td> */}
                          {/* <td > 11,000원 </td> */}
                          <td><label className="badge badge-warning">지원하기</label></td>
                          {/* <td><label className="badge badge-danger">마감하기</label></td> */}
                        </tr>
                      </tbody>
                    ))}
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <CustModal
          open={isOpen}
          close={closeModalHandler}
          header="공고작성"            
        />
        
      {/** ------------ Chart Section ------------ */}
      <div className="row">
        <div className="col-md-8 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title mb-0">Sales Statistics Overview</h4>

              <ul className="nav nav-tabs sales-mini-tabs ml-lg-auto mb-4">
                <li className="nav-item">
                  <button id="sales-statistics_switch_1" className={`nav-link ${active === "sales-statistics_switch_1" ? "active" : ""}`} onClick={changeChartOneData}>
                    1D
                  </button>
                </li>
                <li className="nav-item">
                  <button id="sales-statistics_switch_2" className={`nav-link ${active === "sales-statistics_switch_2" ? "active" : ""}`} onClick={changeChartTwoData}>
                    5D
                  </button>
                </li>
                <li className="nav-item">
                  <button id="sales-statistics_switch_3" className={`nav-link ${active === "sales-statistics_switch_3" ? "active" : ""}`} onClick={changeChartThreeData}>
                    1M
                  </button>
                </li>
                <li className="nav-item">
                  <button id="sales-statistics_switch_4" className={`nav-link ${active === "sales-statistics_switch_4" ? "active" : ""}`} onClick={changeChartFourData}>
                    1Y
                  </button>
                </li>
              </ul>

              <Line data={chartState} options={salesStaticsOptions} height={50} />
            </div>
          </div>
        </div>

        <div className="col-md-4 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4>Net Profit Margin</h4>
              <Radar data={netProfitChartData} options={netProfitOptions} height={280} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
