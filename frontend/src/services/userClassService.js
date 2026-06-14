export const assignUserToClassApi = async (classId) => {
    const token = localStorage.getItem('token')

    const response = await fetch(`http://localhost:3000/profile/classes/assign/${classId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })

    if(!response.ok){
        throw new Error('Error procesing class')
    }

    return await response.json()
}

export const getUSerClassesApi = async (userId = null) => {
    const token = localStorage.getItem('token')

    const url = userId ? `http://localhost:3000/profile/classes/user/${userId}` : 'http://localhost:3000/profile/classes'

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })

    if(!response.ok){
        throw new Error('Cannot get classes data')
    }

    return await response.json()
}

export const leaveClassApi = async (userId = null, classId) => {
    const token = localStorage.getItem('token')

    const url = userId ? `http://localhost:3000/profile/classes/${classId}/user/${userId}` : `http://localhost:3000/profile/classes/${classId}`

    const response = await fetch(url, {
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })

    if(!response.ok) {
        throw new Error('Failed to leave class');
    }

    return await response.json()
}