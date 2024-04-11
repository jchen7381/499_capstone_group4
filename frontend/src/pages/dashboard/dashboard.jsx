import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
//@ts-ignore
import './dashboard.css';

function Dashboard() {
    const [workspaces, setWorkspaces] = useState([]);
    useEffect(() => {
        if (!workspaces.length) {
            getWorkspaces();
        }
    }, []);
    function getTokens() {
        var result = document.cookie.match(new RegExp('session' + '=([^;]+)'));
        result && (result = JSON.parse(result[1]));
        return result;
    }
    async function getWorkspaces() {
        try {
            const res = await fetch('http://127.0.0.1:5000/get-workspaces', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(getTokens())
            });
            const ret = await res.json();
            if (res.ok) {
                setWorkspaces(ret);
            } else {
                alert('fail!');
            }
        } catch (error) {
            console.log('Error:', error);
        }
    }
    async function createWorkspace() {
        try {
            const res = await fetch('http://127.0.0.1:5000/create-workspace', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(getTokens())
            });
            const ret = await res.json();
            if (res.ok) {
                alert('success');
            } else {
                alert('fail!');
            }
        } catch (error) {
            console.log('Error:', error);
            alert('Login failed!');
        }
    }

    return (
        <div className="website-container">
            <header>
                <h3>Dashboard</h3>
            </header>
            <div className="main-container">
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/workspace">Workspace</Link></li>
                </ul>
            </nav>
            <div className="dashboard-container">
                    <div className='content-container'>
                        <div className='buttons'>
                            <button onClick={createWorkspace}>New workspace</button>
                        </div>
                        {workspaces.length > 0 ?
                            <div className='items'>
                                {workspaces.map(workspace => (
                                    <Link to={`/workspace`}><div className='display-item'></div></Link>
                                ))}
                            </div>
                            :
                            <div><button onClick = {createWorkspace}></button></div>
                    
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
