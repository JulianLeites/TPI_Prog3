import React from 'react';
import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Dropdown, Accordion, Form, ListGroup } from 'react-bootstrap';
import NavBar from '../UI/NavBar';
import ModalClase from '../UI/ModalClase';
import Footer from '../UI/Footer';
import ModalDelete from '../UI/ModalDelete';
import { useAuth } from '../../context/AuthContext';
import notification from '../../utils/toast';

import { getClassesApi, createClassApi, updateClassApi, deleteClassApi } from '../../services/classService';
import { getUsersApi } from '../../services/userService';
import { assignUserToClassApi } from '../../services/userClassService';

import { IoOptions } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const Clases = () => {
    const { user } = useAuth()

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

    const navigate = useNavigate()
    
    const [classEdit, setClassEdit] = useState(initialStateClass);
    
    // Estados para el Modal de Confirmación de Borrado (Baja)
    const [showFormModal, setShowFormModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedDay, setSelectedDay] = useState([])
    const [selectedTeacher, setSelectedTeacher] = useState([])
    const [searchingClass, setSearchingClass] = useState('')

    useEffect (() => {
        const fetchClasses = async () => {
            try {
                const data = await getClassesApi()
                setClasses(data)
            } catch (error) {   
                console.error(error.message);
            } finally {
                setLoading(false)
            }
        };
        fetchClasses();
    }, []);

    useEffect (() => {
        const fetchTeachers = async () => {
            try {
                const users = await getUsersApi()

                if(Array.isArray(users)){
                    setTeachers(users.filter(u => u.rol === "teacher"))
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
            const token = localStorage.getItem('token')

            if(classEdit.id){
                const editedClass = await updateClassApi(classEdit.id, formData)

                setClasses(classes.map(c => c.id === classEdit.id ? editedClass : c))
                notification.success('Clase editada con exito')
            } else {
                const newClass = await createClassApi(formData)

                setClasses([...classes, newClass]);
                notification.success('Clase creada con exito')
            }
            setShowFormModal(false);
            setClassEdit(initialStateClass);
        } catch (error) {
            console.error('An error occured', error);
            notification.error('Hubo un error al guardar la clase, intente de nuevo')
        }
    };

    // Funciones para la Baja Estética
    const handleOpenDelete = (id) => {
        setSelectedClass(id);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteClassApi(selectedClass)
            
            setClasses(classes.filter(c => c.id !== selectedClass));

            setSelectedClass(null);
            notification.success('Clase eliminada con exito')
        } catch(error) {
            console.error('Failure deliting class', error)
            notification.error('Hubo un error eliminando la clase, intente de nuevo')
        }
        setShowDeleteModal(false);
    };

    const handleInscription = async (clase) => {
        try {
            if(!user?.id) {
                throw new Error('You must login to sing up for a class')
            }

            if(!clase?.id) {
                throw new Error('Invalid class selected')
            }
            
            const resData = await assignUserToClassApi(clase.id)
            
            notification.success('Inscripcion Completada')

            setClasses(prevClases =>
                prevClases.map(c => c.id === clase.id ? {...c, capacity: c.capacity-1} : c)
            )
        } catch(error) {
            notification.error('Hubo un error en la inscripcion, intente de nuevo')
        }

        await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    const handleDayFilter = (day) => {
        if (day === 'Todos') {
            setSelectedDay([])
        } else {
            setSelectedDay(prev =>
                prev.includes(day)
                ? prev.filter(d => d !== day)
                : [...prev, day]
            )
        }
    }

    const handleTeacherFilter = (teacherId) => {
        if (teacherId === 'Todos') {
            setSelectedTeacher([])
        } else {
            setSelectedTeacher(prev =>
                prev.includes(teacherId)
                ? prev.filter(id => id !== teacherId)
                : [...prev, teacherId]
            )
        }
    }

    const handleSearchClass = (e) => {
        setSearchingClass(e.target.value)
    }

    const filteredClasses = classes.filter(clase => {
        const matchesDay = selectedDay.length === 0 || selectedDay.includes(clase.day)
        const matchesTeacher = selectedTeacher.length === 0 || selectedTeacher.includes(clase.teacher_id)
        const matchesSearch = searchingClass.trim() === '' || clase.name.toLowerCase().includes(searchingClass.toLocaleLowerCase())
        return matchesDay && matchesTeacher && matchesSearch
    });

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
            <NavBar/>
            <div style={{ minHeight: "70vh"}}>
                <Container className="py-5">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2>Lista de Clases</h2>
                        {(user?.rol === 'admin' || user?.rol === 'superAdmin') && (
                            <Button variant="success" onClick={() => handleOpenForm()}>
                                + Crear clase
                            </Button>
                        )}
                    </div>

                    <div className='d-flex justify-content-start align-items-center mb-3 gap-2'>
                        <div>
                            <Form.Control
                                type="text"
                                placeholder="Buscar"
                                style={{borderRadius:'20px'}}
                                value={searchingClass}
                                onChange={handleSearchClass}
                            />
                        </div>
                        <Dropdown drop='end' style={{ display: 'inline-block' }}>
                            <Dropdown.Toggle variant='light' className='border rounded classes-filter d-flex justify-content-center align-items-center'>
                                <IoOptions size={20}/>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Accordion>
                                    <Accordion.Item eventKey='0' style={{borderTop:'none', borderLeft:'none', borderRight:'none'}}>
                                        <Accordion.Header>
                                            Dias
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <ListGroup>
                                                <ListGroup.Item>
                                                    <Form.Check
                                                        type='checkbox'
                                                        id='all-days'
                                                        label='Todos'
                                                        checked={selectedDay.length === 0}
                                                        onChange={() => handleDayFilter('Todos')}
                                                        style={{ userSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none' }}
                                                    />
                                                </ListGroup.Item>
                                                <ListGroup.Item>
                                                    <Form.Check
                                                        type='checkbox'
                                                        id='lunes'
                                                        label='Lunes'
                                                        checked={selectedDay.includes('Lunes')}
                                                        onChange={() => handleDayFilter('Lunes')}
                                                        style={{ userSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none' }}
                                                    />
                                                </ListGroup.Item>
                                                <ListGroup.Item>
                                                    <Form.Check
                                                        type='checkbox'
                                                        id='martes'
                                                        label='Martes'
                                                        checked={selectedDay.includes('Martes')}
                                                        onChange={() => handleDayFilter('Martes')}
                                                        style={{ userSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none' }}
                                                    />
                                                </ListGroup.Item>
                                                <ListGroup.Item>
                                                    <Form.Check
                                                        type='checkbox'
                                                        id='miercoles'
                                                        label='Miercoles'
                                                        checked={selectedDay.includes('Miercoles')}
                                                        onChange={() => handleDayFilter('Miercoles')}
                                                        style={{ userSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none' }}
                                                    />
                                                </ListGroup.Item>
                                                <ListGroup.Item>
                                                    <Form.Check
                                                        type='checkbox'
                                                        id='jueves'
                                                        label='Jueves'
                                                        checked={selectedDay.includes('Jueves')}
                                                        onChange={() => handleDayFilter('Jueves')}
                                                        style={{ userSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none' }}
                                                    />
                                                </ListGroup.Item>
                                                <ListGroup.Item>
                                                    <Form.Check
                                                        type='checkbox'
                                                        id='viernes'
                                                        label='Viernes'
                                                        checked={selectedDay.includes('Viernes')}
                                                        onChange={() => handleDayFilter('Viernes')}
                                                        style={{ userSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none' }}
                                                    />
                                                </ListGroup.Item>
                                                <ListGroup.Item>
                                                    <Form.Check
                                                        type='checkbox'
                                                        id='sabado'
                                                        label='Sabado'
                                                        checked={selectedDay.includes('Sabado')}
                                                        onChange={() => handleDayFilter('Sabado')}
                                                        style={{ userSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none' }}
                                                    />
                                                </ListGroup.Item>
                                                <ListGroup.Item>
                                                    <Form.Check
                                                        type='checkbox'
                                                        id='domingo'
                                                        label='Domingo'
                                                        checked={selectedDay.includes('Domingo')}
                                                        onChange={() => handleDayFilter('Domingo')}
                                                        style={{ userSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none' }}
                                                    />
                                                </ListGroup.Item>
                                            </ListGroup>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey='1' style={{borderBottom:'none', borderLeft:'none', borderRight:'none'}}>
                                        <Accordion.Header>
                                            Profesor
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <ListGroup>
                                                <ListGroup.Item>
                                                    <Form.Check
                                                        type='checkbox'
                                                        id='all-teachers'
                                                        label='Todos'
                                                        checked={selectedTeacher.length === 0}
                                                        onChange={() => handleTeacherFilter('Todos')}
                                                        style={{ userSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none' }}
                                                    />
                                                </ListGroup.Item>
                                                {teachers.map(t => (
                                                    <ListGroup.Item key={t.id}>
                                                        <Form.Check
                                                            type='checkbox'
                                                            id={t.id}
                                                            label={t.name}
                                                            checked={selectedTeacher.includes(t.id)}
                                                            onChange={() => handleTeacherFilter(t.id)}
                                                            style={{ userSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none' }}
                                                        />
                                                    </ListGroup.Item>
                                                ))}
                                            </ListGroup>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>
                            </Dropdown.Menu>
                        </Dropdown>
                        
                    </div>

                    {/* Grilla Clases */}
                    <Row>
                        {filteredClasses.map((clase) => (
                            <Col key={clase.id} xs={12} md={6} lg={4} className="mb-4">
                                <Card className="class-card h-100 shadow-sm border-0">
                                    <Card.Body className="d-flex flex-column bg-light border rounded">
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <Card.Title className="fw-bold">
                                                <span
                                                    style={{ cursor:'pointer'}}
                                                    onClick={() => navigate(`/class/${clase.id}`)}
                                                >
                                                    {clase.name}
                                                </span>
                                            </Card.Title>
                                            <Badge className='no-select' bg={clase.capacity > 0 ? "success" : "danger"}>
                                                {clase.capacity > 0 ? `${clase.capacity} cupos` : "Agotado"}
                                            </Badge>
                                        </div>
                                        <Card.Text className="text-muted small">
                                            <strong>Profesor:</strong> {getTeacherName(clase) || 'No asignado'} <br />
                                            <strong>Día:</strong> {clase.day} <br />
                                            <strong>Hora:</strong> {clase.hour}
                                        </Card.Text>

                                        <div className="mt-auto">
                                            {(user?.rol === 'admin' || user?.rol === 'superAdmin') && (
                                                <div className="d-flex gap-2 align-items-center justify-content-center mb-2">
                                                    <Button 
                                                        variant="primary" 
                                                        size="sm" 
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
                                            )}
                                            <Button 
                                                variant="success"
                                                className="w-100"
                                                disabled={clase.capacity === 0}
                                                onClick={() => handleInscription(clase)}
                                            >
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

            <ModalDelete
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                onConfirmDelete={handleConfirmDelete}
                message='Clase'
            />
            <Footer />
        </>
    );
};

export default Clases;