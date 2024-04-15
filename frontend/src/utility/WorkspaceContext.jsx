import { createContext, useContext, useState } from "react";

export const WorkspaceContext = createContext({
    workspace: null,
    setWorkspace: () => {},       
});

//Wrap consumers inside this
export default function WorkspaceContextProvider({children}){
    const [workspace, setWorkspace] = useState(null)
    return(
        <WorkspaceContext.Provider value={{workspace, setWorkspace}}> 
            {children}
        </WorkspaceContext.Provider>
    )
}

//
export function useWorkspaceContext(){
    const context = useContext(WorkspaceContext)
    if (!context){
        throw new Error("Workspace context should be used within DashboardContextProvider")
    }
    return context
}