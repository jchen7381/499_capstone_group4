import { createContext, useContext, useEffect, useState } from "react";

export const DashboardContext = createContext({
    workspaces: [],
    setWorkspace: () => {},       
});
//Wrap consumers inside this
export default function DashboardContextProvider({children}){
    const [workspaces, setWorkspace] = useState([])   
    const [files, setFile] = useState([])
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
                setWorkspace(ret);
            } else {
                alert('fail!');
            }
        } catch (error) {
            console.log('Error:', error);
        }
    }
    return(
        <DashboardContext.Provider value={{workspaces, setWorkspace}}>
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