import React, { useEffect } from 'react'
import { Modal, Button, Row, Col } from 'react-bootstrap'
import { useForm } from "react-hook-form";
import { email, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z
    .object({
        name: z.string().min(1, "Nombre requerido"),
        surname: z.string().min(1, "Apellido requerido"),
        username: z.string().min(3, "El username debe tener al menos 3 caracteres"),
        password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
        email: z.string().email("email invalido"),
        rol: z.string({required_error: 'Seleccione un Rol'})
            .nonempty({ message: 'Seleccione un Rol'})
            .refine((val) => ["user", "teacher", "admin", "superAdmin"].includes(val), {
                message: 'Seleccione un rol valido'
            })
    })

const ModalRegister = ({show, onHide, onRegister}) => {
    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: {errors}
    } = useForm({
        resolver: zodResolver(schema)
    })

    const onSubmit = (data) => {
        const {name, surname, ...restOfData} = data;

        const dataForBackend = {
            ...restOfData,
            name: `${name} ${surname}`
        }
        onRegister(dataForBackend);
    }

    useEffect(() => {
        reset({
            name: '',
            surname: '',
            username: '',
            password: '',
            email: '',
            rol: ''
        })
    }, [show, reset])

  return (
    <div>
        <Modal 
            show={show}
            onHide={onHide}
            centered
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>Registrar</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <form id='register' onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <Col>
                            <label className='form-label'>Username</label>
                            <input
                                {...register("username")}
                                className='form-control mb-2'
                                type='text'
                                placeholder='Username'
                                />
                            {errors.username && (
                                <p className='text-danger'>{errors.username.message}</p>
                            )}
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <label className='form-label'>Nombre</label>
                            <input
                                {...register("name")}
                                className='form-control mb-2'
                                type='text'
                                placeholder='Nombre'
                            />
                            {errors.name && (
                                <p className='text-danger'>{errors.name.message}</p>
                            )}
                        </Col>
                        <Col>
                            <label className='form-label'>Apellido</label>
                            <input
                                {...register("surname")}
                                className='form-control mb-2'
                                type='text'
                                placeholder='Apellido'
                            />
                            {errors.surname && (
                                <p className='text-danger'>{errors.surname.message}</p>
                            )}
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <label className='form-label'>Email</label>
                            <input
                                {...register("email")}
                                className='form-control mb-2'
                                type='text'
                                placeholder='Email'
                            />
                            {errors.email && (
                                <p className='text-danger'>{errors.email.message}</p>
                            )}
                        </Col>
                        <Col>
                            <label className='form-label'>Contraseña</label>
                            <input
                                {...register("password")}
                                className='form-control mb-2'
                                type='password'
                                placeholder='Contraseña'
                            />
                            {errors.password && (
                                <p className='text-danger'>{errors.password.message}</p>
                            )}
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <label className='form-label'>Rol</label>
                            <select
                                {...register("rol")}
                                className='form-select mb-2'
                                >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                                <option value="teacher">Teacher</option>
                                <option value="superAdmin">superAdmin</option>   
                            </select>
                            {errors.rol && (
                                <p className='text-danger'>{errors.rol.message}</p>
                            )}
                        </Col>
                    </Row>
                </form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="danger" onClick={onHide}>
                    Cancelar
                </Button>
                <Button
                    variant="primary"
                    type="submit"
                    form="register"
                >
                    Confirmar
                </Button>
            </Modal.Footer>
        </Modal>
    </div>
  )
}

export default ModalRegister;
