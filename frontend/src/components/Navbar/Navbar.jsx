import React from 'react';
import { Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
    return (
        <nav>
            <ul>
                <li><NavLink exact to="/dashboard" activeClassName="active-link">Dashboard</NavLink></li>
                <li><NavLink exact to="/recent" activeClassName="active-link">Recent</NavLink></li>
                <li><NavLink exact to="/favorite" activeClassName="active-link">Favorite</NavLink></li>
                <li><NavLink exact to="/library" activeClassName="active-link">Library</NavLink></li>
                <li><NavLink exact to="/login" activeClassName="active-link">Logout</NavLink></li>
            </ul>
        </nav>
    );
}

export default Navbar;
