import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Spinner } from "react-bootstrap";
import { Children } from "react";

const ProtectedRoutes = () => {
    const { isAuthenticated, loading } = useAuth()

    if (loading) {
        return(
            <div className='d-flex flex-column justify-content-center align-items-center' style={{ minHeight: "100vh"}}>
                <Spinner animation='border' variant='primary' />
                <p className='visually-hidden'>Cargando...</p>
            </div>
        )
    }

    if(!isAuthenticated){
        return <Navigate to='/' state={{openLogin: true}} replace/>
    }

    return <Outlet/>;
}

export default ProtectedRoutes;