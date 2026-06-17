import {createContext, useContext, useState, useEffect} from 'react'

import { getUSerClassesApi } from '../services/userClassService'
import { useAuth } from './AuthContext'

const EnrollmentContext = createContext()

export const EnrollmentProvider = ({ children }) => {
    const { user } = useAuth()

    const [enrollments, setEnrollments] = useState([])
    const [loagingEnrollments, setLoadingEnrollments] = useState(true)

    const fetchEnrollments = async () => {
        try {
            const data = await getUSerClassesApi()
            setEnrollments(data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoadingEnrollments(false)
        }
    }

    useEffect(() => {
        if(user) {
            fetchEnrollments()
        } else {
            setEnrollments([])
            setLoadingEnrollments(false)
        }
    }, [user])

    return (
        <EnrollmentContext.Provider
            value={{
                enrollments,
                setEnrollments,
                fetchEnrollments,
                loagingEnrollments
            }}
        >
            {children}
        </EnrollmentContext.Provider>      
    )
}

export const useEnrollment = () => {
    return useContext(EnrollmentContext)
}
