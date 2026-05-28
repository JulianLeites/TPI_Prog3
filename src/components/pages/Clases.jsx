import { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Modal } from 'react-bootstrap';
import NavBar from '../UI/NavBar';
import ModalClase from '../UI/ModalClase'; // Importamos el modal aparte
import Footer from '../UI/Footer';

const Clases = ({ user }) => {
    const [clases, setClases] = useState([
        { id: 1, nombre: "Funcional", profesor: "Juan", fecha: "2026-07-05", horario: "09:00", cupos: 5 },
        { id: 2, nombre: "Yoga", profesor: "Ana", fecha: "2026-06-08", horario: "11:00", cupos: 0 },
        { id: 3, nombre: "Pilates", profesor: "Julieta", fecha: "2026-05-08", horario: "16:00", cupos: 8 },
    ]);

    // Estados para el Modal de Formulario (Alta/Modificación)
    const [showFormModal, setShowFormModal] = useState(false);
    const [claseEdicion, setClaseEdicion] = useState({ 
        nombre: '', profesor: '', fecha: '', horario: '', cupos: 0 
    });

    // Estados para el Modal de Confirmación de Borrado (Baja)
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [idClaseAEliminar, setIdClaseAEliminar] = useState(null);

    const isAdmin = user.role === 'admin';

    const formatearFecha = (fechaStr) => {
        if (!fechaStr) return "";
        const fecha = new Date(fechaStr);
        return new Intl.DateTimeFormat('es-AR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        }).format(fecha);
    };

    // Funciones para Alta y Modificación
    const handleOpenForm = (clase = { nombre: '', profesor: '', fecha: '', horario: '', cupos: 0  }) => {
        setClaseEdicion(clase);
        setShowFormModal(true);
    };

    const handleSave = () => {
        const { nombre, profesor, fecha, horario, cupos } = claseEdicion;
        
        if (!nombre || !profesor || !fecha || !horario || cupos === "") {
            alert("Por favor, completa todos los campos antes de guardar.");
            return;
        }

        if (claseEdicion.id) {
            setClases(clases.map(c => c.id === claseEdicion.id ? claseEdicion : c));
        } else {
            setClases([...clases, { ...claseEdicion, id: Date.now() }]);
        }
        setShowFormModal(false);
    };

    // Funciones para la Baja Estética
    const handleOpenDelete = (id) => {
        setIdClaseAEliminar(id);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        setClases(clases.filter(c => c.id !== idClaseAEliminar));
        setShowDeleteModal(false);
        setIdClaseAEliminar(null);
    };

    return (
        <>
            <NavBar isLoggedIn={user.loggedIn} />
            <Container className="py-5">
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <h2>Lista de Clases</h2>
                    {isAdmin && (
                        <Button variant="success" onClick={() => handleOpenForm()}>
                            + Crear clase
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
                                                    onClick={() => handleOpenForm(clase)}
                                                >
                                                    Editar
                                                </Button>
                                                <Button 
                                                    variant="danger" 
                                                    size="sm" 
                                                    onClick={() => handleOpenDelete(clase.id)}
                                                >
                                                    Eliminar
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

            
            <ModalClase 
                show={showFormModal}
                onHide={() => setShowFormModal(false)}
                claseEdicion={claseEdicion}
                setClaseEdicion={setClaseEdicion}
                onSave={handleSave}
            />

           
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered size="sm">
                <Modal.Header closeButton className="bg-danger text-white">
                    <Modal.Title className="fs-5">¿Eliminar Clase?</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center py-4">
                    <p className="mb-0 fw-semibold">¿Estás seguro de eliminar esta actividad de la grilla?</p>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-center gap-2">
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={handleConfirmDelete}>
                        Eliminar
                    </Button>
                </Modal.Footer>
            </Modal>
            <Footer />
        </>
    );
};

export default Clases;