import React from 'react';
import './Sidebar.css';
import { IoHeartOutline, IoBookmarkOutline, IoExitOutline, IoDocumentOutline, IoLogoOctocat } from "react-icons/io5";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo"><IoLogoOctocat size={22} color="white" /></div>
      <ul>
        <li><button className="favorite"><IoHeartOutline size={22} color="white" /></button></li>
        <li><button className="library"><IoBookmarkOutline size={22} color="white" /></button></li>
        <li><button className="history"><IoDocumentOutline size={22} color="white" /></button></li>
      </ul>
      <button className="logout-button"><IoExitOutline size={22} color="white" /></button>
    </div>
  );
}

export default Sidebar;