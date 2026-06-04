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
        duration: z.coerce.number({
            inavlid_type_error: 'La duración debe ser un numero'
        })
        .int('Debe ser un numero entero')
        .positive('Debe ser un numero positivo'),
        max_classes: z.coerce.number({
            inavlid_type_error: 'La cantidad de clases debe ser un numero'
        })
        .int('Debe ser un numero entero')
        .positive('Debe ser un numero positivo'),
        imageFile: z
            .instanceof(File)
            .optional()
            .refine((file) => !file || file.size <= 2 * 1024 * 1024, {
                message: 'La imagen debe pesar menos de 2MB'
            })
            .refine((file) => !file || ['image/jpeg', 'image/png', 'image/webp'].includes(file.type), {
                message: "Solo se permiten formatos JPG, PNG o WEBP"
            })
    })

const ModalNewMembership = ({show, onHide, onSave, membershipEdit}) => {
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: {errors}
    } = useForm ({
        resolver: zodResolver(schema)
    })

    useEffect(() => {
        if(show && membershipEdit){
            reset(membershipEdit)
        } else {
            reset({
                name: '',
                price: '',
                duration: 30,
                max_classes: '',
                imageFile: undefined
            })
        }
    }, [show, membershipEdit, reset])

  return (
    <div>
        <Modal show={show} onHide={onHide} centered backdrop='static' keyboard={false}>
            <Modal.Header>
                <Modal.Title>Nueva Membresia</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <form id='membership' onSubmit={handleSubmit(onSave)}>
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
                                {...register("duration")}
                                className='form-control mb-2'
                                type='number'
                            />
                            {errors.duration && (
                                <p className='text-danger'>{errors.duration.message}</p>
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
                    <Row>
                        <Col>
                            <label className='form-label'>Link de la imagen</label>
                            <input
                                className='form-control mb-2'
                                type='file'
                                accept='image/*'
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if(file) {
                                        setValue('imageFile', file, {shouldValidate: true});
                                    }
                                }}
                            />
                            {errors.imageFile && (
                                <p className='text-danger'>{errors.imageFile.message}</p>
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
