export const assignUserToMembershipApi = async (membershipId, data) => {
    const token = localStorage.getItem('token')

    const response = await fetch(`http://localhost:3000/profile/memberships/assign/${membershipId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    })

    if(!response.ok){
        throw new Error('Error procesing membeship')
    }

    return await response.json()
}