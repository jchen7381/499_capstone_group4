import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
//@ts-ignore
import Navbar from '../../components/Navbar/Navbar';
import './favorite.css';
import { useDashboardContext } from '../../utility/DashboardContext';
import Header from '../../components/Header/Header';

function Favorite() {
    const {workspaces, setWorkspace} = useDashboardContext()
    const favorite = workspaces.filter((workspaces) => {return workspaces.favorite == true})
    console.log(favorite)
    return (
        <div className="website-container">
            <Header />
            <Navbar />
            <div className="main-container">
                <div className="content-container">
                    <h2 className="text-color">Favorite</h2>
                    <div>{favorite.map(workspace => (
                        <div>{workspace.workspace_id}</div>
                    ))}</div>
                </div>
            </div>
        </div>
    );
}

export default Favorite;
