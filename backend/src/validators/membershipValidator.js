export const validateMembership = (data) => {
    const errors =  {};

    if (!data.name || !data.price) {
       errors.general = 'Name and price are required'
    }
    if (data.name && data.name.length < 3) {
        errors.name = 'Name must be at least 3 characters long';
    }
    if (data.price !== undefined && data.price <= 0) {
        errors.price = 'Price must be a positive number';
    }
    if (data.duration && data.duration <= 0) {
        errors.duration = 'Duration must be a positive number';
    }
    if (data.max_classes && data.max_classes <= 0) {
        errors.max_classes = 'Max classes must be a positive number';
    }
    if(data.imageUrl){
        try {
            new URL(data.imageUrl);
        } catch (error) {
            errors.imageUrl = 'invalid image link format';
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    }
}