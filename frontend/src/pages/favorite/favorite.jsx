import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import './favorite.css';
import { useDashboardContext } from '../../utility/DashboardContext';
import Header from '../../components/Header/Header';
import WorkspaceCard from '../../components/WorkspaceCard/WorkspaceCard';

function Dashboard() {
    const {workspaces, dispatch} = useDashboardContext();
    const [filterOption] = useState('Favorite'); // Set default filter to 'Favorite'
    const [filteredWorkspaces, setFilteredWorkspaces] = useState([]);

    useEffect(() => {

        switch(filterOption){
            case 'Favorite':
                setFilteredWorkspaces(workspaces.filter(workspace => workspace.favorite));
                break;
            default:
                setFilteredWorkspaces(workspaces);
        }
    }, [workspaces, filterOption]);

    async function favorite(id){
        try {
            const res = await fetch('http://127.0.0.1:5000/workspace/favorite', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({'workspace_id': id})
            });
            const ret = await res.json();
            if (res.ok) {
                console.log('Workspace favorited')
                dispatch({type:'favoriteWorkspace', payload: id})
            }
        } catch (error) {
            console.log('Failed to favorite workspace:' + id)
            console.log('Error:', error);
        }
    }
    async function remove(id){
        try {
            const res = await fetch('http://127.0.0.1:5000/workspace/delete', {
                method: 'POST',
                credentials:'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({'workspace_id': id})
            });
            const ret = await res.json();
            if (res.ok) {
                console.log('Successfully deleted workspace: ')
                dispatch(({type: 'deleteWorkspace', payload: id}))
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
             <h2 className="favorites-text">Favorites</h2> 
                <div className='workspaces'>
                    {filteredWorkspaces.length ? 
                        <div className='items'>
                            {filteredWorkspaces.map(workspace => (
                                    <WorkspaceCard key={workspace.workspace_id} workspace={workspace} onFavorite={favorite} onDelete={remove}/>
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
