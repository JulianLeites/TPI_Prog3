import { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';


const Clases = () => {
    const formatearFecha = (fechaStr) => {
        // 1. IMPORTANTE: Cambiamos el orden a YYYY-MM-DD para que JS lo entienda
        const [dia, mes, anio] = fechaStr.split('-');
        const fechaValida = `${anio}-${mes}-${dia}`;
        
        const fecha = new Date(fechaValida);

        return new Intl.DateTimeFormat('es-AR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        }).format(fecha);
    };


    const [clases, setClases] = useState([
        { id: 1, nombre: "Funcional", profesor: "Juan", fecha:"05-07-2026", horario: "09:00", cupos: 5 },
        { id: 2, nombre: "Yoga", profesor: "Ana", fecha:"08-06-2026", horario: "11:00", cupos: 0 },
        { id: 3, nombre: "Pilates", profesor: "Julieta", fecha:"05-08-2026", horario: "16:00", cupos: 8 },
        { id: 4, nombre: "Crossfit", profesor: "Marcos", fecha:"14-07-2026", horario: "19:00", cupos: 2 },
    ]);

  return (
    <Container className="py-5">
      <h2 className="text-center mb-5">Nuestras Clases</h2>
      <Row>
        {clases.map((clase) => (
          <Col key={clase.id}  className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start">
                  <Card.Title>{clase.nombre}</Card.Title>
                  <Badge bg={clase.cupos > 0 ? "success" : "danger"}>
                    {clase.cupos > 0 ? `${clase.cupos} cupos` : "Agotado"}
                  </Badge>
                </div>
                <Card.Text className="text-muted mt-2">
                  Profesor: {clase.profesor} <br />
                  fecha: {formatearFecha(clase.fecha)} <br />
                  Horario: {clase.horario} hs
                </Card.Text>
                <Button 
                  variant="primary" 
                  className="mt-auto" 
                  disabled={clase.cupos === 0}
                >
                  {clase.cupos > 0 ? "Inscribirme" : "Sin cupo"}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Clases;