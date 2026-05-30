import React from 'react'
import {Container, Row, Col } from 'react-bootstrap'
import NavBar from '../UI/NavBar'
import Footer from '../UI/Footer'
import { FaRegUserCircle } from "react-icons/fa";

const Profile = () => {
  return (
    <div>
      <NavBar />
        <Container className='mt-5' style={{ minHeight: "70vh"}}>
            <Row className='justify-content-center g-5 align-items-start'>
                <Col md="auto" className='d-flex flex-column align-items-center'>
                    <FaRegUserCircle size={150} className='mb-5'/>
                    <h3>Clases Inscripto:</h3>
                    <ul className='list-unstyled mb-0 ps-3'>
                        <li>Yoga - Lunes 18:00</li>
                        <li>Pilates - Miércoles 19:00</li>
                    </ul>
                </Col>

                <Col md={4}>
                    <h2>Nombre de Usuario</h2>
                    <p>Nombre: Juan Pérez</p>
                    <p>Tel: 123-456-7890</p>
                    <p>Email: user@example.com</p>
                    <p>Fecha de Registro: 2023-01-01</p>
                </Col>

                <Col md={4} className='d-flex flex-column justify-content-center'>
                    <h3>Suscrpcion:</h3>
                    <ul>
                        <li>Plan Bronze - Activo</li>
                    </ul>
                </Col>
            </Row>
        </Container>
      <Footer/>
    </div>
  )
}

export default Profile;