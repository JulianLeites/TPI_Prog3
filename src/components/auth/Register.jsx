import React from 'react'
import { useState, useRef } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const Register = () => {

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
    }
    return (
    <div>
        <Form className='p-5 m-5 bg-secondary' onSubmit={handleSubmit}>
            <Link className='text-end' to={'/'}> Iniciar sesión </Link>
            <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Usuario</Form.Label>
                <Form.Control type="text" placeholder="Usuario" 
                onChange={onChangeValues} name='username' value={registerData.name}/>
            <Form.Text className="text-muted">
                Mensaje de error
            </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Nombre</Form.Label>
                <Form.Control type="text" placeholder="Nombre" 
                onChange={(e) => setEmail(e.target.value)}/>
            <Form.Text className="text-muted">
                Mensaje de error
            </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="ingrese email" 
                onChange={(e) => setEmail(e.target.value)}/>
            <Form.Text className="text-muted">
                Mensaje de error
            </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Contraseña</Form.Label>
                <Form.Control type="password" placeholder="Contraseña" 
                onChange={(e) => setPassword(e.target.value)}/>
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
