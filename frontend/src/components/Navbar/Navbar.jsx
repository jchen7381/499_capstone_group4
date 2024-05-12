import React from 'react';
import { Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
    return (
        <div className='navbar-container'>
            <h3>Memo</h3>
        <nav>
            <ul>
                <li className='link'><NavLink exact to="/dashboard" activeClassName="active-link">Dashboard</NavLink></li>
                <li><NavLink exact to="/library" activeClassName="active-link">Library</NavLink></li>
                <li><NavLink exact to="/login" activeClassName="active-link">Logout</NavLink></li>
            </ul>
        </nav>
        </div>
    );
}

export default Navbar;
