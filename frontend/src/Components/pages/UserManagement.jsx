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
            const token = localStorage.getItem('token')
            try {
                const response = await fetch('http://localhost:3000/profile/users', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                const data = await response.json();
                setUsers(data);
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
            const token = localStorage.getItem('token')
            const response = await fetch('http://localhost:3000/profile/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if(!response.ok) {
                const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to create user');
            }

            const newUser = await response.json()

            setUsers((prevUsers) => [...prevUsers, newUser]);

            setShowRegisterModal(false);
            notification.success('Usuario creado con exito')
        } catch (error) {
            console.error('Error creating new user', error);
            notification.error('No se pudo crear el usuario')
        }
    }

    const confirmElimination = async (data) => {
        const token = localStorage.getItem('token')

        if (data.confirmation === "ELIMINAR") {
            console.log(`Usuario con ID ${selectedUser.id} eliminado`);
            setShowDeleteModal(false);
            try {
                const response = await fetch(`http://localhost:3000/profile/users/${selectedUser.id}`,{
                    method: "DELETE",
                    headers : {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })

                if(!response.ok) {
                    throw new Error ('Failed to delete user');
                }

                const updatedUsers = users.filter(u => u.id !== selectedUser.id);
                setUsers(updatedUsers)

                notification.success('Usuario eliminadao con exito')

                setSelectedUser(null)
            } catch (error) {
                console.error('Failure deleting de use', error)
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

    const updateUserRol = async (userId, newRol) => {
        const token = localStorage.getItem('token')
        try {
            const response = await fetch(`http://localhost:3000/profile/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({rol: newRol})
            })
            const comfirmation = await response.json()
            if (!response.ok) {
                throw new Error('Failed to update user rol');
            }
            return true;

        } catch (error) {
            console.error("fail updating user rol ", error )
        }
    }

    const handlePromoteUser = async (user, newRol) => {
        const successful = await updateUserRol(user.id, newRol)
        if (successful){   
            const updatedUsers = users.map(u => {
                if(u.id === user.id) {
                    return {...u, rol: newRol};
                }
                return u;
            });
            console.log(`Usuario con ID ${user.id} ascendido a ${newRol}`);
            setUsers(updatedUsers);
            notification.success('Rol modificado con exito')
        } else {
            notification.error('Error al modificar el rol')
        }
    }

    const handleDemoteUser = async (user, newRol) => {
        if(user.rol === 'superAdmin' && users.filter(u => u.rol === 'superAdmin').length <= 1) {
            notification.warning('No se puede degradar al ultimo superAdmin')
            return;
        }

        const successful = await updateUserRol(user.id, newRol)

        if (successful){
            const updatedUsers = users.map(u => {
                if(u.id === user.id) {
                    return {...u, rol: newRol};
                }
                return u;
            });
        console.log(`Usuario con ID ${user.id} degradado a ${newRol}`);
        setUsers(updatedUsers);
        notification.success('Rol modificado con exito')
        } else {
            notification.error('Error al modificar el rol')
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
                                    <ListGroup.Item key={user.id} className='user-search-list-item bg-light d-flex flex-row justify-content-around align-items-center'>
                                        <Row>
                                            <Col className='user-info'>
                                                <p className='mb-0 text-center'>{u.name}</p>
                                            </Col>
                                            <Col className='user-info'>
                                                <p className='mb-0 text-center'>{u.username}</p>
                                            </Col>
                                            <Col className='user-info'>
                                                <p className='mb-0 text-center'>{u.id}</p>
                                            </Col>
                                        </Row>
                                        <Dropdown drop="end" style={{ display: 'inline-block' }}>
                                            <Dropdown.Toggle variant="outline-secondary" className='drop-down-toggle-no-caret' size="sm">
                                                <SlOptionsVertical />
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <Dropdown.Item onClick={() => handleDemoteUser(u, 'admin')}>Degradar a Admin</Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleDemoteUser(u, 'teacher')}>Degradar a Teacher</Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleDemoteUser(u, 'user')}>Degradar a User</Dropdown.Item>
                                                <Dropdown.Divider/>
                                                <Dropdown.Item onClick={(e) => handleDeleteUser(e, u)}>
                                                    Eliminar
                                                </Dropdown.Item>
                                                <Dropdown.Item onClick={() => navigate(`/profile/${u.id}`)}>
                                                    Ver Perfil
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>  
                        )}
                    </div>
                )}
            </div>

            
            <div className='d-flex justify-content-center align-items-center gap-3' >
                <Accordion alwaysOpen className='user-management-accordion'>
                    <Accordion.Item className='accordeon-list' eventKey="0">
                        <Accordion.Header className='user-list-header'>SuperAdmin ({users.filter(user => user.rol === 'superAdmin').length})</Accordion.Header>
                        <Accordion.Body className='user-list'>
                            { users.filter(user => user.rol === 'superAdmin').length > 0 ? (
                                <ListGroup>
                                    {users.filter(user => user.rol === 'superAdmin').map(user => (
                                        <ListGroup.Item key={user.id} className='user-list-item bg-light'>
                                            <Row>
                                                <Col className='user-info'>
                                                    <p className='mb-0 text-center'>{user.name}</p>
                                                </Col>
                                                <Col className='user-info'>
                                                    <p className='mb-0 text-center'>{user.username}</p>
                                                </Col>
                                                <Col className='user-info'>
                                                    <p className='mb-0 text-center'>{user.id}</p>
                                                </Col>
                                            </Row>
                                            <Dropdown drop="end" style={{ display: 'inline-block' }}>
                                                <Dropdown.Toggle variant="outline-secondary" className='drop-down-toggle-no-caret' size="sm">
                                                    <SlOptionsVertical />
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    <Dropdown.Item onClick={() => handleDemoteUser(user, 'admin')}>Degradar a Admin</Dropdown.Item>
                                                    <Dropdown.Item onClick={() => handleDemoteUser(user, 'teacher')}>Degradar a Teacher</Dropdown.Item>
                                                    <Dropdown.Item onClick={() => handleDemoteUser(user, 'user')}>Degradar a User</Dropdown.Item>
                                                    <Dropdown.Divider/>
                                                    <Dropdown.Item onClick={(e) => handleDeleteUser(e, user)}>
                                                        Eliminar
                                                    </Dropdown.Item>
                                                    <Dropdown.Item onClick={() => navigate(`/profile/${user.id}`)}>
                                                        Ver Perfil
                                                    </Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            ) : (
                                <p>No hay SuperAdmins registrados.</p>
                            )}
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item className='accordeon-list' eventKey="1">
                        <Accordion.Header className='user-list-header'>Admin ({users.filter(user => user.rol === 'admin').length})</Accordion.Header>
                        <Accordion.Body className='user-list'>
                            { users.filter(user => user.rol === 'admin').length > 0 ? (
                                <ListGroup>
                                    {users.filter(user => user.rol === 'admin').map(user => (
                                        <ListGroup.Item key={user.id} className='user-list-item bg-light'>
                                            <Row>
                                                <Col className='user-info'>
                                                    <p className='mb-0 text-center'>{user.name}</p>
                                                </Col>
                                                <Col className='user-info'>
                                                    <p className='mb-0 text-center'>{user.username}</p>
                                                </Col>
                                                <Col className='user-info'>
                                                    <p className='mb-0 text-center'>{user.id}</p>
                                                </Col>
                                            </Row>
                                            <Dropdown drop="end" style={{ display: 'inline-block' }}>
                                                <Dropdown.Toggle variant="outline-secondary" className='drop-down-toggle-no-caret' size="sm">
                                                    <SlOptionsVertical />
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    <Dropdown.Item onClick={() => handlePromoteUser(user, 'superAdmin')}>Ascender a SuperAdmin</Dropdown.Item>
                                                    <Dropdown.Item onClick={() => handleDemoteUser(user, 'teacher')}>Degradar a Teacher</Dropdown.Item>
                                                    <Dropdown.Item onClick={() => handleDemoteUser(user, 'user')}>Degradar a User</Dropdown.Item>
                                                    <Dropdown.Divider/>
                                                    <Dropdown.Item onClick={(e) => handleDeleteUser(e, user)}>Eliminar</Dropdown.Item>
                                                    <Dropdown.Item onClick={() => navigate(`/profile/${user.id}`)}>
                                                        Ver Perfil
                                                    </Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            ) : (
                                <p>No hay Admins registrados.</p>
                            )}
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item className='accordeon-list' eventKey="2">
                        <Accordion.Header className='user-list-header'>Profesores ({users.filter(user => user.rol === 'teacher').length})</Accordion.Header>
                        <Accordion.Body className='user-list'>
                            { users.filter(user => user.rol === 'teacher').length > 0 ? (
                                <ListGroup>
                                    {users.filter(user => user.rol === 'teacher').map(user => (
                                        <ListGroup.Item key={user.id} className='user-list-item bg-light'>
                                            <Row>
                                                <Col className='user-info'>
                                                    <p className='mb-0 text-center'>{user.name}</p>
                                                </Col>
                                                <Col className='user-info'>
                                                    <p className='mb-0 text-center'>{user.username}</p>
                                                </Col>
                                                <Col className='user-info'>
                                                    <p className='mb-0 text-center'>{user.id}</p>
                                                </Col>
                                            </Row>
                                            <Dropdown drop="end" style={{ display: 'inline-block' }}>
                                                <Dropdown.Toggle variant="outline-secondary" className='drop-down-toggle-no-caret' size="sm">
                                                    <SlOptionsVertical />
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    <Dropdown.Item onClick={() => handlePromoteUser(user, 'superAdmin')}>Ascender a SuperAdmin</Dropdown.Item>
                                                    <Dropdown.Item onClick={() => handlePromoteUser(user, 'admin')}>Ascender a Admin</Dropdown.Item>
                                                    <Dropdown.Item onClick={() => handleDemoteUser(user, 'user')}>Degradar a User</Dropdown.Item>
                                                    <Dropdown.Divider/>
                                                    <Dropdown.Item onClick={(e) => handleDeleteUser(e, user)}>
                                                        Eliminar
                                                    </Dropdown.Item>
                                                    <Dropdown.Item onClick={() => navigate(`/profile/${user.id}`)}>
                                                        Ver Perfil
                                                    </Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            ) : (
                                <p>No hay Profesores registrados.</p>
                            )}
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item className='accordeon-list' eventKey="3">
                        <Accordion.Header className='user-list-header'>User ({users.filter(user => user.rol === 'user').length})</Accordion.Header>
                        <Accordion.Body className='user-list'>
                            { users.filter(user => user.rol === 'user').length > 0 ? (
                                <ListGroup>
                                    {users.filter(user => user.rol === 'user').map(user => (
                                        <ListGroup.Item key={user.id} className='user-list-item bg-light'>
                                            <Row>
                                                <Col className='user-info'>
                                                    <p className='mb-0 text-center'>{user.name}</p>
                                                </Col>
                                                <Col className='user-info'>
                                                    <p className='mb-0 text-center'>{user.username}</p>
                                                </Col>
                                                <Col className='user-info'>
                                                    <p className='mb-0 text-center'>{user.id}</p>
                                                </Col>
                                            </Row>
                                            <Dropdown drop="end" style={{ display: 'inline-block' }}>
                                                <Dropdown.Toggle variant="outline-secondary" className='drop-down-toggle-no-caret' size="sm">
                                                    <SlOptionsVertical />
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    <Dropdown.Item onClick={() => handlePromoteUser(user, 'superAdmin')}>Ascender a SuperAdmin</Dropdown.Item>
                                                    <Dropdown.Item onClick={() => handlePromoteUser(user, 'admin')}>Ascender a Admin</Dropdown.Item>
                                                    <Dropdown.Item onClick={() => handlePromoteUser(user, 'teacher')}>Ascender a Teacher</Dropdown.Item>
                                                    <Dropdown.Divider/>
                                                    <Dropdown.Item onClick={(e) => handleDeleteUser(e, user)}>Eliminar</Dropdown.Item>
                                                    <Dropdown.Item onClick={() => navigate(`/profile/${user.id}`)}>
                                                        Ver Perfil
                                                    </Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            ) : (
                                <p>No hay Users registrados.</p>
                            )}
                        </Accordion.Body>
                    </Accordion.Item>
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