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