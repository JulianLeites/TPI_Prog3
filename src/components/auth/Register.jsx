import React from 'react'
import { useState, useRef } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { data, Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { email, z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
    

const schema = z.object({
    user: z.string().min(2, "nombre de usuario inválido"),
    name: z.string().min(2, "nombre inválido"),
    email: z.string().email("email inválido"),
    password: z.string().min(6, "la contraseña debe tener al menos 6 caracteres")
})

const Register = () => {

    const navigate = useNavigate()
    
    const { 
        register, 
        handleSubmit, 
        setError, 
        formState: { errors }, 
    } = useForm({
        resolver: zodResolver(schema),
    });


    const onSubmit = (data) =>{
        console.log(`user: ${data.user}, email: ${data.email}, password: ${data.password}`)
        navigate('/')
    }
    /*
    const [registerData, setRegisterData] = useState ({
        username: "",
        name: "",
        email: "",
        password: ""
    }) 
    
    const references = {
        usernameRef: useRef(registerData.username),
        nameRef: useRef(registerData.name),
        emailRef: useRef(registerData.email),
        passwordRef: useRef(registerData.password)
    }
    const onChangeValues = (e) => {
        setRegisterData({...registerData, [e.target.name]: e.target.value})
    }
    const handleSubmit = (e) =>{
        e.preventDefault()
        alert(email, password)
    } */
    return (
    <div>
        <Form className='p-5 m-5 bg-secondary' onSubmit={handleSubmit(onSubmit)}>
            <Link className="d-block text-end mb-1" to="/">
                Iniciar sesión
            </Link>
            
            <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Usuario</Form.Label>
                <Form.Control type="text" placeholder="Usuario" 
                    {...register("user")}
                />
            <Form.Text className="text-danger">
                {errors.user && errors.user.message }
            </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Nombre</Form.Label>
                <Form.Control type="text" placeholder="Nombre" 
                    {...register("name")}
                />
            <Form.Text className="text-danger">
                {errors.name && errors.name.message}
            </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
                <Form.Control placeholder="ingrese email" 
                    {...register("email")}
                />
            <Form.Text className="text-danger">
                {errors.email && errors.email.message}
            </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Contraseña</Form.Label>
                <Form.Control type="password" placeholder="Contraseña" 
                    {...register("password")}
                />
            <Form.Text className='text-danger'>
                {errors.password && errors.password.message}
            </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Mantener sesión" />
            </Form.Group>
            <Button variant="primary" type="submit">
                Registrarse
            </Button>
        </Form>
    </div>
    )
}

export default Register
