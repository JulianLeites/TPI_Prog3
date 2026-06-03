import React from 'react';
import NavBar from '../UI/NavBar.jsx';
import Footer from '../UI/Footer.jsx';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-light d-flex flex-column" style={{ minHeight: "100vh" }}>
      <NavBar isLoggedIn={user.loggedIn} />

      <div className="flex-grow-1">
        <div 
          className="text-white py-5 mb-5 d-flex align-items-center" 
          style={{
            backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65)), url('https://etenonfitness.com/wp-content/uploads/2019/10/Low-cost-1024x683.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "50vh"
          }}
        >
          <Container className="text-center py-5">
            <Row className="justify-content-center">
              <Col md={9} lg={8}>
                <h1 className="display-3 fw-bold mb-3 text-warning">Entrená a tu Ritmo</h1>
                <p className="lead fs-4 mb-4">
                  Te damos la bienvenida a tu nueva plataforma de entrenamiento. Un espacio diseñado para que puedas gestionar tus actividades, reservar turnos en tiempo real y elegir el plan perfecto para alcanzar tus metas deportivas.
                </p>
                <div className="d-flex justify-content-center gap-3 flex-wrap">
                  <Button 
                    variant="warning" 
                    size="lg" 
                    className="fw-bold px-4 text-dark shadow"
                    onClick={() => navigate('/clases')}
                  >
                    Reservar Clase
                  </Button>
                  <Button 
                    variant="outline-light" 
                    size="lg" 
                    className="px-4 shadow"
                    onClick={() => navigate('/tiers')}
                  >
                    Ver Membresías
                  </Button>
                </div>
              </Col>
            </Row>
          </Container>
        </div>

        <Container className="pb-5">
          <Row className="justify-content-center mb-5">
            {/* Agregamos text-center para centrar los textos y reducimos el ancho máximo a md={10} para que los párrafos no queden tan largos de lado a lado */}
            <Col md={10} className="text-center">
              <h2 className="fw-bold mb-4 text-dark">Sobre nuestra plataforma</h2>
              <p className="text-muted fs-5 mb-4">
                Esta aplicación web fue desarrollada pensando en la comodidad de nuestros socios. Desde acá podés acceder de forma transparente a toda la grilla horaria actualizada, conocer a los profesores a cargo de cada disciplina y asegurar tu cupo de forma inmediata.
              </p>
              <p className="text-muted fs-5">
                Si sos administrador, la plataforma te ofrece un panel integral para dar de alta nuevas actividades, modificar horarios y gestionar las capacidades máximas del establecimiento de manera ágil y centralizada.
              </p>
            </Col>
          </Row>

          <h4 className="text-center fw-bold mb-4 mt-2">Comenzá a explorar</h4>
          <Row className="g-4 text-center">
            <Col xs={12} md={4}>
              <Card className="h-100 border-0 shadow-sm p-3">
                <Card.Body>
                  <div className="fs-1 mb-2">🗓️</div>
                  <Card.Title className="fw-bold">Grilla de Clases</Card.Title>
                  <Card.Text className="text-muted small">
                    Revisá la disponibilidad de disciplinas como Funcional, Yoga o Pilates e inscribite al instante.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={4}>
              <Card className="h-100 border-0 shadow-sm p-3">
                <Card.Body>
                  <div className="fs-1 mb-2">💳</div>
                  <Card.Title className="fw-bold">Planes a Medida</Card.Title>
                  <Card.Text className="text-muted small">
                    Descubrí nuestros pases Bronze, Silver y Gold con beneficios adaptados a tu rutina semanal.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={4}>
              <Card className="h-100 border-0 shadow-sm p-3">
                <Card.Body>
                  <div className="fs-1 mb-2">📩</div>
                  <Card.Title className="fw-bold">Soporte Continuo</Card.Title>
                  <Card.Text className="text-muted small">
                    ¿Tenés dudas sobre cómo empezar? Contactate con administración para recibir asesoramiento personalizado.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;