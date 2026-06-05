import { Button } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import Login from '../auth/Login';

const NavBar = ({isLoggedIn}) => {
  const [showLogin, setShowLogin] = useState(false)

  return (
    <>
      <Navbar expand="lg" bg='warning'>
        <Container>
          <Navbar.Brand as={NavLink} to='/'>Inicio</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={NavLink} to='/memberships'>Membresias</Nav.Link>
              <Nav.Link as={NavLink} to='/clases'>Clases</Nav.Link>
              <Nav.Link as={NavLink} to='/contacto'>Contacto</Nav.Link>
              {/* Se debe modificar para que solo el superAdmin pueda acceder a Administrar Usuarios */}
              <Nav.Link as={NavLink} to='/user-management'>Administrar Usuarios</Nav.Link>
            </Nav>
            <Nav>
              {isLoggedIn ? 
                <Nav.Link as={NavLink} to='/profile'> <h6>Perfil </h6></Nav.Link> : 
                <Button
                  variant='link'
                  onClick={() => setShowLogin(true)}
                >
                  Acceder
                </Button>
              }
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Login
        show={showLogin}
        onHide={() => setShowLogin(false)}
      />
    </>
  );
}


export default NavBar
