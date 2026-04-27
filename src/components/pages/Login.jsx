import React from 'react'
import { useState, useRef } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'

const Login = () => {

const [email, setEmail] = useState("")
const [password, setPassword] = useState("")


const handleSubmit = (e) =>{
    e.preventDefault()
    console.log(email, password)
}


  return (
    <div>
        <Form className='p-5 m-5 bg-secondary' onSubmit={handleSubmit}>
            <p className='text-end'> Registrarse </p>
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
            Iniciar sesión
            </Button>
        </Form>
    </div>
  )
}

export default Login
