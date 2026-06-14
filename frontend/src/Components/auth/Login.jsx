import React, { useEffect, useState } from 'react'
import { Modal, Button, Row, Col } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '../../context/AuthContext'
import notification from '../../utils/toast'

import { loginApi, createUserApi } from '../../services/userService'

const loginSchema = z
  .object({
    username: z.string().min(1, "Nombre de usuario requerido"),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres")
  })

const registerSchema = z
  .object({
    name: z.string().min(1, "Nombre requerido"),
    surname: z.string().min(1, "Apellido requerido"),
    username: z.string().min(1, "Nombre de usuario requerido"),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    email: z.string().email("email invalido")
  })

const Login = ({show, onHide}) => {
  const [isLoginMode, setIsLoginMode] = useState(true)

  const { login } = useAuth()

  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    reset: resetLogin,
    formState: {errors: errorsLogin}
  } = useForm({
    resolver:zodResolver(loginSchema)
  })

  const {
    register: registerRegister,
    handleSubmit: handleSubmitRegister,
    reset: resetRegister,
    formState: {errors: errorsRegister}
  } = useForm({
    resolver:zodResolver(registerSchema)
  })

  useEffect(() => {
    resetLogin()
    resetRegister()
  }, [show, isLoginMode, resetLogin, resetRegister])

  const onLoginSubmit = async (data) => {
    try {
      const resData = await loginApi(data)

      const tokenParts = resData.token.split('.')
      const encodedPayLoad = tokenParts[1]
      const decodedUser = JSON.parse(atob(encodedPayLoad))

      login(decodedUser, resData.token)

      onHide()
      notification.success('Has iniciado sesion')
    } catch (error) {
      console.error('Error Login: ', error)
    }
  } 

  const onRegisterSubmit = async (data) => {
    try {
      const {name, surname, ...restOfData} = data

      const dataForBackend = {
        ...restOfData,
        name: `${name} ${surname}`
      }

      await createUserApi(dataForBackend)

      setIsLoginMode(true)
      notification.success('Has creado tu cuenta, ya puedes iniciar sesion')
    } catch(error) {
      console.error('Error Register: ', error)
    }

    console.log('Register data: ', data)
    onHide()
  } 

  return (
    <div>
      <Modal
        show={show}
        onHide={onHide}
        centered
        backdrop='static'
        keyboard={false}
      >
        <Modal.Header closeButton>
          {isLoginMode ? 'Iniciar Sesion' : 'Crear Cuenta'}
        </Modal.Header>

        <Modal.Body>
          {isLoginMode ? (
            <form id='login' onSubmit={handleSubmitLogin(onLoginSubmit)}>
              <Row>
                <Col>
                  <label className='form-label'>Nombre de Usuario</label>
                  <input
                    {...registerLogin("username")}
                    className='form-control mb-2'
                    type='text'
                    placeholder='Username'
                    />
                  {errorsLogin.username && (
                    <p className='text-danger'>{errorsLogin.username.message}</p>
                  )}
                </Col>
              </Row>
              <Row>
                <Col>
                  <label className='form-label'>Contraseña</label>
                  <input
                      {...registerLogin("password")}
                      className='form-control mb-2'
                      type='password'
                      placeholder='Contraseña'
                      />
                  {errorsLogin.password && (
                    <p className='text-danger'>{errorsLogin.password.message}</p>
                  )}
                </Col>
              </Row>
            </form>
          ) : (
            <form id='register' onSubmit={handleSubmitRegister(onRegisterSubmit)}>
              <Row>
                  <Col>
                      <label className='form-label'>Username</label>
                      <input
                          {...registerRegister("username")}
                          className='form-control mb-2'
                          type='text'
                          placeholder='Username'
                          />
                      {errorsRegister.username && (
                          <p className='text-danger'>{errorsRegister.username.message}</p>
                      )}
                  </Col>
              </Row>
              <Row>
                  <Col>
                      <label className='form-label'>Nombre</label>
                      <input
                          {...registerRegister("name")}
                          className='form-control mb-2'
                          type='text'
                          placeholder='Nombre'
                      />
                      {errorsRegister.name && (
                          <p className='text-danger'>{errorsRegister.name.message}</p>
                      )}
                  </Col>
                  <Col>
                      <label className='form-label'>Apellido</label>
                      <input
                          {...registerRegister("surname")}
                          className='form-control mb-2'
                          type='text'
                          placeholder='Apellido'
                      />
                      {errorsRegister.surname && (
                          <p className='text-danger'>{errorsRegister.surname.message}</p>
                      )}
                  </Col>
              </Row>
              <Row>
                  <Col>
                      <label className='form-label'>Email</label>
                      <input
                          {...registerRegister("email")}
                          className='form-control mb-2'
                          type='text'
                          placeholder='Email'
                      />
                      {errorsRegister.email && (
                          <p className='text-danger'>{errorsRegister.email.message}</p>
                      )}
                  </Col>
                  <Col>
                      <label className='form-label'>Contraseña</label>
                      <input
                          {...registerRegister("password")}
                          className='form-control mb-2'
                          type='password'
                          placeholder='Contraseña'
                      />
                      {errorsRegister.password && (
                          <p className='text-danger'>{errorsRegister.password.message}</p>
                      )}
                  </Col>
              </Row>
            </form>
          )}
          <div className='text-center mt-3'>
            <small className='text-muted'>
              {isLoginMode ? '¿Aún no tienes cuenta? ' : '¿Ya tienes cuenta? '}
              <Button
                type='button'
                variant='link'
                className='p-0 mb-1'
                style={{ textDecoration: 'none', fontWeight: 'bold' }}
                onClick={() => setIsLoginMode(!isLoginMode)}
              >
                {isLoginMode ? 'Registrate' : 'Inicia sesión'}
              </Button>
            </small>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="danger" onClick={onHide}>
              Cancelar
          </Button>
          <Button
              variant="primary"
              type="submit"
              form={isLoginMode ? 'login' : 'register'}
          >
              {isLoginMode ? 'Confirmar' : 'Crear Cuenta'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Login
