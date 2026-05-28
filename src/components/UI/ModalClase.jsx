import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

const ModalClase = ({ show, onHide, claseEdicion, setClaseEdicion, onSave }) => {
    return (
        <Modal show={show} onHide={onHide} centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>
                    {claseEdicion.id ? 'Editar Clase' : 'Crear Nueva Clase'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Nombre de la Clase</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Ej: Funcional, Yoga..."
                            value={claseEdicion.nombre} 
                            onChange={(e) => setClaseEdicion({...claseEdicion, nombre: e.target.value})} 
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Profesor</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Nombre del profesor"
                            value={claseEdicion.profesor} 
                            onChange={(e) => setClaseEdicion({...claseEdicion, profesor: e.target.value})} 
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
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>Cupo Máximo</Form.Label>
                        <Form.Control 
                            type="number" 
                            placeholder="Cantidad de alumnos maxima"
                            value={claseEdicion.cupos} 
                            onChange={(e) => setClaseEdicion({...claseEdicion, cupos: e.target.value === "" ? "" : parseInt(e.target.value)})} 
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Cancelar</Button>
                <Button variant="primary" onClick={onSave}>Guardar Clase</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalClase;