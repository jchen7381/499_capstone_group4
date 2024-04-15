import { createContext, useContext, useState } from "react";

export const AuthContext = createContext({
    user: [],
    setUser: () => {}
});

//Wrap consumers inside this
export default function AuthContextProvider({children}){
    const [user, setUser] = useState(false)
    return(
        <AuthContext.Provider value={{user, setUser}}>
            {children}
        </AuthContext.Provider>
    )
}

//
export function useAuthContext(){
    const context = useContext(AuthContext)
    if (!context){
        throw new Error("Dashboard context should be used within DashboardContextProvider")
    }
    return context
}