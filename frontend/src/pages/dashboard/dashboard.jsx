import React, { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../utility/AuthContext';
import Navbar from '../../components/Navbar/Navbar';
import './dashboard.css';
import { useDashboardContext } from '../../utility/DashboardContext';
import Header from '../../components/Header/Header';


function Dashboard() {
    const {workspaces, dispatch} = useDashboardContext()
    const navigate = useNavigate()
    useEffect(() => {
        console.log(workspaces)
    }, [workspaces])

    async function createWorkspace() {
        try {
            const res = await fetch('http://127.0.0.1:5000/create-workspace', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            });
            const ret = await res.json();
            if (res.ok) {
                dispatch({type: 'createWorkspace', payload: ret})
            } else {
                alert('fail!');
            }
        } catch (error) {
            console.log('Error:', error);
        }
    }
    async function favorite(e){
        e.preventDefault()
        e.stopPropagation()
        try {
            const res = await fetch('http://127.0.0.1:5000/workspace/favorite', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({'workspace_id': e.target.value})
            });
            const ret = await res.json();
            if (res.ok) {
                console.log('Workspace favorited')
                dispatch({type:'favoriteWorkspace', payload: e.target.value})
            }
        } catch (error) {
            console.log('Failed to favorite workspace:' + e.target.value)
            console.log('Error:', error);
        }
    }
    async function remove(e){
        e.preventDefault()
        e.stopPropagation()
        console.log(e.target.value)
        try {
            const res = await fetch('http://127.0.0.1:5000/workspace/delete', {
                method: 'POST',
                credentials:'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({'workspace_id': e.target.value})
            });
            const ret = await res.json();
            if (res.ok) {
                console.log('Successfully deleted workspace: ')
                dispatch(({type: 'deleteWorkspace', payload: e.target.value}))
            } else {
                console.log('Failed to delete workspace');
            }
        } catch (error) {
            console.log('Error:', error);
        }
    }

    return (
        <div className="website-container">
            <Header />
            <Navbar />
            <div className='dashboard-content'>
                <button className='create-workspace-button' onClick={createWorkspace}>+ New Workspace</button>
                <div className='workspaces'>
                    {workspaces.length ? 
                        <div className='items'>
                            {workspaces.map(workspace => (
                                    <Link to={`/workspace/${workspace.workspace_id}`} key={workspace.workspace_id} state={workspace} >
                                        <div className='workspace'>
                                            <button className='delete-button'value={workspace.workspace_id} onClick={(e) => remove(e)}>
                                                Delete
                                            </button>
                                            <div className='workspace-title'>{workspace.title}</div>
                                        </div>
                                    </Link>
                                ))}
                        </div>
                        :
                        <div></div>
                    }
                </div>
            </div>
        </div>
    );
}

export default Dashboard;