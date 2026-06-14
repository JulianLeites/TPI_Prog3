import React from 'react'
import NavBar from '../UI/NavBar'
import Footer from '../UI/Footer'
import ModalEliminateUser from '../UI/ModalEliminateUser';
import ModalRegister from '../UI/ModalRegister';

import { Accordion, ListGroup,Dropdown, Spinner, Button, Form, Row, Col } from 'react-bootstrap';
import { SlOptionsVertical } from "react-icons/sl";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import notification from '../../utils/toast';

import { updateUserRolApi, getUsersApi, createUserApi, deleteUserApi } from '../../services/userService.js'

const UserManagement = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate()

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const [searchUser, setSearchUser] = useState('')

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const users = await getUsersApi()
                setUsers(users);
                setLoading(false);  
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleRegisterUser = async (formData) => {
        try {
            const newUser = await createUserApi(formData)

            setUsers((prevUsers) => [...prevUsers, newUser]);

            setShowRegisterModal(false);
            notification.success('Usuario creado con exito')
        } catch (error) {
            console.error('Error creating new user', error);
            notification.error('No se pudo crear el usuario')
        }
    }

    const confirmElimination = async (data) => {
        if (data.confirmation === "ELIMINAR") {
            setShowDeleteModal(false);
            try {
                await deleteUserApi(selectedUser.id)

                setUsers(users.filter(u => u.id !== selectedUser.id))

                notification.success('Usuario eliminadao con exito')

                setSelectedUser(null)
            } catch (error) {
                console.error('Failure deleting user', error)
                notification.error('No se pudo eliminar el usuario')
            }
        }
    };

    const handleDeleteUser = (e, user) => {
        e.preventDefault();
        e.stopPropagation();

        if(user.rol === 'superAdmin' && users.filter(u => u.rol === 'superAdmin').length <= 1) {
            notification.warning('No se puede eliminar al ultimo superAdmin')
            return;
        } else{
            setSelectedUser(user);
            setShowDeleteModal(true);
        }
    }

    const updateUserRol = async (user, newRol) => {
        if(user.rol === 'superAdmin' && users.filter(u => u.rol === 'superAdmin').length <= 1) {
            notification.warning('No se puede degradar al ultimo superAdmin')
            return;
        }

        try{
            await updateUserRolApi(user.id, newRol)
            setUsers(prevUsers => prevUsers.map(u => u.id === user.id ? {...u, rol: newRol} : u))
            notification.success('Rol modificado con exito')    
        } catch (error) {
            console.error('Fail updating user rol', error)
            notification.error(error.message || 'Error al modificar el rol')
        }
    }

    const handleSearchUser = (e) => {
        setSearchUser(e.target.value)
    }

    const filteredUsers = users.filter(usuario => {
        if(searchUser.trim() === 'true') return true

        const query = searchUser.toLocaleLowerCase()

        const matchesId = String(usuario.id).startsWith(query)
        const matchesName = usuario.name ? usuario.name.toLowerCase().startsWith(query) : false
        const matchesUsername = usuario.username ? usuario.username.toLowerCase().startsWith(query) : false

        return matchesId || matchesName || matchesUsername
    })

    if(loading) {
        return (
            <div className='d-flex flex-column justify-content-center align-items-center' style={{ minHeight: "100vh"}}>
                <Spinner animation='border' variant='primary' />
                <p className='mt-3'>Conectando con el Sistema de Gestión</p>
            </div>
        )
    }

    const UserRowItem = ({ user }) => {
        const rolesDisponibles = [
            { rol: 'superAdmin', label: 'Ascender a SuperAdmin' },
            { rol: 'admin', label: 'Ascender/Degradar a Admin' },
            { rol: 'teacher', label: 'Ascender/Degradar a Teacher' },
            { rol: 'user', label: 'Degradar a User' }
        ]
        return (
            <ListGroup.Item className='user-list-item bg-light d-flex flex-row justify-content-around align-items-center'>
                <Row className="w-100">
                    <Col className='user-info'><p className='mb-0 text-center'>{user.name}</p></Col>
                    <Col className='user-info'><p className='mb-0 text-center'>{user.username}</p></Col>
                    <Col className='user-info'><p className='mb-0 text-center'>{user.id}</p></Col>
                </Row>
                
                <Dropdown drop="end" style={{ display: 'inline-block' }}>
                    <Dropdown.Toggle variant="outline-secondary" className='drop-down-toggle-no-caret' size="sm">
                        <SlOptionsVertical />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {rolesDisponibles.filter(r => r.rol !== user.rol).map(r => (
                            <Dropdown.Item key={r.rol} onClick={() => updateUserRol(user, r.rol)}>
                                {r.label}
                            </Dropdown.Item>
                        ))}
                        <Dropdown.Divider/>
                        <Dropdown.Item onClick={(e) => handleDeleteUser(e, user)}>Eliminar</Dropdown.Item>
                        <Dropdown.Item onClick={() => navigate(`/profile/${user.id}`)}>Ver Perfil</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </ListGroup.Item>
        )
    }

  return (
    <div>
        <NavBar />
        <h1 className='text-center mt-4'>Gestión de Usuarios</h1>
        <div className='text-center' style={{ minHeight: "70vh"}}>
            <Button 
                className='mt-3 mb-3'
                variant='success'
                style={{width: "800px"}}
                onClick={() => setShowRegisterModal(true)}
            >
                Crear Usuario
            </Button>

            {/* Barra de Busqueda */}
            <div className='mb-3 d-flex flex-column justify-content-center align-items-center'>
                <Form.Control
                    type="text"
                    placeholder="Buscar"
                    className='mb-3'
                    style={{borderRadius:'20px', width: '800px'}}
                    value={searchUser}
                    onChange={handleSearchUser}
                />
                {searchUser.trim() !== '' && (
                    <div className='d-flex justify-content-center align-items-center' style={{width: '800px'}}>
                        {filteredUsers.length === 0 ? (
                            <p className="text-muted small text-center my-3 bg-light border" style={{width: '800px', borderRadius: '20px'}}>No se encontraron usuarios</p>
                        ) : (
                            <ListGroup variant='flush' style={{borderRadius: '20px'}} className='border bg-light'>
                                {filteredUsers.map(u => (
                                    <UserRowItem key={u.id} user={u}/>
                                ))}
                            </ListGroup>  
                        )}
                    </div>
                )}
            </div>

            {/* Acordeones */}
            <div className='d-flex justify-content-center align-items-center gap-3' >
                <Accordion alwaysOpen className='user-management-accordion'>
                    {[
                        { key: "0", rol: "superAdmin", label: "SuperAdmin" },
                        { key: "1", rol: "admin", label: "Admin" },
                        { key: "2", rol: "teacher", label: "Profesores" },
                        { key: "3", rol: "user", label: "User" }
                    ].map(({key, rol, label}) =>  {
                        const filtered = users.filter(u => u.rol === rol)
                        return (
                            <Accordion.Item className='accordeon-list' eventKey={key} key={rol}>
                                <Accordion.Header className='user-list-header'>
                                    {label} ({filtered.length})
                                </Accordion.Header>
                                <Accordion.Body className='user-list'>
                                    {filtered.length > 0 ? (
                                        <ListGroup>
                                            {filtered.map(user => (
                                                <UserRowItem key={user.id} user={user}/>
                                            ))}
                                        </ListGroup>
                                    ) : (
                                        <p>No hay {label} registrados </p>
                                    )}
                                </Accordion.Body>
                            </Accordion.Item>
                        )
                    })}
                </Accordion>
                </div>
            </div>
        <Footer />

        <ModalEliminateUser
            show={showDeleteModal}
            onHide={() => setShowDeleteModal(false)}
            user={selectedUser}
            onConfirmElimination={confirmElimination}
        />

        <ModalRegister
            show={showRegisterModal}
            onHide={() => setShowRegisterModal(false)}
            onRegister={handleRegisterUser}
        />
    </div>
  )
}

export default UserManagement;