import { createContext, useContext, useState, useEffect, Children } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkLogin = async () => {
            const token = localStorage.getItem('token')

            if(!token) {
                setUser(null)
                setIsAuthenticated(false)
                setLoading(false)
                return
            }

            try {
                const response = await fetch('http://localhost:3000/verify', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                if(response.ok){
                    const data = await response.json()
                    setUser(data.user)
                    setIsAuthenticated(true)
                } else {
                    localStorage.removeItem('token')
                    setUser(null)
                    setIsAuthenticated(false)
                }
            } catch (error) {
                console.error('Error al verificar el token', error)
                setIsAuthenticated(false)
            } finally {
                setLoading(false)
            }
        }
        checkLogin()
    }, [])

    const login = (userData, token) => {
        localStorage.setItem('token', token)
        setUser(userData)
        setIsAuthenticated(true)
    }

    const logout = () => {
        localStorage.removeItem('token')
        setUser(null)
        setIsAuthenticated(false)
    }

    const updateUserContext = (newUserData) => {
        setUser(prevUser => ({
            ...prevUser,
            ...newUserData
        }))
    }

    return (
        <AuthContext.Provider value={{user, isAuthenticated, loading, login, logout, updateUserContext}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext)
}