import React from "react";
import { Link } from "react-router-dom";
import { IoHeartOutline, IoTrashOutline } from "react-icons/io5";
import './WorkspaceCard.css';

const WorkspaceCard = ({workspace, onFavorite, onDelete}) => {
    return(
        <div className="workspace-card">
            <Link>
                <div className="card-content">
                    <h3 className="card-title">{workspace.title}</h3>
                </div>
                <div className="card-actions">
                    <button onClick={() => onFavorite(workspace.workspace_id)}><IoHeartOutline /></button>
                    <button onClick={() => onDelete(workspace.workspace_id)}><IoTrashOutline /></button>
                </div>
            </Link>
        </div>
    )
}

export default WorkspaceCard;