import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { useAuthContext } from '../../utility/AuthContext';
import Navbar from '../../components/Navbar/Navbar';
import './dashboard.css';
import { useDashboardContext } from '../../utility/DashboardContext';

function Dashboard() {
    const {workspaces, setWorkspace} = useDashboardContext();
    const {user, setUser} = useAuthContext();
    useEffect(() => {
        if (workspaces.length) {
            console.log(workspaces)
        }
    }, [workspaces]);
    function getTokens() {
        var result = document.cookie.match(new RegExp('session' + '=([^;]+)'));
        result && (result = JSON.parse(result[1]));
        return result;
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
                setWorkspace([...workspaces, ...ret])
            } else {
                alert('fail!');
            }
        } catch (error) {
            console.log('Error:', error);
        }
    }
    async function deleteWorkspace(e){
        e.preventDefault()
        e.stopPropagation()
        const tokens = getTokens()
        console.log(e.target.value)
        try {
            const res = await fetch('http://127.0.0.1:5000/workspace/delete', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({'access_token': tokens.access_token, 'refresh_token': tokens.refresh_token, 'workspace_id': e.target.value})
            });
            const ret = await res.json();
            if (res.ok) {
                setWorkspace(oldValues => {
                    return oldValues.filter(workspaces => workspaces.workspace_id !== e.target.value)
                  })
            } else {
                alert('fail!');
            }
        } catch (error) {
            console.log('Error:', error);
        }
    }

    return (
        <div className="website-container">
            <header>
            <Link to= '/dashboard'><h3>Memo</h3></Link>
            </header>
            <div className="main-container">
                <div>
                <Navbar />
                </div>
                <div className="contentview-container">
                    <div className='content-container'>
                        <h2 className="text-color">Dashboard</h2>
                        <div className='new-workspace'>
                            <button onClick={createWorkspace}>+ New workspace</button>
                        </div>
                        {workspaces.length > 0 ?
                            <div className='items'>
                                {workspaces.map(workspace => (
                                    <Link to={`/workspace/${workspace.workspace_id}`} key={workspace.workspace_id} state={workspace} >
                                        <div className='display-item'>
                                            <button value={workspace.workspace_id} onClick={(e) => deleteWorkspace(e)}>
                                                Delete
                                            </button>
                                        </div>
                                    </Link>
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