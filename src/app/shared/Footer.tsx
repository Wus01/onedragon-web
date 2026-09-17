import React from 'react';

const Footer  = () => {
    return (
      <footer className="footer">
        <div className="container-fluid">
          <div className="d-sm-flex align-items-center justify-content-between py-2 w-100 footer-content">
            <div className="footer-brand">
              <span><i className="mdi mdi-briefcase-check-outline" aria-hidden="true" /></span>
              <strong>일용이네</strong>
            </div>
            <span>가까운 일자리와 좋은 사람을 연결합니다.</span>
            <span>© 2026 OneDragon</span>
          </div>
        </div>
      </footer>
    );
};

export default Footer;
