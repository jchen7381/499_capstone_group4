import React, { useEffect, useState } from 'react';
import './Sidebar.css';
import { IoHeartOutline,IoHeartSharp, IoBookOutline, IoExitOutline, IoHomeOutline, IoLogoOctocat } from "react-icons/io5";
import { Link, useParams } from 'react-router-dom';
import { useDashboardContext } from '../../utility/DashboardContext';
const Sidebar = ({favoriteStatus}) => {
  const [favorite, setFavorite] = useState(favoriteStatus)
  useEffect(() => {
  }, [favorite])
  const location = useParams()
  async function favoriteWorkspace(){
    try {
        const res = await fetch('http://127.0.0.1:5000/workspace/favorite', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'workspace_id': location.id})
        });
        const ret = await res.json();
        if (res.ok) {
          console.log('Workspace favorited')
          setFavorite(!favorite)
        }
    } catch (error) {
        console.log('Failed to favorite workspace:' + location.id)
        console.log('Error:', error);
    }
}
  return (
    <div className="sidebar-container">
      <div className="logo">
        <IoLogoOctocat size={25} color="black" />
      </div>
      <div className='sidebar-content'>
          <ul>
            <Link to="/dashboard"><li><button className="dashboard"><IoHomeOutline/></button></li></Link>
            <li><button className="favorite" onClick={favoriteWorkspace}>
              {favorite ? <IoHeartSharp/>:<IoHeartOutline />}
            </button></li>
            <Link to="/library"><li><button className="library"><IoBookOutline/></button></li></Link>
            <Link to="/login"><button className="logout"><IoExitOutline/></button></Link>
          </ul>
        </div>
      </div>
  );
}

export default Sidebar;