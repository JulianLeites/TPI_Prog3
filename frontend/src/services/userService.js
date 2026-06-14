export const getUsersApi = async () => {
    const token = localStorage.getItem('token')

    const response = await fetch ('http://localhost:3000/profile/users', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    if (!response.ok){
        throw new Error ('Error al obtener usuarios')
    }

    return await response.json()
}

export const updateUserRolApi = async (userId, newRol) => {
    const token = localStorage.getItem('token')

    const response = await fetch(`http://localhost:3000/profile/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({rol: newRol})
    })

    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update user rol');
    }
    return true;
}

export const editUserProfileApi = async (camposEditables) => {
    const token = localStorage.getItem('token');
    
    const updateUrl = `http://localhost:3000/profile/users`

    const response = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(camposEditables)
    });

    if (!response.ok) {
        let errorMessage = 'Error updating profile';
        try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
        } catch (error) {
            errorMessage = `Error del servidor (${response.status})`;
        }
        throw new Error(errorMessage);
    }

    return await response.json();
};

export const deleteUserApi = async (userId) => {
    const token = localStorage.getItem('token');

    const response = await fetch(`http://localhost:3000/profile/users/${userId}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to delete user');
    }

    return true;
};