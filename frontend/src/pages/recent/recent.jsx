import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './recent.css';
//@ts-ignore
import Navbar from '../../components/Navbar/Navbar';
import Header from '../../components/Header/Header';

function Recent() {
    return (
        <div className="website-container">
            <Header />
            <Navbar />
            <div className="main-container">
                <div className="content-container">
                    <h2 className="text-color">Recent</h2>
                </div>
            </div>
        </div>
    );
}

export default Recent;
