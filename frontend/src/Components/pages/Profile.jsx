import React from 'react'
import {Container, Row, Col, Spinner, Button, Card, Badge, Carousel, Dropdown } from 'react-bootstrap'
import NavBar from '../UI/NavBar'
import Footer from '../UI/Footer'
import { FaRegUserCircle } from "react-icons/fa";
import { useState, useEffect } from 'react';
import DefaultImage from '../../assets/img/MembershipDefaultImage.jpg'
import ModalCancel from '../UI/ModalCancel.jsx';
import ModalEditProfile from '../UI/ModalEditProfile';
import ModalEliminateUser from '../UI/ModalEliminateUser';
import { useAuth } from '../../context/AuthContext';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import notification from '../../utils/toast';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import { updateUserRolApi, editUserProfileApi, deleteUserApi} from '../../services/userService.js'

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Profile = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    // Estados de datos 
    const [profileData, setProfileData] = useState(null)
    const [teacherData, setTeacherData] = useState([])
    const [membershipData, setMembershipData] = useState(null)
    const [classesData, setClassesData] = useState([])
    const [teachers, setTeachers] = useState([])

    // Estados de UI y Modales
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showCancelModal, setShowCancelModal] = useState(false)
    const [showEditProfile, setShowEditProfile] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [message, setMessage] = useState(null)

    const [selectedClass, setSelectedClass] = useState(null)
    const [profileEdit, setProfileEdit] = useState(null)


    const { user: currentUser, updateUserContext, logout } = useAuth()

    const isViewingOther = Boolean(id) && String(id) !== String(currentUser?.id || currentUser?._id)

    useEffect(() => {
        if(!isViewingOther && !currentUser) return;

        const fetchProfile = async () => {
            setLoading(true)
            setError(null)
            const token = localStorage.getItem('token')

            const profileUrl = isViewingOther ? `http://localhost:3000/profile/${id}` : 'http://localhost:3000/profile'
            const membershipUrl = isViewingOther ? `http://localhost:3000/profile/memberships/user/${id}` : 'http://localhost:3000/profile/memberships'
            const classesUrl = isViewingOther ? `http://localhost:3000/profile/classes/user/${id}` : 'http://localhost:3000/profile/classes'

            try{
                const response = await fetch(profileUrl, {
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

                if(data.rol !== 'user'){
                    const teacherUrl = `http://localhost:3000/classes/teacher/${data.id}`
                    const teacherResponse = await fetch(teacherUrl, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    })
    
                    if(!teacherResponse.ok){
                        throw new Error('Cannot get teacher classes')
                    }
                    const tData = await teacherResponse.json()
                    setTeacherData(tData)
                } else{
                    setTeacherData([])
                }


                const membershipResponse = await fetch(membershipUrl, {
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

                const classesResponse = await fetch(classesUrl, {
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
                
                if(Array.isArray(cData)){
                    setClassesData(cData)
                } else if (cData && Array.isArray(cData.classes)) {
                    setClassesData(cData.classes)
                } else {
                    setClassesData([])
                }

            } catch(error) {
                console.error('Error getting profile: ', error)
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }
        fetchProfile()

        const fetchTeachers = async () => {
            try {
                const token = localStorage.getItem('token')

                const response = await fetch ('http://localhost:3000/profile/users', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })
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
    }, [id, isViewingOther, currentUser])

    const handleCancelMembership = async () => {
        const token = localStorage.getItem('token')

        const cancelUrl = isViewingOther ? `http://localhost:3000/profile/memberships/cancel/${id}` : 'http://localhost:3000/profile/memberships/cancel'

        try {
            const response = await fetch(cancelUrl, {
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
                if (prevData && typeof prevData === 'object') {
                    return [{ ...prevData, automatic_renewal: false}]
                }
                return prevData
            })

            notification.success('Membresia cancelada con exito')

        } catch(error) {
            console.error('Error canceling membership: ', error)
            notification.error('Error al cancelar la membresia')
        } finally {
            setShowCancelModal(false)
            setMessage(null)
        }
    }

    const handleOpenCancelMembership = () => {
        setMessage('Membresia')
        setShowCancelModal(true)
    }

    const handleOpenLeaveClass = (enrollment) => {
        setSelectedClass(enrollment)
        setMessage('Clase')
        setShowCancelModal(true)
    }

    const handleLeaveClass = async () => {
        if(!selectedClass || !selectedClass.Class) return;
        
        try {
            const token = localStorage.getItem('token')
            const classId = selectedClass.Class.id
            const leaveClassUrl = isViewingOther ? `http://localhost:3000/profile/classes/${classId}/user/${id}` : `http://localhost:3000/profile/classes/${classId}`

            const response = await fetch(leaveClassUrl, {
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

            notification.success('Baja de la clase con procesada exito')

            setSelectedClass(null);
        } catch(error) {
            console.error('Failure leaving class', error)
            notification.error('No se pudo dar de baja de la clase, intente de nuevo')
        }
        setShowCancelModal(false);
        setMessage(null)
    }

    const handleOpenEditProfile = (profile) => {
        setProfileEdit(profile)
        setShowEditProfile(true)
    }

    const handleEditProfile = async (formData) => {
        try {
            const { id, rol, created_at, updated_at, ...camposEditables } = formData;
            const userId = isViewingOther ? id : (currentUser?.id || currentUser?._id);

            const resData = await editUserProfileApi(camposEditables)
            
            setProfileData(prevData => ({...prevData, ...resData}))

            if(!isViewingOther){
                updateUserContext({
                    username: resData.username,
                    name: resData.name,
                    email: resData.email
                })
            }

            notification.success('Perfil editado con exito')
            setShowEditProfile(false)

        } catch(error){
            console.error('failure updating profile: ', error)
            notification.error('Error al editar el perfil')
        }
    }

    const confirmElimination = async (data) => {
        if (data.confirmation !== "ELIMINAR") return

        const userToDelete = isViewingOther ? id : (currentUser?.id || currentUser?._id)
        try {
            await deleteUserApi(userToDelete)
            setShowDeleteModal(false)

            if(!isViewingOther){
                notification.success('Tu cuenta ha sido eliminada con exito')
                logout()
                navigate('/')
            } else {
                notification.success('Usuario eliminado con exito')
                navigate('/user-management')
            }

        } catch (error) {
            console.error('Failure deleting de user', error)
            notification.error('No se pudo eliminar el usuario')
        }
        
    };

    const handleDeleteUser = () => {
        if(profileData.rol === 'superAdmin') {
            notification.warning('Un superAdmin solo se puede eliminar desde la gestion de usuarios')
            return;
        }   
        setShowDeleteModal(true);
    }

    const updateUserRol = async (user, newRol) => {
        if(user.rol === 'superAdmin') {
            notification.warning('El rol de un superAdmin solo se puede modificar desde la gestión de usuarios')
            return;
        }

        try {
            await updateUserRolApi(user.id, newRol);
            setProfileData(prev => ({ ...prev, rol: newRol}))
            notification.success('Rol modificado con éxito')
        } catch (error) {
            console.error("Fail updating user rol", error)
            notification.error('Error al actualizar el rol')
        }
    }

    const getTeacherName = (data) => {
        const idProfesor = data?.teacher_id || data?.teacher?.id;
        if (!idProfesor) return "No asignado";
        
        const teacherFound = teachers.find(t => String(t.id) === String(idProfesor));
        return teacherFound ? teacherFound.name : "No asignado";
    };

    if (loading) {
        return(
            <div className='d-flex flex-column justify-content-center align-items-center' style={{ minHeight: "100vh"}}>
                <Spinner animation='border' variant='primary' />
                <p className='mt-3'>Conectando con el listado de Clases</p>
            </div>
        )
    }

    const isAdmin = currentUser?.rol === 'admin' || currentUser?.rol === 'superAdmin'
    const isNotUser = currentUser?.rol !== 'user'
    const columnSize = isAdmin ? 3 : 4;
    const isAlreadyCanceled = Array.isArray(membershipData) && membershipData.every(userMem => userMem.automatic_renewal === false)

  return (
    <div>
      <NavBar/>
        <Container className='mt-5 mb-5' style={{ minHeight: "75vh"}}>
            <Row className='justify-content-center g-5 align-items-stretch mb-5'>

                {/* Foto perfil + editar/borrar cuenta */}
                <Col xs={12} md='auto' className='d-flex flex-column align-items-center justify-content-center px-4'>
                    <div className="text-center p-3 h-100 d-flex flex-column justify-content-center align-items-center" style={{ minWidth: '180px' }}>
                        <FaRegUserCircle size={130} className='mb-4'/>
                        {!isViewingOther && (
                            <Button 
                                variant='success'
                                onClick={() => handleOpenEditProfile(profileData)}
                            >
                                Editar Perfil
                            </Button>
                        )}
                        <Button
                            variant="outline-danger" 
                            size="sm" 
                            className="w-100 fw-bold mt-2"
                            onClick={handleDeleteUser}
                        >
                            
                            Eliminar Cuenta
                        </Button>
                    </div>
                </Col>
                
                {/* Info basica */}
                <Col xs={12} sm={6} md={columnSize}>
                    <Card className='shadow-sm border rounded h-100 bg-light'>
                        <Card.Body className='p-4 d-flex flex-column justify-content-between'>
                            <div>
                                <h5 className="border-bottom pb-2 mb-3 text-muted text-uppercase" style={{ fontSize: '0.85rem', letterSpacing: '0.5px' }}>Info Básica</h5>
                                <h3 className="text-primary mb-3">{profileData?.username}</h3>
                                <p className='mb-2'><strong>Nombre: </strong> {profileData?.name}</p>
                                <p className='mb-2'><strong>Email: </strong> {profileData?.email}</p>
                            </div>
                            <p className='mb-0'><strong>Fecha de Registro: </strong> {profileData?.created_at ? new Date(profileData.created_at).toLocaleDateString() : 'N/A'}</p>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Info Admin */}
                {isAdmin && (
                    <Col xs={12} sm={6} md={columnSize}>
                        <Card className="shadow-sm border rounded h-100 bg-light border-danger">

                            <Card.Body className='p-4 d-flex flex-column justify-content-between'>
                                <div>
                                    <h5 className="border-bottom pb-2 mb-3 text-danger text-uppercase" style={{ fontSize: '0.85rem', letterSpacing: '0.5px' }}>Información de Administrador</h5>
                                    <p className="mb-2 text-monospace"><strong>ID de Usuario:</strong> <br />{profileData?.id}</p>
                                    <p className="mb-0"><strong>Rol asignado:</strong> <br /><span className="badge bg-danger text-white mt-1 px-3 py-2">{profileData?.rol}</span></p>
                                </div>
                                
                                <Dropdown drop='bottom'>
                                    <Dropdown.Toggle
                                        as={Button}
                                        variant='outline-danger'
                                        className='drop-down-no-caret w-100 fw-bold mt-2 text-wrap small'
                                    >
                                        Editar Rol
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        {profileData?.rol === 'user' && (
                                            <>
                                                <Dropdown.Item onClick={() => updateUserRol(profileData, 'superAdmin')}>Ascender a SuperAdmin</Dropdown.Item>
                                                <Dropdown.Item onClick={() => updateUserRol(profileData, 'admin')}>Ascender a Admin</Dropdown.Item>
                                                <Dropdown.Item onClick={() => updateUserRol(profileData, 'teacher')}>Ascender a Teacher</Dropdown.Item>
                                            </>
                                        )}

                                        {profileData?.rol === 'teacher' && (
                                            <>
                                                <Dropdown.Item onClick={() => updateUserRol(profileData, 'superAdmin')}>Ascender a SuperAdmin</Dropdown.Item>
                                                <Dropdown.Item onClick={() => updateUserRol(profileData, 'admin')}>Ascender a Admin</Dropdown.Item>
                                                <Dropdown.Item onClick={() => updateUserRol(profileData, 'user')}>Degradar a User</Dropdown.Item>
                                            </>
                                        )}

                                        {profileData?.rol === 'admin' && (
                                            <>
                                                <Dropdown.Item onClick={() => updateUserRol(profileData, 'superAdmin')}>Ascender a SuperAdmin</Dropdown.Item>
                                                <Dropdown.Item onClick={() => updateUserRol(profileData, 'teacher')}>Degradar a Teacher</Dropdown.Item>
                                                <Dropdown.Item onClick={() => updateUserRol(profileData, 'user')}>Degradar a User</Dropdown.Item>
                                            </>
                                        )}

                                        {profileData?.rol === 'superAdmin' && (
                                            <Dropdown.Item disabled>
                                                Acceda a gestion de usuarios
                                            </Dropdown.Item>
                                        )}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Card.Body>
                        </Card>
                    </Col>
                )}

                {/* Membresias */}
                <Col xs ={12} sm={6} md={columnSize} className='d-flex justify-content-center'>
                    {(!membershipData || (Array.isArray(membershipData) && membershipData.length === 0) || membershipData?.plan === null) ? (
                        <Card className='shadow-sm border rounded text-center h-100 bg-light w-100 d-flex flex-column justify-content-center p-4'>
                            <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                                {!isViewingOther ? (
                                    <p>{membershipData?.message || 'No posees una membresía activa'}</p>
                                ) : (
                                    <p className='text-muted italic mb-0 fs-5'>Este usuario no posee membresia</p>
                                )}
                                {!isViewingOther && (
                                    <Button variant='success' href='/memberships' className="shadow-sm px-4">
                                        Adquirir Membresía
                                    </Button>
                                )}
                            </Card.Body>
                        </Card>
                    ) : (
                        <Carousel
                            controls={membershipData.length > 1}
                            indicators={false}
                            interval={null}
                            className='h-100 w-100 custom-carousel'
                        >
                            {Array.isArray(membershipData) && membershipData.map((userMem, index) => {
                                const isInQueue = new Date(userMem.date_start) > new Date()
                                const currentKey = userMem.id || index

                                return(
                                    <Carousel.Item key={currentKey} className='h-100' style={{ width: '100%' }}>
                                        <Card
                                            className="text-center shadow-sm w-100 h-100" 
                                            style={{ 
                                                backgroundColor: userMem?.color || '#ffffff',
                                                border: "2px solid #6c757d",
                                                position: 'relative',
                                                width: '100%'
                                            }}
                                        >
                                            <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10 }}>
                                                <Badge bg={isInQueue ? "secondary" : "success"} className="px-2 py-2">
                                                    {isInQueue ? 'En Cola' : 'Activa hoy'}
                                                </Badge>
                                            </div>

                                            <Card.Img
                                                variant="top" 
                                                src={userMem?.Membership.imageUrl || DefaultImage} 
                                                style={{ maxHeight: "150px", objectFit: 'cover' }}
                                            />
                                            <Card.Body className="d-flex flex-column justify-content-between p-3">
                                                <div>
                                                    <Card.Title className="fw-bold text-uppercase m-0 mb-2" style={{fontSize: '1.2rem'}}>
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
                                                    className="mt-auto w-100 fe-bold"
                                                    onClick={handleOpenCancelMembership}
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
                    )}
                </Col>
            </Row>

            {/* Clases asignadas a profesores */}
            {isNotUser && (
                <div className='mb-5'>
                    <h4 className="mb-4 text-secondary text-uppercase fw-bold" style={{ letterSpacing: '1px' }}>
                        {isViewingOther ? (
                            'Clases Asignadas'
                        ) : (
                            'Mis Clases Asignadas'
                        )}
                    </h4>

                    <Swiper
                        loop={true}
                        modules={[Navigation]}
                        navigation
                        spaceBetween={20}
                        slidesPerView={4}
                        slidesPerGroup={1}
                    >
                        {teacherData?.map((tClasses) => (
                            <SwiperSlide key={tClasses.id}>
                                <Card className='h-100 shadow-sm border-0 border-top border-primary border-3 bg-light'>
                                    <Card.Body className='d-flex flex-column p-4'>
                                        <div className='d-flex justify-content-between align-items-start mb-2'>
                                            <Card.Title className='fw-bold mb-0 text-dark' style={{ fontSize: '1.15rem' }}>
                                                {tClasses.name}
                                            </Card.Title>
                                            <Badge bg='success' className='px-2 py-1'>Dictando</Badge>
                                        </div>

                                        <Card.Text className='text-muted small mt-2 flex-grow-1'>
                                            <strong>Día:</strong> {tClasses.day} <br />
                                            <strong>Hora:</strong> {tClasses.hour} hs
                                        </Card.Text>

                                        <div className="mt-3 pt-2 border-top">
                                            <Button 
                                                variant="outline-danger" 
                                                size="sm" 
                                                className="w-100 fw-bold"
                                                onClick={() => handleOpenLeaveClass({Class: tClasses})}
                                            >
                                                Dar de baja
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </SwiperSlide>
                        ))}

                    </Swiper>
                </div>
            )}

            {/* Clases Activas */}
            <div>
                <h4 className="mb-4 text-secondary text-uppercase fw-bold" style={{ letterSpacing: '1px' }}>
                    {isViewingOther ? (
                        'Clases Activas'
                    ) : (
                        'Mis Clases Activas'
                    )}
                </h4>

                {!classesData || classesData.length === 0 ? (
                    <Card className='text-center p-5 bg-light border bg-light shadow-sm'>
                        <p className='text-muted italic mb-0 fs-5'>
                            {!isViewingOther ? (
                                'No estás inscripto a ninguna clase actualmente.'
                            ) : (
                                'Este usuario no esta inscripto en ninguna clase'
                            )}
                        </p>
                        {!isViewingOther && (
                            <Button variant='primary' href='/clases' className='mt-3 mx-auto shadow-sm px-4'>
                                Explorar Grilla de Actividades
                            </Button>
                        )}
                    </Card>
                ) : (
                    <Swiper
                        loop={true}
                        modules={[Navigation]}
                        navigation
                        spaceBetween={20}
                        slidesPerView={4}
                        slidesPerGroup={1}
                        
                    >
                        {classesData?.map((enrollment) => (
                            <SwiperSlide key={enrollment.id}>
                                <Card className='h-100 shadow-sm border-0 border-top border-primary border-3 bg-light'>
                                    <Card.Body className='d-flex flex-column p-4'>
                                        <div className='d-flex justify-content-between align-items-start mb-2'>
                                            <Card.Title className='fw-bold mb-0 text-dark' style={{ fontSize: '1.15rem' }}>
                                                {enrollment.Class?.name}
                                            </Card.Title>
                                            <Badge bg='success' className='px-2 py-1'>Inscripto</Badge>
                                        </div>

                                        <Card.Text className='text-muted small mt-2 flex-grow-1'>
                                            <strong>Profesor:</strong> {getTeacherName(enrollment.Class) || 'Asignado'} <br />
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
                                                Dar de baja
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}
            </div>
        </Container>
            
        <ModalCancel
            show={showCancelModal}
            onHide={() => setShowCancelModal(false)}
            onConfirmCancelMembership={handleCancelMembership}
            onConfirmCancelClass={handleLeaveClass}
            message={message}
        />

        <ModalEditProfile
            show={showEditProfile}
            onHide={() => setShowEditProfile(false)}
            profileEdit={profileEdit}
            onEdit={handleEditProfile}
        />

        <ModalEliminateUser 
            show={showDeleteModal}
            onHide={() => setShowDeleteModal(false)}
            onConfirmElimination={confirmElimination}
            username={profileData?.username}
        />

      <Footer/>
    </div>
  )
}

export default Profile;