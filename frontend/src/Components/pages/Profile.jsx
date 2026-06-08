import React from 'react'
import {Container, Row, Col, Spinner, Button, Card, Badge, Carousel } from 'react-bootstrap'
import NavBar from '../UI/NavBar'
import Footer from '../UI/Footer'
import { FaRegUserCircle } from "react-icons/fa";
import { useState, useEffect } from 'react';
import DefaultImage from '../../assets/img/MembershipDefaultImage.jpg'
import ModalCancelMembership from '../UI/ModalCancelMembership';
import ModalLeaveClass from '../UI/ModalLeaveClass';
import ModalEditProfile from '../UI/ModalEditProfile';
import { useAuth } from '../../context/AuthContext';
import { email } from 'zod';

const Profile = () => {
    const [profileData, setProfileData] = useState(null)
    const [membershipData, setMembershipData] = useState(null)
    const [classesData, setClassesData] = useState(null)
    const [loading, setLoaging] = useState(true)
    const [error, setError] = useState(null)

    const [showCancelModal, setShowCancelModal] = useState(false)
    const [showleaveClassModal, setShowLeaveClassModal] = useState(false)
    const [showEditProfile, setShowEditProfile] = useState(false)

    const [selectedClass, setSelectedClass] = useState(null)
    const [profileEdit, setProfileEdit] = useState(null)

    const { updateUserContext } = useAuth()

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token')

            try{
                const response = await fetch('http://localhost:3000/profile', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })

                if(!response.ok){
                    throw new Error('Cannot get profile data')
                }

                const data = await response.json()
                setProfileData(data)

                const membershipResponse = await fetch('http://localhost:3000/profile/membership', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })

                if(!membershipResponse.ok){
                    throw new Error('Cannot get membership data')
                }

                const mData = await membershipResponse.json()
                setMembershipData(mData)

                const classesResponse = await fetch('http://localhost:3000/profile/classes', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })

                if(!classesResponse.ok){
                    throw new Error('Cannot get classes data')
                }

                const cData = await classesResponse.json()
                setClassesData(cData)

            } catch(error) {
                console.error('Error getting profile: ', error)
                setError(error.message)
            } finally {
                setLoaging(false)
            }
        }
        fetchProfile()
    }, [])

    const handleCancelMembership = async () => {
        const token = localStorage.getItem('token')
        try {
            const response = await fetch('http://localhost:3000/profile/memberships', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            const resData = await response.json()

            if(!response.ok) {
                throw new Error(resData.message || 'Error canceling membership')
            }

            setMembershipData(prevData => {
                if(Array.isArray(prevData)) {
                    return prevData.map(item => ({...item, automatic_renewal: false}))
                }
            })
        } catch(error) {
            console.error('Error canceling membership: ', error)
        } finally {
            setShowCancelModal(false)
        }
    }

    const handleOpenLeaveClass = (enrollment) => {
        setSelectedClass(enrollment)
        setShowLeaveClassModal(true)
    }

    const handleLeaveClass = async () => {
        if(!selectedClass || !selectedClass.Class) return;

        try {
            const token = localStorage.getItem('token')
            const classId = selectedClass.Class.id

            const response = await fetch(`http://localhost:3000/profile/classes/${classId}`, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            if(!response.ok) {
                throw new Error('Failed to leave class');
            }

            const updateClasses = classesData.filter(c => c.id !== selectedClass.id);
            setClassesData(updateClasses);

            setSelectedClass(null);
        } catch(error) {
            console.error('Failure leaving class', error)
            alert("No se pudo abandonar la clase, intente de nuevo")
        }
        setShowLeaveClassModal(false);
    }

    const handleOpenEditProfile = (profile) => {
        setProfileEdit(profile)
        setShowEditProfile(true)
    }

    const handleEditProfile = async (formData) => {
        try {
            const token = localStorage.getItem('token')

            const { id, rol, created_at, updated_at, ...camposEditables } = formData;

            const response = await fetch(`http://localhost:3000/profile`, {
                method: 'PUT',
                headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
                body: JSON.stringify(camposEditables)
            })

            const resData = await response.json()
            
            if(!response.ok){
                throw new Error(resData.message || 'Error updating profile')
            }

            setProfileData(prevData => ({...prevData, ...resData}))

            updateUserContext({
                username: resData.username,
                name: resData.name,
                email: resData.email
            })

            setShowEditProfile(false)
        } catch(error){
            console.error('failure updating profile: ', error)
        }
    }

    if (loading) {
        return(
            <div className='d-flex flex-column justify-content-center align-items-center' style={{ minHeight: "100vh"}}>
                <Spinner animation='border' variant='primary' />
                <p className='mt-3'>Conectando con el listado de Clases</p>
            </div>
        )
    }

    const isAdmin = profileData?.rol === 'admin' || profileData?.rol === 'superAdmin'
    const columnSize = isAdmin ? 3 : 4;
    const isAlreadyCanceled = Array.isArray(membershipData) && membershipData.every(userMem => userMem.automatic_renewal === false)

  return (
    <div>
      <NavBar/>
        <Container className='mt-5 mb-5' style={{ minHeight: "75vh"}}>
            <Row className='justify-content-center g-5 align-items-stretch mb-5'>

                <Col xs={12} md='auto' className='d-flex flex-column align-items-center justify-content-center px-4'>
                    <div className="text-center p-3 h-100 d-flex flex-column justify-content-center align-items-center" style={{ minWidth: '180px' }}>
                        <FaRegUserCircle size={130} className='mb-4'/>
                        <Button 
                            variant='success'
                            onClick={() => handleOpenEditProfile(profileData)}
                        >
                            Editar Perfil
                        </Button>
                    </div>
                </Col>
                
                <Col xs={12} sm={6} md={columnSize}>
                    <Card className='shadow-sm border rounded h-100 bg-white'>
                        <Card.Body className='p-4 d-flex flex-column justify-content-between'>
                            <h5 className="border-bottom pb-2 mb-3 text-muted text-uppercase" style={{ fontSize: '0.85rem', letterSpacing: '0.5px' }}>Info Básica</h5>
                            <h3 className="text-primary mb-3">{profileData?.username}</h3>
                            <p className='mb-2'><strong>Nombre: </strong> {profileData?.name}</p>
                            <p className='mb-2'><strong>Email: </strong> {profileData?.email}</p>
                            <p className='mb-0'><strong>Fecha de Registro: </strong> {new Date (profileData?.created_at).toLocaleDateString()}</p>
                        </Card.Body>
                    </Card>
                </Col>

                {isAdmin && (
                    <Col xs={12} sm={6} md={columnSize}>
                        <Card className="shadow-sm border rounded h-100 bg-white border-danger">
                            <Card.Body className='p-4'>
                                <h5 className="border-bottom pb-2 mb-3 text-danger text-uppercase" style={{ fontSize: '0.85rem', letterSpacing: '0.5px' }}>Información de Administrador</h5>
                                <p className="mb-2 text-monospace"><strong>ID de Usuario:</strong> <br />{profileData?.id}</p>
                                <p className="mb-0"><strong>Rol asignado:</strong> <br /><span className="badge bg-danger text-white mt-1 px-3 py-2">{profileData?.rol}</span></p>
                            </Card.Body>
                        </Card>
                    </Col>
                )}

                <Col xs={12} sm={6} md={columnSize} className='d-flex justify-content-center'>
                    {(!membershipData || (Array.isArray(membershipData) && membershipData.length === 0) || membershipData?.plan === null) ? (
                        <Card className='shadow-sm border rounded text-center h-100 bg-light w-100 d-flex flex-column justify-content-center p-4'>
                            <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                                <p>{membershipData.message || 'No posees una membresía activa'}</p>
                                <Button variant='success' href='/memberships' className="shadow-sm px-4">
                                    Adquirir Membresía
                                </Button>
                            </Card.Body>
                        </Card>
                    ) : (
                        <div xs={12} sm={6} md={columnSize} className='d-flex justify-content-center w-100'>
                            <Carousel
                                controls={membershipData.length > 1}
                                indicators={false}
                                interval={null}
                                className='h-100 w-100 custom-carousel'
                            >
                                {membershipData.map((userMem, index) => {
                                    const isInQueue = new Date(userMem.date_start) > new Date()

                                    return(
                                        <Carousel.Item key={index} className='h-100' style={{ width: '100%' }}>
                                            <Card
                                                className="text-center shadow-sm w-100" 
                                                style={{ 
                                                    backgroundColor: userMem?.color || '#ffffff',
                                                    border: "2px solid #6c757d",
                                                    position: 'relative',
                                                    width: '100%'
                                                }}
                                            >
                                                <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10 }}>
                                                    {isInQueue ? (
                                                        <Badge bg="secondary" className="px-2 py-2"> En Cola</Badge>
                                                    ) : (
                                                        <Badge bg="success" className="px-2 py-2"> Activa hoy</Badge>
                                                    )}
                                                </div>

                                                <Card.Img
                                                    variant="top" 
                                                    src={userMem?.Membership.imageUrl || DefaultImage} 
                                                    style={{ maxHeight: "150px", objectFit: 'cover' }}
                                                />
                                                <Card.Body className="d-flex flex-column justify-content-between p-3">
                                                    <div>
                                                        <Card.Title className="font-weight-bold text-uppercase m-0 mb-2" style={{fontSize: '1.2rem'}}>
                                                            {userMem?.Membership?.name || userMem.name}
                                                        </Card.Title>
                                                        <Card.Text className="mb-1"><strong>Precio:</strong> ${userMem?.Membership?.price}</Card.Text>
                                                        <Card.Text className="mb-1" style={{fontSize: '0.9rem'}}>
                                                            <strong>Vence:</strong> {userMem?.date_end ? new Date(userMem.date_end).toLocaleDateString() : 'N/A'}
                                                        </Card.Text>
                                                        <Card.Text className="mb-3" style={{fontSize: '0.9rem'}}>
                                                            <strong>Renovación Aut.:</strong> {userMem?.automatic_renewal ? 'Sí' : 'No'}
                                                        </Card.Text>
                                                    </div>
                                                    <Button 
                                                        variant="outline-danger" 
                                                        size="sm" 
                                                        className="mt-auto w-100 font-weight-bold"
                                                        onClick={() => setShowCancelModal(true)}
                                                        disabled={isAlreadyCanceled}
                                                    >
                                                        {isAlreadyCanceled ? 'Suscripcion Cancelada' : 'Cancelar Suscripcion'}
                                                    </Button>
                                                </Card.Body>
                                            </Card>
                                        </Carousel.Item>
                                    )
                                })}
                            </Carousel>
                        </div>
                    )}
                </Col>
            </Row>

            <Row className='mt-5'>
                <Col xs={12}>
                    <h4 className="mb-4 text-secondary text-uppercase fw-bold" style={{ letterSpacing: '1px' }}>
                        Mis Clases Activas
                    </h4>

                    {!classesData || classesData.length === 0 ? (
                        <Card className='text-center p-5 bg-light border-0 shadow-sm'>
                            <p className='text-muted italic mb-0 fs-5'>No estás inscripto a ninguna clase actualmente.</p>
                            <Button variant='primary' href='/clases' className='mt-3 mx-auto shadow-sm px-4'>
                                Explorar Grilla de Actividades
                            </Button>
                        </Card>
                    ) : (
                        <Row className='g-4'>
                            {classesData.map((enrollment) => (
                                <Col key={enrollment.id} xs={12} sm={6} md={4} lg={3}>
                                    <Card className='h-100 shadow-sm border-0 border-top border-primary border-3 bg-white'>
                                        <Card.Body className='d-flex flex-column p-4'>
                                            <div className='d-flex justify-content-between align-items-start mb-2'>
                                                <Card.Title className='fe-bold mb-0 text-dark' style={{ fontSize: '1.15rem' }}>
                                                    {enrollment.Class?.name}
                                                </Card.Title>
                                                <Badge bg='success' className='px-2 py-1'>Inscripto</Badge>
                                            </div>

                                            <Card.Text className='text-muted small mt-2 flex-grow-1'>
                                                <strong>Profesor:</strong> {enrollment.Class?.teacher?.name || 'Asignado'} <br />
                                                <strong>Día:</strong> {enrollment.Class?.day} <br />
                                                <strong>Hora:</strong> {enrollment.Class?.hour} hs
                                            </Card.Text>

                                            <div className="mt-3 pt-2 border-top">
                                                <Button 
                                                    variant="outline-danger" 
                                                    size="sm" 
                                                    className="w-100 fw-bold"
                                                    onClick={() => handleOpenLeaveClass(enrollment)}
                                                >
                                                    Darme de baja
                                                </Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                
                                </Col>
                            ))}
                        </Row>
                    )}
                </Col>
            </Row>
        </Container>

        <ModalCancelMembership
            show={showCancelModal}
            onHide={() => setShowCancelModal(false)}
            onConfirmCancel={handleCancelMembership}
        />

        <ModalLeaveClass
            show={showleaveClassModal}
            onHide={() => setShowLeaveClassModal(false)}
            onConfirmLeave={handleLeaveClass}
            clase={selectedClass?.Class}
        />

        <ModalEditProfile
            show={showEditProfile}
            onHide={() => setShowEditProfile(false)}
            profileEdit={profileEdit}
            onEdit={handleEditProfile}
        />

      <Footer/>
    </div>
  )
}

export default Profile;