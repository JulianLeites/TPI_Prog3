export const getClassesApi = async () => {
    const response = await fetch('http://localhost:3000/classes')

    if(!response.ok){
        throw new Error('Error getting Classes')
    }

    return await response.json()
}

export const createClassApi = async (formData) => {
    const token = localStorage.getItem('token')

    const response = await fetch(`http://localhost:3000/classes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
    })

    if (!response.ok) {
        throw new Error('Failed to create class');
    }

    return await response.json()
}

export const updateClassApi = async (id, formData) => {
    const token = localStorage.getItem('token')

    const response = await fetch(`http://localhost:3000/classes/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
    });

    if(!response.ok) {
        throw new Error ('Failed to update class');
    }

    return await response.json()
}

export const deleteClassApi = async (id) => {
    const token = localStorage.getItem('token')

    const response = await fetch(`http://localhost:3000/classes/${id}`, {
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    if(!response.ok) {
        throw new Error('Failed to delete class');
    }

    return await response.json()
}

export const getTeacherClassApi = async (teacherId) => {
    const token = localStorage.getItem('token')

    const response = await fetch(`http://localhost:3000/classes/teacher/${teacherId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })

    if(!response.ok){
        throw new Error('Cannot get teacher classes')
    }

    return await response.json()
} 

export const getClassByIdApi = async (classId) => {
    const token = localStorage.getItem('token');

    const response = await fetch(`http://localhost:3000/classes/${classId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Error getting class');
    }

    return await response.json();
}