import { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Modal, Form } from 'react-bootstrap';
import NavBar from '../UI/NavBar';

const Clases = ({ user }) => {
    const [clases, setClases] = useState([
        { id: 1, nombre: "Funcional", profesor: "Juan", fecha: "2026-07-05", horario: "09:00", cupos: 5 },
        { id: 2, nombre: "Yoga", profesor: "Ana", fecha: "2026-06-08", horario: "11:00", cupos: 0 },
        { id: 3, nombre: "Pilates", profesor: "Julieta", fecha: "2026-05-08", horario: "16:00", cupos: 8 },
    ]);

    const [show, setShow] = useState(false);
    const [claseEdicion, setClaseEdicion] = useState({ 
        nombre: '', profesor: '', fecha: '', horario: '', cupos: 0 
    });

    const isAdmin = user.role === 'admin';

    // Formateo fecha para mostrarla en dia y numero
    const formatearFecha = (fechaStr) => {
        if (!fechaStr) return "";
        const fecha = new Date(fechaStr);
        return new Intl.DateTimeFormat('es-AR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        }).format(fecha);
    };

    const handleShow = (clase = { nombre: '', profesor: '', fecha: '', horario: '', cupos: 0 }) => {
        setClaseEdicion(clase);
        setShow(true);
    };

    // Validar campos
    const handleSave = () => {
        const { nombre, profesor, fecha, horario, cupos } = claseEdicion;
        
        // Verificamos que nada esté vacío
        if (!nombre || !profesor || !fecha || !horario || cupos === "") {
            alert("Por favor, completa todos los campos antes de guardar.");
            return;
        }

        if (claseEdicion.id) {
            setClases(clases.map(c => c.id === claseEdicion.id ? claseEdicion : c));
        } else {
            setClases([...clases, { ...claseEdicion, id: Date.now() }]);
        }
        setShow(false);
    };

    // Alerta al intentar eliminar la clase
    const eliminarClase = (id) => {
        if (window.confirm("¿Estás seguro de eliminar esta clase?")) {
            setClases(clases.filter(c => c.id !== id));
        }
    };

    return (
        <>
            <NavBar isLoggedIn={user.loggedIn} />
            <Container className="py-5">
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <h2>Lista de Clases</h2>
                    {isAdmin && (
                        <Button variant="success" onClick={() => handleShow()}>
                            Crear clase
                        </Button>
                    )}
                </div>

                <Row>
                    {clases.map((clase) => (
                        <Col key={clase.id} xs={12} md={6} lg={4} className="mb-4">
                            <Card className="h-100 shadow-sm border-0">
                                <Card.Body className="d-flex flex-column">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <Card.Title className="fw-bold">{clase.nombre}</Card.Title>
                                        <Badge bg={clase.cupos > 0 ? "success" : "danger"}>
                                            {clase.cupos > 0 ? `${clase.cupos} cupos` : "Agotado"}
                                        </Badge>
                                    </div>
                                    <Card.Text className="text-muted small">
                                        <strong>Profesor:</strong> {clase.profesor} <br />
                                        <strong>Día:</strong> {formatearFecha(clase.fecha)} <br />
                                        <strong>Horario:</strong> {clase.horario} hs
                                    </Card.Text>

                                    <div className="mt-auto">
                                        {isAdmin ? (
                                            <div className="d-flex gap-2 align-items-center">
                                                <Button 
                                                    variant="outline-secondary" 
                                                    size="sm" 
                                                    className="flex-grow-1" 
                                                    onClick={() => handleShow(clase)}
                                                >
                                                    Editar
                                                </Button>

                                                <Button 
                                                    variant="danger" 
                                                    size="sm" 
                                                    onClick={() => eliminarClase(clase.id)}
                                                >
                                                    Borrar
                                                </Button>

                                            </div>

                                        ) : (
                                            <Button variant="primary" className="w-100" disabled={clase.cupos === 0}>
                                                Inscribirme
                                            </Button>
                                        )}
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>

            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{claseEdicion.id ? 'Editar Clase' : 'Crear Nueva Clase'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre </Form.Label>
                            <Form.Control 
                                type="text" 
                                value={claseEdicion.nombre} 
                                onChange={(e) => setClaseEdicion({...claseEdicion, nombre: e.target.value})} 
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Profesor</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={claseEdicion.profesor} 
                                onChange={(e) => setClaseEdicion({...claseEdicion, profesor: e.target.value})} 
                                required
                            />
                        </Form.Group>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Fecha</Form.Label>
                                    <Form.Control 
                                        type="date" 
                                        value={claseEdicion.fecha} 
                                        onChange={(e) => setClaseEdicion({...claseEdicion, fecha: e.target.value})} 
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Horario</Form.Label>
                                    <Form.Control 
                                        type="time" 
                                        value={claseEdicion.horario} 
                                        onChange={(e) => setClaseEdicion({...claseEdicion, horario: e.target.value})} 
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Cupo</Form.Label>
                            <Form.Control 
                                type="number" 
                                value={claseEdicion.cupos} 
                                onChange={(e) => setClaseEdicion({...claseEdicion, cupos: e.target.value === "" ? "" : parseInt(e.target.value)})} 
                                required
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>Cancelar</Button>
                    <Button variant="primary" onClick={handleSave}>Guardar Clase</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Clases;