import React from 'react'
import { email, z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal, Button, Row, Col } from 'react-bootstrap'
import { useForm } from "react-hook-form";
import { useEffect } from 'react';

const schema = z
    .object ({
        name: z.string().min(1, "Nombre requerido"),
        surname: z.string().min(1, "Apellido requerido"),
        username: z.string().min(3, "El username debe tener al menos 3 caracteres"),
        password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres").or(z.literal('')),
        email: z.string().email("email invalido")
    })

const ModalEditProfile = ({show, onHide, profileEdit, onEdit}) => {
    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: {errors}
    } = useForm({
        resolver: zodResolver(schema)
    })

    useEffect(() => {
        if (profileEdit) {
            const nameParts = profileEdit?.name ? profileEdit.name.split(' ') : []
            const name = nameParts[0] || ""
            const surname = nameParts.slice(1).join(' ') || ""

            reset({
                username: profileEdit.username || '',
                email: profileEdit.email || '',
                name: name,
                surname: surname,
                password: ''
            })
        }
    }, [show, profileEdit, reset])

    const onSubmit = (data) => {
        const {name, surname, ...restOfData} = data;

        const dataForBackend = {
            ...restOfData,
            name: `${name} ${surname}`
        }
        onEdit(dataForBackend);
    }

    return (
    <>
        <Modal 
            show={show}
            onHide={onHide}
            centered
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>Editar</Modal.Title>
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
                                placeholder='ingres solo para editar'
                            />
                            {errors.password && (
                                <p className='text-danger'>{errors.password.message}</p>
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
    </>
  )
}

export default ModalEditProfile
