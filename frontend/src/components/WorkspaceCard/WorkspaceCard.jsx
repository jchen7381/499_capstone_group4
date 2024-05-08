import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { IoHeartOutline, IoTrashOutline, IoSettingsSharp  } from "react-icons/io5";
import './WorkspaceCard.css';

const WorkspaceCard = ({workspace, onFavorite, onDelete}) => {
    const [isOpen, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    const toggleDropdown = (e) => {
        e.stopPropagation();
        e.preventDefault();
        setOpen(!isOpen)
    }
    return(
        <Link to={`/workspace/${workspace.workspace_id}`} key={workspace.workspace_id} state={workspace} >
        <div className="workspace-card" ref={dropdownRef}>
                <div className="card-content">
                    <div className="card-title">{workspace.title}</div>
                </div>
                <div className="card-action">
                    <IoSettingsSharp onClick={toggleDropdown}/>
                    {isOpen && (
                        <div className="card-actions">
                        <button onClick={(e) => {e.preventDefault(); onFavorite(workspace.workspace_id)}}><IoHeartOutline /> Favorite</button>
                        <button onClick={(e) => {e.preventDefault(); onDelete(workspace.workspace_id)}}><IoTrashOutline />Delete</button>
                    </div>
                    )}
                </div>
        </div>
        </Link>
    )
}

export default WorkspaceCard;