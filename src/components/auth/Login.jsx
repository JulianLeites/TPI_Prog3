import React from 'react'
import { useState, useRef } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
const Login = ({onLogin}) => {

const navigate = useNavigate()
const [email, setEmail] = useState("")
const [password, setPassword] = useState("")
const [emailError, setEmailError] = useState(false)
const [passwordError, setPasswordError] = useState(false)

const emailRef = useRef(null)
const passwordRef = useRef(null)

const handleSubmit = (e) =>{
    e.preventDefault()
    if(validation()){
        console.log(email, password)
        navigate('/dashboard')
        onLogin(true)
    }
}

const validation = () => {
    let isValid = true
    if(password == "") {
        passwordRef.current.focus()
        setPasswordError(true)
        isValid = false
    }
    if(email == "") {
        emailRef.current.focus()
        setEmailError(true)
        isValid = false
    } 

    return(isValid)
}


  return (
    <div>
        <Form className='p-5 m-5 bg-secondary' onSubmit={handleSubmit}>
            <Link className='text-end' to={'/register'}> Registrarse </Link>
            <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="ingrese email" ref={emailRef} 
                onChange={(e) => {
                    setEmail(e.target.value) 
                    setEmailError(false)
                }}/>
            <Form.Text className="text-danger">
                {emailError && <p>este campo no puede estar vacío </p>}
            </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Contraseña</Form.Label>
                <Form.Control type="password" placeholder="Contraseña" ref={passwordRef}
                onChange={(e) => {
                    setPassword(e.target.value)
                    setPasswordError(false)    
                }}/>
                <Form.Text className="text-danger">
                {passwordError && <p>este campo no puede estar vacío </p>}
            </Form.Text>
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
