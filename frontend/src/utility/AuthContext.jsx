import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext({
    user: [],
    setUser: () => {}
});

//Wrap consumers inside this
export default function AuthContextProvider({children}){
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    useEffect(() =>{
        checkAuth()        
    }, [])
    useEffect(() =>{
        console.log(user)        
    }, [user])
    function getTokens() {
        var result = document.cookie.match(new RegExp('session' + '=([^;]+)'));
        result && (result = JSON.parse(result[1]));
        return result;
    }
    useEffect(() =>{
        console.log(loading)        
    }, [loading])
    async function checkAuth() {
        const tokens = getTokens()
        if (!tokens){   
            setUser(false)
        }
        else(
            setUser(true)
        )
        setLoading(false)    
    }
    if (!loading){
        return(
            <AuthContext.Provider value={{user, setUser}}>
                {children}
            </AuthContext.Provider>
        )
    }
}

//
export function useAuthContext(){
    const context = useContext(AuthContext)
    if (!context){
        throw new Error("Dashboard context should be used within DashboardContextProvider")
    }
    return context
}