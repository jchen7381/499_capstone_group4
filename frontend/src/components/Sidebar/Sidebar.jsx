import React, { useState } from 'react';
import './Sidebar.css';
import { IoHeartOutline, IoBookmarkOutline, IoExitOutline, IoDocumentOutline, IoLogoOctocat } from "react-icons/io5";
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
    setButtonVisible(!buttonVisible);

  };
  


  return (
    <div className="box">
      <div className="logo" onClick={toggleSidebar}>
        <IoLogoOctocat size={25} color="black" />
      </div>
      <div className={`sidebar ${sidebarVisible ? 'visible' : ''}`}>
        <div className={`button ${buttonVisible ? 'visible' : ''}`}>
          <ul>
            <li><button className="favorite"><IoHeartOutline/></button></li>
            <Link to="/dashboard">
            <li><button className="library"><IoDocumentOutline/></button></li>
            </Link>
            <li><button className="history"><IoBookmarkOutline/></button></li>
            <Link to="/login">
              <button className="logout"><IoExitOutline/></button>
            </Link>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
