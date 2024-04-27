import { Link } from 'react-router-dom';
import './test.css'
import Navbar from '../../components/Navbar/Navbar';
import { useState } from 'react';
const Test = () => {
    const [workspaces, setWorkspaces] = useState([
        {'id':1, 'name':'My Workspace'},
        {'id':2, 'name':'My Workspace'},
        {'id':3, 'name':'My Workspace'},
        {'id':4, 'name':'My Workspace'},
        {'id':5, 'name':'My Workspace'},
        {'id':6, 'name':'My Workspace'},
        {'id':7, 'name':'My Workspace'},
        {'id':8, 'name':'My Workspace'},
        {'id':9, 'name':'My Workspace'},
        {'id':10, 'name':'My Workspace'},
        {'id':10, 'name':'My Workspace'},
        {'id':10, 'name':'My Workspace'},
        {'id':10, 'name':'My Workspace'},

    ])
    return (
        <div className='dashboard-container'>
            <header className='topNav'><Link to='/dashboard'><h3>Memo</h3></Link></header>
            <div className='sideNav'>
                    <ul>
                        <li>Home</li>
                    </ul>
                </div>
            <div className='dashboard-content'>
                <div className='dashboard-content-workspaces'>
                    {workspaces.map(workspace => (
                        <div key={workspace.id}className='dashboard-content-workspace-item'>
                            a
                        </div>
                    ))}
                </div>
            </div>
        </div>       
    )
}

export default Test;