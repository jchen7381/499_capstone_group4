import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import './dashboard.css';
import { useDashboardContext } from '../../utility/DashboardContext';
import Header from '../../components/Header/Header';
import FilterDropdown from '../../components/FilterDropdown/FilterDropdown';
import WorkspaceCard from '../../components/WorkspaceCard/WorkspaceCard';

function Dashboard() {
    const {workspaces, favorite, dispatch} = useDashboardContext()
    const [filterOption, setFilterOption] = useState('All')
    const filteredWorkspaces = filterOption == 'All' ? workspaces :workspaces.filter(workspace => {
        switch(filterOption){
            case 'Favorite':
                return workspace.favorite == true;
        }
    });
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
                <div>
                    <button className='create-workspace-button' onClick={createWorkspace}>+ New Workspace</button>
                    <FilterDropdown onFilterSelect={setFilterOption}/>
                </div>
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