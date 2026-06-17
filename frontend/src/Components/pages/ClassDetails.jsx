import React from 'react'
import NavBar from '../UI/NavBar';
import Footer from '../UI/Footer';
import { useAuth } from '../../context/AuthContext';
import { useEnrollment } from '../../context/EnrollmentContext';

import { Row, Col, Card, Spinner, Button, Container, ListGroup } from 'react-bootstrap'; 
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import notification from '../../utils/toast';
import ModalClase from '../UI/ModalClase';
import ModalCancel from '../UI/ModalCancel';

import { getClassByIdApi, updateClassApi } from '../../services/classService';
import { getUserByIdApi, getUsersApi } from '../../services/userService';
import { getClassUsersApi, assignUserToClassApi, leaveClassApi } from '../../services/userClassService';

import { FaRegCalendarDays } from "react-icons/fa6";
import { FaRegClock } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import { FaRegUserCircle } from "react-icons/fa";

const ClassDetails = () => {
    const { id } = useParams()
    const { user } = useAuth()
    const { enrollments, fetchEnrollments } = useEnrollment()

    const initialStateClass = {
        name: "",
        day: "",
        hour: "",
        teacher_id: "",
        capacity: "",
        description: ""
    }

    const navigate = useNavigate()

    const [classData, setClassData] = useState(null)
    const [teachersData, setTeachersData] = useState(null)
    const [teachers, setTeachers] = useState([])
    const [students, setStudents] = useState([])
    const [selectedStudent, setSelectedStudent] = useState(null)

    const [classEdit, setClassEdit] = useState(initialStateClass);

    const [showFormModal, setShowFormModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [message, setMessage] = useState(null)

    const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchClass = async () => {
        try {
            const data = await getClassByIdApi(id)
            setClassData(data)

            if(data.teacher_id) {
                setTeachersData(await getUserByIdApi(data.teacher_id))
            }

            setStudents(await getClassUsersApi(id))
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

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

    fetchClass()
  }, [id])

    const hasPermits = user?.rol !== 'user'

    const handleInscription = async (clase) => {
        try {
            if(!user?.id) {
                throw new Error('You must login to sing up for a class')
            }

            if(!clase?.id) {
                throw new Error('Invalid class selected')
            }
            
            await assignUserToClassApi(clase.id)

            await fetchEnrollments()
            
            notification.success('Inscripcion Completada')

            setStudents(await getClassUsersApi(clase.id))
        } catch(error) {
            notification.error('Hubo un error en la inscripcion, intente de nuevo')
        }

        await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    const handleSave = async (formData) => {
        try {   
            const token = localStorage.getItem('token')

            if(classEdit.id){
                const editedClass = await updateClassApi(classEdit.id, formData)

                setClassData(editedClass)
                notification.success('Clase editada con exito')
            }
            setShowFormModal(false);
            setClassEdit(initialStateClass);
        } catch (error) {
            console.error('An error occured', error);
            notification.error('Hubo un error al guardar la clase, intente de nuevo')
        }
    };

    const handleLeaveClass = async () => {
        if(!classData) return;
        
        try {
            await leaveClassApi(null, classData.id)

            await fetchEnrollments()

            setStudents(await getClassUsersApi(classData.id));

            navigate('/', {replace: true, state: {}})

            setTimeout (() => {
                notification.success('Baja de la clase con procesada exito')
            }, 1)
        } catch(error) {
            console.error(error)
            notification.error('No se pudo dar de baja de la clase, intente de nuevo')
        } finally {
            setShowCancelModal(false);
            setMessage(null)
        }
    }

    const handleExpel = async () => {
        if(!selectedStudent || !classData) return;
        
        try {
            await leaveClassApi(selectedStudent.id, classData.id)

            setStudents(prev => prev.filter(s => s.id !== selectedStudent.id))

            notification.success('Baja de la clase con procesada exito')
        } catch(error) {
            console.error(error)
            notification.error('No se pudo dar expulsar al alumno de la clase, intente de nuevo')
        } finally {
            setSelectedStudent(null)
            setShowCancelModal(false);
            setMessage(null)
        }
    }

    const handleOpenForm = (clase) => {
        if(clase){
            setClassEdit(clase);
        } else {
            setClassEdit(initialStateClass)
        }
        setShowFormModal(true);
    };

    const handleOpenLeaveClass = (enrollment) => {
        setMessage('Clase')
        setShowCancelModal(true)
    }

    const handleOpenExpel = (student) => {
        setSelectedStudent(student)
        setMessage('Clase')
        setShowCancelModal(true)
    }

    const isEnrolled = enrollments.some(
        enrollment => enrollment.Class?.id === classData?.id
    )

  if (loading) {
    return(
        <div className='d-flex flex-column justify-content-center align-items-center' style={{ minHeight: "100vh"}}>
            <Spinner animation='border' variant='primary' />
            <p className='mt-3'>Conectando con la clase</p>
        </div>
    )
  }

  return (
    <div>
        <NavBar/>
        <Container className='mt-4 mb-5' style={{ minHeight: "75vh"}}>
            {/* Info Clase */}
            <Row className='d-flex justify-content-center'>
                <Col xs={12} sm={6} md={9}>
                    <Card className='shadow-sm border rounded h-100 bg-light'>
                        <Card.Body className='p-4'>
                            <div className='d-flex flex-column justify-content-between'>
                                <h3 className='text-primary'>{classData.name}</h3>
                                <p className="class-description">{classData.description}</p>
                            </div>
                            <div className='d-flex align-items-center gap-4'>
                                <span className='d-flex justify-content-center align-items-center gap-1'><FaRegCalendarDays /> {classData.day}</span>
                                <span className='d-flex justify-content-center align-items-center gap-1'><FaRegClock /> {classData.hour}</span>
                                <span className='d-flex justify-content-center align-items-center gap-1'><FaUserGroup /> {students.length}/{classData.capacity + students.length}</span>
                            </div>
                            <div className='d-flex justify-content-end gap-2'>
                                {hasPermits && (
                                    <Button
                                        variant='outline-primary'
                                        onClick={() => handleOpenForm(classData)}
                                    >
                                        Editar
                                    </Button>
                                )}

                                {teachersData.id !== user.id && (
                                    isEnrolled ? (
                                        <Button
                                            variant='danger'
                                            onClick={handleOpenLeaveClass}
                                        >
                                            Abandonar
                                        </Button>
                                    ) : (
                                        <Button
                                            variant='success'
                                            onClick={() => handleInscription(classData)}
                                        >
                                            Insribirse
                                        </Button>
                                    )
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Info Profesor */}
                <Col xs={12} sm={6} md={3}>
                    <Card className='shadow-sm border rounded h-100 bg-light'>
                        <Card.Body className='p-4'>
                            <div className='d-flex flex-column gap-3'>
                                <h5 className="border-bottom pb-2 mb-3 text-muted text-uppercase" style={{ fontSize: '0.85rem', letterSpacing: '0.5px' }}>Profesor</h5>
                                
                                <div className='d-flex align-items-center gap-3'>
                                    <FaRegUserCircle size={80} className="text-secondary flex-shrink-0"/>
                                    <div className='d-flex flex-column align-items-start justify-content-center'>
                                        <span className='fs-5 fw-bold text-primary mb-0'>{teachersData.username}</span>
                                        <span className='text-muted' style={{ fontSize: '0.95rem' }}>{teachersData.name}</span>
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Usuarios Inscriptos */}
            {hasPermits && (
                <Row className='d-flex justify-content-center'>
                    <Col>
                        <Card className='mt-3'>
                            <Card.Header className='d-flex align-items-center gap-2'>
                                <h5 className='m-0'>Inscriptos</h5>
                                <h5 className='m-0 text-muted' style={{ fontSize: '0.95rem' }}>{students.length} {students.length > 1 ? 'usuarios' : 'usuario'}</h5>
                            </Card.Header>
                            <Card.Body>
                                {students.length > 0 && (
                                    <div className='d-flex fw-bold border-bottom pb-2 mb-2 text-muted'>
                                        <div style={{ width: '250px' }}>Nombre</div>
                                        <div style={{ width: '180px' }}>Usuario</div>

                                        {hasPermits && (
                                            <div style={{ width: '80px' }}>ID</div>
                                        )}
                                    </div>
                                )}
                                <ListGroup>
                                    {students.length > 0 ? (
                                        students.map(s => (
                                            <ListGroup.Item key={s.id} className='py-2 bg-light'>
                                                <div className='d-flex align-items-center justify-content-between'>
                                                    <div className='d-flex align-items-center flex-grow-1'>
                                                        <div style={{ width: '250px' }}>
                                                            {s.name}
                                                        </div>

                                                        <div style={{ width: '180px' }}>
                                                            {s.username}
                                                        </div>

                                                        {hasPermits && (
                                                            <div style={{ width: '80px' }}>
                                                                {s.id}
                                                            </div>    
                                                        )}
                                                    </div>
                                                    {hasPermits && (
                                                        <Button
                                                        variant='outline-danger'
                                                        size='sm'
                                                        onClick={() => handleOpenExpel(s)}
                                                        >
                                                            Expulsar
                                                        </Button>
                                                    )}
                                                </div>
                                            </ListGroup.Item>
                                        ))
                                    ) : (
                                        <p className='text-muted'>No hay Inscriptos</p>
                                    )}
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}
        </Container>
        <Footer/>

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

        <ModalCancel
            show={showCancelModal}
            onHide={() => setShowCancelModal(false)}
            onConfirmCancelClass={selectedStudent ? handleExpel : handleLeaveClass}
            message={message}
        />
    </div>
  )
}

export default ClassDetails
