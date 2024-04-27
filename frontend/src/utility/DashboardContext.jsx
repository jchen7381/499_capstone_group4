import { createContext, useContext, useEffect, useReducer } from "react";

const initialState = {
    workspaces: [],
    files: []
}

const DashboardContext = createContext();

function reducer(state, action){
    switch(action.type){
        case 'favoriteWorkspace':{
            const workspace = state.workspaces.find((workspace) => workspace.workspace_id == action.payload)
            workspace.favorite ? workspace.favorite = false : workspace.favorite = true
            return{
                ...state,
                workspaces: [...state.workspaces]
            }
        }
        case 'deleteWorkspace':{
            const newState = state.workspaces.filter((workspace) => workspace.workspace_id !== action.payload)
            return{
                ...state,
                workspaces: [...newState]
            }
        }
        case 'createWorkspace':{
            return{
                ...state,
                workspaces: [...state.workspaces, ...action.payload]
            }
        }
        case 'getWorkspaces':{
            return{
                ...state,
                workspaces: action.payload
            }
        }
        case 'getFiles':{
            return{
                ...state,
                files: action.payload
            }
        }
    }
}

//Wrap consumers inside this
export default function DashboardContextProvider({children}){
    const [state, dispatch] = useReducer(reducer, initialState)   
    useEffect(() => {
        console.log('hi')
        getWorkspaces()
        getFiles()
    }, []);

    async function getWorkspaces() {
        try {
                const res = await fetch('http://127.0.0.1:5000/get-workspaces', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            });
            const ret = await res.json();
            dispatch({type:'getWorkspaces', payload: ret})
        } catch (error) {
            console.log('Unable to fetch workspaces')
            console.log('Error:', error);
        }
    }
    async function getFiles(){
        try{
            const res = await fetch('http://127.0.0.1:5000/user/library/get',{
                method: 'POST',
                credentials: 'include',
                headers:{
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            const ret = await res.json()
            dispatch({type:'getFiles', payload: ret})
        }
        catch (error){
            console.log('Failed to get files')
            console.log('Error:', error);
        }
    }
    return(
        <DashboardContext.Provider value={{files: state.files, workspaces:state.workspaces, dispatch}}>
            {children}
        </DashboardContext.Provider>
    )
}

export function useDashboardContext(){
    const context = useContext(DashboardContext)
    if (!context){
        throw new Error("Dashboard context should be used within DashboardContextProvider")
    }
    return context
}