import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z
    .object({
        name: z.string().min(1, "Nombre requerido"),
        capacity: z.coerce.number({
            invalid_type_error: 'La capacidad debe ser un numero'
        })
        .int('Debe ser un numero entero')
        .positive('Debe ser un numero positivo'),
        day: z.string({required_error: 'Seleccione un Dia'})
            .nonempty({ message: 'Seleccione un Dia'})
            .refine((val) => ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"].includes(val), {
                message: 'Seleccione un dia valido'
            }),
        hour: z.string().regex(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato invalido (HH:MM)'),
        description: z.string().min(1, 'Descripcion requerida'),
        teacher_id: z.coerce.number({
            invalid_type_error: 'Debe seleccionar un profesor'
        })
        .int()
        .positive('Debe seleccionar un profesor valido')
    })

const ModalClase = ({ show, onHide, classEdit, setClassEdit, onSave, teachers = [] }) => {
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
        if (show && classEdit) {
            reset(classEdit)
        } else {
            reset({
            name: "",
            day: "",
            hour: "",
            teacher_id: "",
            capacity: "",
            description: ""
        });
        }
    }, [show, classEdit, reset])

    const onSubmit = (data) => {
        onSave(data);
    }

    return (
        <Modal show={show} onHide={onHide} centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>
                    {classEdit.id ? 'Editar Clase' : 'Crear Nueva Clase'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form id='class' onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <Col>
                            <label className='form-label'>Nombre de la Clase</label>
                            <input
                                {...register("name")}
                                className='form-control mb-2'
                                type='text'
                                placeholder='Nombre de la Clase'
                            />
                            {errors.name && (
                                <p className='text-danger'>{errors.name.message}</p>
                            )}
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <label className='form-label'>Dia</label>
                            <select
                                {...register("day")}
                                className='form-select mb-2'
                            >
                                <option value=''>Seleccione un Dia</option>
                                <option value='Lunes'>Lunes</option>
                                <option value='Martes'>Martes</option>
                                <option value='Miercoles'>Miercoles</option>
                                <option value='Jueves'>Jueves</option>
                                <option value='Viernes'>Viernes</option>
                                <option value='Sabado'>Sabado</option>
                                <option values='Domingo'>Domingo</option>
                            </select>
                            {errors.day && (
                                <p className='text-danger'>{errors.day.message}</p>
                            )}
                        </Col>
                        <Col>
                            <label className='form-label'>Hora</label>
                            <input
                                {...register("hour")}
                                className='form-control mb-2'
                                type='text'
                                placeholder='Hora'
                            />
                            {errors.hour && (
                                <p className='text-danger'>{errors.hour.message}</p>
                            )}
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <label className='form-label'>Profesor</label>
                            <select
                                {...register("teacher_id")}
                                className='form-select'
                            >
                                <option value="">Seleccione un profesor</option>
                                {teachers.map(teacher => (
                                    <option key={teacher.id} value={teacher.id}>
                                        {teacher.name}
                                    </option>
                                ))}
                            </select>
                            {errors.teacher_id && (
                                <p className='text-danger'>{errors.teacher_id.message}</p>
                            )}
                        </Col>
                        <Col>
                            <label className='form-label'>Capacidad</label>
                            <input
                                {...register("capacity")}
                                className='form-control mb-2'
                                type='number'
                                placeholder='capacidad'
                            />
                            {errors.capacity && (
                                <p className='text-danger'>{errors.capacity.message}</p>
                            )}
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <label className='form-label'>Descripcion</label>
                            <input
                                {...register("description")}
                                className='form-control mb-2'
                                type='text'
                                placeholder='Descripcion'
                            />
                            {errors.description && (
                                <p className='text-danger'>{errors.description.message}</p>
                            )}
                        </Col>
                    </Row>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Cancelar</Button>
                <Button variant="primary" form='class' type='submit'>Guardar Clase</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalClase;