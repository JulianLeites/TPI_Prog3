import React from 'react';
import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner } from 'react-bootstrap';
import NavBar from '../UI/NavBar';
import ModalClase from '../UI/ModalClase'; // Importamos el modal aparte
import Footer from '../UI/Footer';
import ModalDeleteClass from '../UI/ModalDeleteClass';

const Clases = ({ user }) => {
    const initialStateClass = {
        name: "",
        day: "",
        hour: "",
        teacher_id: "",
        capacity: "",
        description: ""
    }

    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true)
    const [teachers, setTeachers] = useState([]);
    
    
    const [classEdit, setClassEdit] = useState(initialStateClass);
    
    // Estados para el Modal de Confirmación de Borrado (Baja)
    const [showFormModal, setShowFormModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [selectedClass, setSelectedClass] = useState(null);

    useEffect (() => {
        const fetchClasses = async () => {
            try {
                const response = await fetch('http://localhost:3000/classes')

                if(!response.ok){
                    throw new Error('Error getting Classes')
                }
                const data = await response.json()
                setClasses(data)
                setLoading(false)
            } catch (error) {
                console.error(error.message);
                setLoading(false)
            }
        };
        fetchClasses();
    }, []);

    useEffect (() => {
        const fetchTeachers = async () => {
            try {
                const response = await fetch ('http://localhost:3000/users')
                if (!response.ok){
                    throw new Error ('Error al obtener usuarios')
                }
                const data = await response.json();

                if(Array.isArray(data)){
                    const filteredTeachers = data.filter(u => u.rol === "teacher")
                    setTeachers(filteredTeachers)
                }

            } catch (error) {
                console.error('Error getting teachers', error)
            }
        }
        fetchTeachers();
    }, []);

    const getTeacherName = (clase) => {
        const idProfesor = clase?.teacher_id || clase?.teacher?.id;
        if (!idProfesor) return "No asignado";
        
        const teacherFound = teachers.find(t => String(t.id) === String(idProfesor));
        return teacherFound ? teacherFound.name : "No asignado";
    };

    // Funciones para Alta y Modificación
    const handleOpenForm = (clase) => {
        if(clase){
            setClassEdit(clase);
        } else {
            setClassEdit(initialStateClass)
        }
        setShowFormModal(true);
    };

    const handleSave = async (formData) => {
        try {
            if(classEdit.id){
                const response = await fetch(`http://localhost:3000/classes/${classEdit.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if(!response) {
                    throw new Error ('Failed to update class');
                }

                const editedClass = await response.json();

                setClasses(classes.map(c => c.id === classEdit.id ? editedClass : c))
            } else {
                const response = await fetch(`http://localhost:3000/classes`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                })

                if (!response.ok) {
                    throw new Error('Failed to create class');
                }

                const newClass = await response.json();

                setClasses([...classes, newClass]);
            }
            setShowFormModal(false);
            setClassEdit(initialStateClass);
        } catch (error) {
            console.error('An error occured', error);
            alert('hubo un error al guardar la clase, intente de nuevo');
        }
    };

    // Funciones para la Baja Estética
    const handleOpenDelete = (id) => {
        setSelectedClass(id);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            const response = await fetch(`http://localhost:3000/classes/${selectedClass}`, {
                method: "DELETE"
            })

            if(!response.ok) {
                throw new Error('Failed to delete class');
            }

            const updateClasses = classes.filter(c => c.id !== selectedClass);
            setClasses(updateClasses);

            setSelectedClass(null);
        } catch(error) {
            console.error('Failure deliting class', error)
            alert("No se pudo eliminar la clase, intente de nuevo")
        }
        setShowDeleteModal(false);
    };

    if (loading) {
        return(
            <div className='d-flex flex-column justify-content-center align-items-center' style={{ minHeight: "100vh"}}>
                <Spinner animation='border' variant='primary' />
                <p className='mt-3'>Conectando con el listado de Clases</p>
            </div>
        )
    }

    return (
        <>
            <NavBar isLoggedIn={user.loggedIn} />
            <div style={{ minHeight: "70vh"}}>
                <Container className="py-5">
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <h2>Lista de Clases</h2>
                        
                            <Button variant="success" onClick={() => handleOpenForm()}>
                                + Crear clase
                            </Button>
                        
                    </div>

                    <Row>
                        {classes.map((clase) => (
                            <Col key={clase.id} xs={12} md={6} lg={4} className="mb-4">
                                <Card className="h-100 shadow-sm border-0">
                                    <Card.Body className="d-flex flex-column">
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <Card.Title className="fw-bold">{clase.name}</Card.Title>
                                            <Badge bg={clase.capacity > 0 ? "success" : "danger"}>
                                                {clase.capacity > 0 ? `${clase.capacity} cupos` : "Agotado"}
                                            </Badge>
                                        </div>
                                        <Card.Text className="text-muted small">
                                            <strong>Profesor:</strong> {getTeacherName(clase) || 'No asignado'} <br />
                                            <strong>Día:</strong> {clase.day} <br />
                                            <strong>Hora:</strong> {clase.hour}
                                        </Card.Text>

                                        <div className="mt-auto">
                                            {/* validar si es Admin */}
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
                                                <Button variant="primary" className="w-100" disabled={clase.capacity === 0}>
                                                    Inscribirme
                                                </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </div>

            
            <ModalClase 
                show={showFormModal}
                onHide={() => {
                    setShowFormModal(false)
                    setClassEdit(initialStateClass)
                }}
                classEdit={classEdit}
                setClassEdit={setClassEdit}
                onSave={handleSave}
                teachers={teachers}
            />

            <ModalDeleteClass
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                onConfirmDelete={handleConfirmDelete}
            />
           
            {/* <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered size="sm">
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
            </Modal> */}
            <Footer />
        </>
    );
};

export default Clases;