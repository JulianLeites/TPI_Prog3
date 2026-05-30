import { Container, Col, Row } from "react-bootstrap";
import { BsInstagram } from "react-icons/bs";
import { BsTwitterX } from "react-icons/bs";
import { SiGooglemaps } from "react-icons/si";
import { GoMail } from "react-icons/go";

import React from 'react'

const Footer = () => {
  return (
    <div>
      <Container fluid className="bg-dark text-light py-3 mt-5">
        <Row className="mb-3">
          <Col className="text-center">
            <h5>¡Síguenos en nuestras redes sociales!</h5>
            <div className="d-flex justify-content-center gap-3 mt-2">
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                    <BsInstagram size={30} color="#E1306C" />
                </a>
                <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                    <BsTwitterX size={30} color="#1DA1F2" />
                </a>
                <a href="mailto:julilei276@gmail.com" target="_blank" rel="noopener noreferrer">
                    <GoMail size={30} color="#000000" />
                </a>
            </div>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col className="text-center">
            <h5>Encuéntranos en Google Maps</h5>
            <a href="https://maps.app.goo.gl/bk37oxiHEQq3yVLH9" target="_blank" rel="noopener noreferrer">
                <SiGooglemaps size={30} color="#4285F4" />
            </a>
            <p className="mt-2">2000, Zeballos 1341, S2000 Rosario, Santa Fe</p>
          </Col>
        </Row>
        <Row>
            <Col className="text-Justify">

            </Col>
        </Row>
        <Row>
          <Col className="text-center">
            <p>&copy; 2024 Mi Aplicación. Todos los derechos reservados.</p>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Footer;