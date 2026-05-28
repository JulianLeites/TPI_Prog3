import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';

const NavBar = ({isLoggedIn}) => {
  return (
    <Navbar expand="lg" className="bg-body-secondary">
      <Container>
        <Navbar.Brand as={NavLink} to='/dashboard'>Inicio</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to='/tiers'>Membresias</Nav.Link>
            <Nav.Link as={NavLink} to='/clases'>Clases</Nav.Link>
            <Nav.Link as={NavLink} to='/horarios'> Horarios </Nav.Link>
            <Nav.Link as={NavLink} to='/contacto'>Contacto</Nav.Link>
          </Nav>
          <Nav>
            {isLoggedIn ? 
            <Nav.Link as={NavLink} to='/profile'> <h6>Perfil </h6></Nav.Link> : 
            <Nav.Link as={NavLink} to='/'> <h6>Acceder </h6></Nav.Link>}
            
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}


export default NavBar
