import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './recent.css';
//@ts-ignore
import Navbar from '../../components/Navbar/Navbar';


function Recent() {
    return (
        <div className="website-container">
            <header>
            <Link to= '/dashboard'><h3>Memo</h3></Link>
            </header>
            <div className="main-container">
                <div>
                <Navbar />
                </div>
                <div className="content-container">
                    <h2 className="text-color">Recent</h2>
                </div>
            </div>
        </div>
    );
}

export default Recent;
