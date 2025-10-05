import './App.css';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './app/user-pages/Login';
import Register from './app/user-pages/Register';

function App() {
  return (

    <div className="App">

        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* 기존 라우트들 */}
        </Routes>
    </div>
  );
}

export default App;
