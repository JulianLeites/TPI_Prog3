export const getMembershipsApi = async () => {
    const response = await fetch('http://localhost:3000/memberships')

    if(!response.ok){
        throw new Error('Error getting Memberships')
    }

    return await response.json()
}

export const updateMembershipImageApi = async (imageFile) => {
    const cloudinaryData = new FormData();
    cloudinaryData.append('file', imageFile);
    cloudinaryData.append('upload_preset', 'images_memberships')

    const response = await fetch("https://api.cloudinary.com/v1_1/dq5k1qn0e/image/upload", {
        method: "POST",
        body: cloudinaryData
    });

    if(!response.ok) {
        throw new Error('Error uploading image')
    }

    const data = await response.json()

    return data.secure_url
}

export const createMembershipApi = async (membershipData) => {
    const token = localStorage.getItem('token')

    const response = await fetch('http://localhost:3000/memberships', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(membershipData)
    });
    
    if(!response.ok) {
        throw new Error ('Failed creating membership')
    }

    return await response.json()
}

export const updateMembershipApi = async (id, membershipData) => {
    const token = localStorage.getItem('token')

    const response = await fetch(`http://localhost:3000/memberships/${id}`, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(membershipData)
    });

    if(!response.ok){
        throw new Error('Failed to update membeship')
    }

    return await response.json()
}

export const deleteMembershipApi = async (id) => {
    const token = localStorage.getItem('token')

    const response = await fetch(`http://localhost:3000/memberships/${id}`, {
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    if(!response.ok) {
        throw new Error('Failed to delete membership');
    }

    return true
}