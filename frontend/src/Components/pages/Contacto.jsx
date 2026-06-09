import React from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z} from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Col, Row } from 'react-bootstrap'
import NavBar from '../UI/NavBar'
import Footer from '../UI/Footer'
import notification from '../../utils/toast'

const schema = z.object({
    motivo: z.string({required_error: 'Seleccione un motivo'})
        .nonempty({ message: 'Seleccione un motivo'})
        .refine((val) => ["Negocios", "Unirte a Nuestro Equipo", "Error con la Página", "Otro"].includes(val), {
        message: 'Seleccione un motivo valido'
    }),
    email: z.string().email("Email inválido"),
    mensaje: z.string().min(10, "Ingrese minimo 10 caracteres").max(500, 'Maximo 500 caracteres')
})
const Contacto = () => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema)
    })

    const onSubmit = (data) => {
        
        setIsSubmitting(true)
        
        setTimeout (() => {
            setIsSubmitting(false)
            notification.success('Mensaje enviado con exito, se respondera a la brevedad')
            reset()
        }, 1000);
    }

    const mensaje = watch('mensaje') || '';
    const mensajeValido = mensaje.length === 0 || (mensaje.length >= 10 && mensaje.length <= 500)
    
    return (
    <>
    <NavBar/>
    <div>
        
        <div className='m-4'>
            <h2 className='d-flex justify-content-start align-items-center'> Contacto </h2>
        </div>
        <form id='contacto' className='mx-5 p-4 shadow-sm bg-light border rounded' onSubmit={handleSubmit(onSubmit)}>
            <Row>
                <Col>
                    <label className='form-label'>
                        <strong>Motivo</strong>
                    </label>
                    <select
                        {...register('motivo')}
                        className='form-select mb-2'
                    >
                        <option value=''>Seleccione un motivo</option>
                        <option value="Negocios"> Negocios</option>
                        <option value="Unirte a Nuestro Equipo"> Unirte a nuestro equipo </option>
                        <option value="Error con la Página"> Error con la página</option>
                        <option value="Otro"> Otro</option>
                    </select>
                    {errors.motivo && (
                        <p className='text-danger'>{errors.motivo.message}</p>
                    )}
                </Col>
            </Row>

            <Row>
                <Col>
                    <label className='from-label mb-2'>
                        <strong>Email de Contacto</strong>
                    </label>
                    <input
                        {...register("email")}
                        className='form-control mb-2'
                        type='text'
                        placeholder='example@email.com'
                    />
                    {errors.email && (
                        <p className='text-danger'>{errors.email.message}</p>
                    )}
                </Col>
            </Row>

            <Row>
                <Col>
                    <label className='form-label mb-2'>
                        <strong>Mensaje</strong>
                    </label>
                    <textarea
                        {...register("mensaje")}
                        className='form-control mb-2'
                        rows={5}
                    />
                    {errors.mensaje && (
                        <p className='text-danger'>{errors.mensaje.message}</p>
                    )}
                    <p className={`small text-end ${mensajeValido ? 'text-muted' : 'text-danger'} `}>{watch("mensaje")?.length}/500</p>
                </Col>
            </Row>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Enviando..." : "Enviar"}
            </Button>
        </form>
        <br/> <br/> <br/> <br/> <br/> <br/>
        <Footer/>
    </div>
    </>
  )
}

export default Contacto
