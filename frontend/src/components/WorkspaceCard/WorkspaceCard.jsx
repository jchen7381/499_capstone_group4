import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoHeartOutline, IoTrashOutline, IoSettingsSharp, IoHeartSharp  } from "react-icons/io5";
import './WorkspaceCard.css';

const WorkspaceCard = ({workspace, onFavorite, onDelete}) => {
    const [isOpen, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    const toggleDropdown = (e) => {
        e.stopPropagation();
        e.preventDefault();
        setOpen(!isOpen)
    }
    useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

    return(
        <Link to={`/workspace/${workspace.workspace_id}`} key={workspace.workspace_id} state={workspace} ref={dropdownRef}>
        <div className="workspace-card" ref={dropdownRef}>
                <div className="card-content">
                    <div className="card-actions">
                      <div onClick={(e) => {e.preventDefault(); onFavorite(workspace.workspace_id)}}>{workspace.favorite ? <IoHeartSharp /> : <IoHeartOutline />}</div>
                      <div onClick={(e) => {e.preventDefault(); onDelete(workspace.workspace_id)}}><IoTrashOutline /></div>
                  </div>
                    <div className="card-title">{workspace.title}</div>
                </div>
        </div>
        </Link>
    )
}

export default WorkspaceCard;