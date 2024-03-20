// pages/HomePage.tsx
import React from 'react';
import './home.css';
// @ts-ignore
import Sidebar from '../components/Sidebar/Sidebar';

function Home() {
  return (
    <div className="app-container">
      <div className="main-container">
        <Sidebar />
        <div className="content">
          <div className="right-sidebar gray-bg">
            <div className="rectangle padding">Insert PDF</div>
          </div>
          <div className="right-sidebar white-bg">
            <div className="rectangle padding">Text Editor</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
