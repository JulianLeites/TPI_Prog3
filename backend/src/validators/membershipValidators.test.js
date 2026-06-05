import { expect, test} from 'vitest';
import { validateMembership } from './membershipValidator';

test('Debe fallar si falta el nombre de la membresia', () => {
    const datosSinNombre ={
        price: 150
    }
    
    const { isValid, errors } = validateMembership(datosSinNombre);
    
    expect(isValid).toBe(false);
    expect(errors.general).toBe("Name and price are required");
});

test('Debe fallar si el nombre tiene menos de 3 caracteres', () => {
    const nombreCorto = {
        name: "A",
        price: 150
    }

    const { isValid, errors } = validateMembership(nombreCorto);
    
    expect(isValid).toBe(false);
    expect(errors.name).toBe("Name must be at least 3 characters long");
})

test('Debe fallar si el precio no es positivo', () => {
    const precioNegativo = {
        name: "julian",
        price: -5
    }

    const { isValid, errors } = validateMembership(precioNegativo);
    
    expect(isValid).toBe(false);
    expect(errors.price).toBe("Price must be a positive number");
})

test('Debe fallar si la duracion no es un numero positivo', () => {
    const duracionNegativa = {
        name: "julian",
        price: 150,
        duration: -5
    }

    const { isValid, errors } = validateMembership(duracionNegativa);
    
    expect(isValid).toBe(false);
    expect(errors.duration).toBe("Duration must be a positive number");
})

test('Debe fallar si el maximo de clases no es un numero positivo', () => {
    const maxClaseNegativo = {
        name: "julian",
        price: 150,
        duration: 5,
        max_classes: -5
    }

    const { isValid, errors } = validateMembership(maxClaseNegativo);
    
    expect(isValid).toBe(false);
    expect(errors.max_classes).toBe("Max classes must be a positive number");
})

test('Debe fallar si la URL no es valida', () => {
    const invalidUrl = {
        name: "julian",
        price: 150,
        duration: 5,
        max_classes: 5,
        imageUrl: "asdasd"
    }

    const { isValid, errors } = validateMembership(invalidUrl);
    
    expect(isValid).toBe(false);
    expect(errors.imageUrl).toBe("invalid image link format");
})

test('Debe pasar si todos los datos son validos', () => {
    const pass = {
        name: "julian",
        price: 150,
        duration: 5,
        max_classes: 5,
        imageUrl: "https://res.cloudinary.com/dq5k1qn0e/image/upload/v1780588973/c2jsfcmw2jcbbn2rmzwo.webp"
    }

    const { isValid, errors } = validateMembership(pass);
    
    expect(isValid).toBe(true);
    expect(Object.keys(errors).length).toBe(0);
})