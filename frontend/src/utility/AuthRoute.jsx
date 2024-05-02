import { Route, Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "./AuthContext";

const RequireAuth = ({children}) => {
    let auth = useAuthContext()
    let location = useLocation()
    return auth.user ? children : <Navigate to="/login" />
}
export default RequireAuth;