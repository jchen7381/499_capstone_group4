import React, { useState } from 'react';
import './Sidebar.css';
import { IoHeartOutline,IoHeartSharp, IoBookOutline, IoExitOutline, IoHomeOutline, IoLogoOctocat } from "react-icons/io5";
import { Link, useParams } from 'react-router-dom';
import { useDashboardContext } from '../../utility/DashboardContext';
const Sidebar = () => {
  const location = useParams()
  const {workspaces, favorite, dispatch} = useDashboardContext()
  const currWorkspace = workspaces.find(workspace => workspace.workspace_id == location.id)

  return (
    <div className="sidebar-container">
      <div className="logo">
        <IoLogoOctocat size={25} color="black" />
      </div>
      <div className='sidebar-content'>
          <ul>
            <Link to="/dashboard"><li><button className="dashboard"><IoHomeOutline/></button></li></Link>
            <Link to="/favorite"><li><button className="favorite" onClick={(e) => {e.preventDefault(); favorite(currWorkspace.workspace_id)}}>
              {currWorkspace.favorite ? <IoHeartSharp/> : <IoHeartOutline />}
            </button></li></Link>
            <Link to="/library"><li><button className="library"><IoBookOutline/></button></li></Link>
            <Link to="/login"><button className="logout"><IoExitOutline/></button></Link>
          </ul>
        </div>
      </div>
  );
}

export default Sidebar;