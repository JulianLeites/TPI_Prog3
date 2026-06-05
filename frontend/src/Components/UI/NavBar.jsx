import { Button } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink, replace, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from '../auth/Login';
import { useAuth } from '../../context/AuthContext';

const NavBar = ({isLoggedIn}) => {
  const [showLogin, setShowLogin] = useState(false)
  const {isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {

  }, [user, isAuthenticated])

  const handleLogout = () => {
    navigate('/', {replace: true, state: {}})
    setTimeout(() => {
      logout()
    }, 1)
  }

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
              {isAuthenticated && (user?.rol === 'superAdmin') && (
                <Nav.Link as={NavLink} to='/user-management'>Administrar Usuarios</Nav.Link>
              )}
            </Nav>
            <Nav>
              {isAuthenticated ? (
                <div className="d-flex flex-row align-items-center justify-content-center gap-3">
                  <Nav.Link as={NavLink} to={'/profile'} className='m-0 p-0 text-dark fw-semibold text-decoration-none'>
                    <span>{user?.username}</span>
                  </Nav.Link>
                  <Button
                    variant='danger'
                    size='sm'
                    onClick={handleLogout}
                  >
                    Salir
                  </Button>
                </div>
              ) : (
                <div>
                  <Button
                    variant='link'
                    className='text-dark fw-bold text-decoration-none'
                    onClick={() => setShowLogin(true)}
                    >
                    Acceder
                  </Button>
                </div>
              )}
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
