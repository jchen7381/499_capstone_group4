import React, { useState } from 'react';
import './Sidebar.css';
import { IoHeartOutline, IoBookmarkOutline, IoExitOutline, IoDocumentOutline, IoLogoOctocat } from "react-icons/io5";
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [buttonVisible, setButtonVisible] = useState(true);

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
            <li><button className="library"><IoBookmarkOutline/></button></li>
            <li><button className="history"><IoDocumentOutline/></button></li>
            <Link to="/home">
              <button className="logout"><IoExitOutline/></button>
            </Link>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
