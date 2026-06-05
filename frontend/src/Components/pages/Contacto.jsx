import React from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { email, z} from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { required } from 'zod/v4-mini'
import NavBar from '../UI/NavBar'
import Footer from '../UI/Footer'

const schema = z.object({
    motivo: z.string().min(1, "Este campo es obligatorio"),
    email: z.string().email("Email inválido"),
    mensaje: z.string().min(10, "El mensaje es muy corto") 
})
const Contacto = ({user}) => {
    const navigate = useNavigate()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema)
    })

    const onSubmit = (data) => {
        
        setIsSubmitting(true)
        
        setTimeout (() => {
            setIsSubmitting(false)
            alert(`motivo: ${data.motivo} email de contacto: ${data.email} mensaje: ${data.mensaje}`)
            reset()
        }, 1000);
    }
    return (
    <>
    <NavBar isLoggedIn={user.loggedIn}/>
    <div>
        
        <div className='mx-5'>
            <h2 className='bg-dark text-white w-100 ps-5 m-0'> Contacto </h2>
        </div>
        <Form className='mx-5 p-5 bg-secondary' onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label> <b>Motivo</b> </Form.Label>
                <Form.Select {
                    ...register("motivo")
                }>
                    <option value="Negocios"> Negocios</option>
                    <option value="Unirte a nuestro equipo"> Unirte a nuestro equipo </option>
                    <option value="Error con la página"> Error con la página</option>
                    <option value="Otro"> Otro</option>

                </Form.Select>
                {errors.motivo && <p className='text-danger'> {errors.motivo.message} </p>}
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label> <b>Email de contacto </b></Form.Label>
                <Form.Control {
                    ...register("email")
                }/>
                {errors.email && <p className='text-danger'> {errors.email.message} </p>}
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                <Form.Label> <b>Mensaje</b></Form.Label>
                <Form.Control as="textarea" rows={3} {
                    ...register("mensaje") 
                }/>
                {errors.mensaje && <p className='text-danger'> {errors.mensaje.message} </p>}
            </Form.Group>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Enviando..." : "Enviar"}
            </Button>
        </Form>
        <br/> <br/> <br/> <br/> <br/> <br/>
        <Footer/>
    </div>
    </>
  )
}

export default Contacto
