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
        authCheck()        
    }, [])

    async function authCheck(){
        try {
            const res = await fetch('http://127.0.0.1:5000/auth/check', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            });
              const auth_status = await res.json()
              if (res.ok){
                setUser(auth_status)
                setLoading(false)
              }
        } catch (error) {
            setUser(false)
            setLoading(false)
            console.log('Error:', error);
        }
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