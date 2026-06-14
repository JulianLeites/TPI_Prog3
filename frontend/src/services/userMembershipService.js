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

export const getUserMembershipApi = async (userId = null) => {
    const token = localStorage.getItem('token')

    const url = userId ? `http://localhost:3000/profile/memberships/user/${userId}` : 'http://localhost:3000/profile/memberships'

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })

    if(!response.ok){
        throw new Error('Cannot get membership data')
    }

    return await response.json()
}

export const cancelMembershipApi = async (userId = null) => {
    const token = localStorage.getItem('token')

    const url = userId ? `http://localhost:3000/profile/memberships/cancel/${userId}` : 'http://localhost:3000/profile/memberships/cancel'

    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })

    if(!response.ok) {
        throw new Error('Error canceling membership')
    }

    return await response.json()
}