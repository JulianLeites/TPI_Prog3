import React, { useEffect } from 'react'
import { Modal, Row, Col, Button } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod'

const schema = z
    .object({
        name: z.string().min(1, 'Nombre Requerido'),
        price: z.coerce.number({
            inavlid_type_error: 'El precio debe ser un numero'
        })
        .positive('Debe ser un numero positivo'),
        duration_days: z.coerce.number({
            inavlid_type_error: 'La duración debe ser un numero'
        })
        .int('Debe ser un numero entero')
        .positive('Debe ser un numero positivo'),
        max_classes: z.coerce.number({
            inavlid_type_error: 'La cantidad de clases debe ser un numero'
        })
        .int('Debe ser un numero entero')
        .positive('Debe ser un numero positivo')
    })

const ModalNewMembership = ({show, onHide, onCreateMembership}) => {
    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: {errors}
    } = useForm ({
        resolver: zodResolver(schema)
    })

    useEffect(() => {
        reset({
            name: '',
            price: '',
            durationDays: 30,
            maxClasses: ''
        })
    }, [show, reset])

  return (
    <div>
        <Modal show={show} onHide={onHide} centered size='lg' backdrop='static' keyboard={false}>
            <Modal.Header>
                <Modal.Title>Nueva Membresia</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <form id='membership' onSubmit={handleSubmit(onCreateMembership)}>
                    <Row>
                        <Col>
                            <label className='form-label'>Nombre de la Membresia</label>
                            <input
                                {...register("name")}
                                className='form-control mb-2'
                                type='text'
                                placeholder='Nombre de la membresia'
                            />
                            {errors.name && (
                                <p className='text-danger'>{errors.name.message}</p>
                            )}
                        </Col>
                        <Col>
                            <label className='form-label'>Precio</label>
                            <input
                                {...register("price")}
                                className='form-control mb-2'
                                type='number'
                            />
                            {errors.price && (
                                <p className='text-danger'>{errors.price.message}</p>
                            )}
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <label className='form-label'>Duracion</label>
                            <input
                                {...register("duration_days")}
                                className='form-control mb-2'
                                type='number'
                            />
                            {errors.duration_days && (
                                <p className='text-danger'>{errors.duration_days.message}</p>
                            )}
                        </Col>
                        <Col>
                            <label className='form-label'>Capacidad de inscripcion</label>
                            <input
                                {...register("max_classes")}
                                className='form-control mb-2'
                                type='number'
                            />
                            {errors.max_classes && (
                                <p className='text-danger'>{errors.max_classes.message}</p>
                            )}
                        </Col>
                    </Row>
                </form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant='danger' onClick={onHide}>
                    Cancelar
                </Button>
                <Button
                    variant='primary'
                    type='submit'
                    form='membership'
                >
                    Confirmar
                </Button>
            </Modal.Footer>
        </Modal>
    </div>
  )
}

export default ModalNewMembership
