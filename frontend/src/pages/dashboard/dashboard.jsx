import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import {createClient} from '../../utility/client' 
// @ts-ignore
import './dashboard.css'

function Dashboard(){
    const supabase = createClient()
    const [workspaces, setWorkspaces] = useState([])
    useEffect(() =>{
        session()
        getWorkspace()
    }, [])
    async function session(){
        var result = document.cookie.match(new RegExp('session' + '=([^;]+)'))
        result && (result = JSON.parse(result[1]));
        const {data, error} = await supabase.auth.setSession(result)
    }
    async function getWorkspace(){
        const {data, error} =  await supabase.rpc('get_workspaces')
        if (data){
            console.log('Success!', data)
            setWorkspaces(data)
        }
        else{
            console.log('Failed!', error)
        }
    }
    async function createWorkspace(){
        const {data, error} = await supabase.rpc('create_workspace')
        if (data){
            console.log('Success!', data)
            getWorkspace()
        }
        else{
            console.log('Failed!', error)
        }
    }

    return(
        <div id='dashboard-container'>
            <div id='header'><h1>Dashboard</h1></div>  
            <div><button onClick={createWorkspace}>Create workspace</button></div>
            <div id='content'>
                {workspaces.length > 0 ?
                    <div className='items'>
                    {workspaces.map(workspace => (
                        <Link to={'/workspace/' + workspace.workspace_id}><div className='display-item'></div></Link>
                        ))}
                    </div>
                    :
                    <div>
                        Get started by creating a new workspace
                        <button onClick={createWorkspace}>Create new workspace</button>
                    </div>
                    
                    
                }
            </div>
        </div>
    );
}

export default Dashboard;