import React from 'react'
import NavBar from '../UI/NavBar'
import Footer from '../UI/Footer'
import ModalEliminateUser from '../UI/ModalEliminateUser';

import { Accordion, ListGroup,Dropdown } from 'react-bootstrap';
import { SlOptionsVertical } from "react-icons/sl";
import { useState } from 'react';

const UserManagement = () => {
    const [users, setUsers] = useState([
        { id: 1, name: 'Julian Leites', role: 'SuperAdmin' },
        { id: 2, name: 'Federico Leites', role: 'SuperAdmin' },
        { id: 3, name: 'Mateo Pereyra', role: 'Admin' },
        { id: 4, name: 'Francisco Aguilar', role: 'User' },
    ]);

    const confirmElimination = (data) => {
        //Se debe modificar para que se ingrese la contraseña del usuario logueado
        if (data.confirmation === "ELIMINAR") {
            console.log(`Usuario con ID ${selectedUser.id} eliminado`);
            setShowModal(false);
            // Aquí iría la lógica para eliminar al usuario, como una llamada a la API
        }
    };

    const handleDeleteUser = (user) => {
        event.preventDefault();
        if(user.role === 'SuperAdmin' && users.filter(u => u.role === 'SuperAdmin').length <= 1) {
            alert("No se puede eliminar el último SuperAdmin");
            return;
        } else{
            setSelectedUser(user);
            setShowModal(true);
        }
    }

    const handlePromoteUser = (user, newRole) => {
        const updatedUsers = users.map(u => {
            if(u.id === user.id) {
                return {...u, role: newRole};
            }
            return u;
        });
        console.log(`Usuario con ID ${user.id} ascendido a ${newRole}`);
        // Aquí iría la lógica para promover al usuario, como una llamada a la API
        setUsers(updatedUsers);
    }

    const handleDemoteUser = (user, newRole) => {

        const updatedUsers = users.map(u => {
            if(u.id === user.id) {
                return {...u, role: newRole};
            }
            return u;
        });
        console.log(`Usuario con ID ${user.id} degradado a ${newRole}`);
        // Aquí iría la lógica para degradar al usuario, como una llamada a la API
        setUsers(updatedUsers);
    }

    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div>
        <NavBar />
        <h1 className='text-center mt-4'>Gestión de Usuarios</h1>
        <div className='d-flex justify-content-center align-items-center gap-3' style={{ minHeight: "70vh"}}>
            <Accordion alwaysOpen className='user-management-accordion'>
                <Accordion.Item className='accordeon-list' eventKey="0">
                    <Accordion.Header className='user-list-header'>SuperAdmin ({users.filter(user => user.role === 'SuperAdmin').length})</Accordion.Header>
                    <Accordion.Body className='user-list'>
                        { users.filter(user => user.role === 'SuperAdmin').length > 0 ? (
                            <ListGroup>
                                {users.filter(user => user.role === 'SuperAdmin').map(user => (
                                    <ListGroup.Item key={user.id} className='user-list-item'>
                                        {user.name}
                                        <Dropdown drop="end" style={{ display: 'inline-block' }}>
                                            <Dropdown.Toggle variant="outline-secondary" className='drop-down-toggle-no-caret' size="sm">
                                                <SlOptionsVertical />
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <Dropdown.Item onClick={() => handleDemoteUser(user, 'Admin')}>Degradar a Admin</Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleDemoteUser(user, 'User')}>Degradar a User</Dropdown.Item>
                                                <Dropdown.Item onClick={(e) => handleDeleteUser(user)}>
                                                    Eliminar
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
                    <Accordion.Header className='user-list-header'>Admin ({users.filter(user => user.role === 'Admin').length})</Accordion.Header>
                    <Accordion.Body className='user-list'>
                        { users.filter(user => user.role === 'Admin').length > 0 ? (
                            <ListGroup>
                                {users.filter(user => user.role === 'Admin').map(user => (
                                    <ListGroup.Item key={user.id} className='user-list-item'>
                                            {user.name}
                                            <Dropdown drop="end" style={{ display: 'inline-block' }}>
                                            <Dropdown.Toggle variant="outline-secondary" className='drop-down-toggle-no-caret' size="sm">
                                                <SlOptionsVertical />
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <Dropdown.Item onClick={() => handlePromoteUser(user, 'SuperAdmin')}>Ascender a SuperAdmin</Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleDemoteUser(user, 'User')}>Degradar a User</Dropdown.Item>
                                                <Dropdown.Item onClick={(e) => handleDeleteUser(user)}>Eliminar</Dropdown.Item>
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
                    <Accordion.Header className='user-list-header'>User ({users.filter(user => user.role === 'User').length})</Accordion.Header>
                    <Accordion.Body className='user-list'>
                        { users.filter(user => user.role === 'User').length > 0 ? (
                            <ListGroup>
                                {users.filter(user => user.role === 'User').map(user => (
                                    <ListGroup.Item key={user.id} className='user-list-item'>
                                        {user.name}
                                        <Dropdown drop="end" style={{ display: 'inline-block' }}>
                                            <Dropdown.Toggle variant="outline-secondary" className='drop-down-toggle-no-caret' size="sm">
                                                <SlOptionsVertical />
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <Dropdown.Item onClick={() => handlePromoteUser(user, 'SuperAdmin')}>Ascender a SuperAdmin</Dropdown.Item>
                                                <Dropdown.Item onClick={() => handlePromoteUser(user, 'Admin')}>Ascender a Admin</Dropdown.Item>
                                                <Dropdown.Item onClick={(e) => handleDeleteUser(user)}>Eliminar</Dropdown.Item>
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
        <Footer />

        <ModalEliminateUser
            show={showModal}
            onHide={() => setShowModal(false)}
            user={selectedUser}
            onConfirmElimination={confirmElimination}
        />
    </div>
  )
}

export default UserManagement;