import React, { useEffect } from "react";
import { Button, Card, Spinner } from "react-bootstrap";
import { useState } from "react";
import ModalBuyMembership from "../UI/ModalBuyMembership";
import Footer from "../UI/Footer";
import NavBar from "../UI/NavBar";
import ModalNewMembership from "../UI/ModalNewMembership";

function Membership({user}) {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true)

  const [showBuyMembershipModal, setShowBuyMembershipModal] = useState(false);
  const [showNewMembershipModal, setShowNewMembershipModal] = useState(false);
  const [selectedMembership, setSelectedMembership] = useState(null);

  useEffect (() => {
    const fetchMemberships = async () => {
      try {
        const response = await fetch('http://localhost:3000/memberships')

        if(!response.ok){
          throw new Error('Error getting Memberships')
        }
        const data = await response.json()
        setMemberships(data)
        setLoading(false)
      } catch (error) {
        console.error(error.message);
        setLoading(false)
      }
    };
    fetchMemberships();
  }, []);

  const handleSuscript = (membership) => {
    setSelectedMembership(membership);
    setShowBuyMembershipModal(true);
  };

  const handleCreateMembership = async (formData) => {
    try {
      const response = await fetch('http://localhost:3000/memberships', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if(!response.ok) {
        throw new Error ('Failed creating membership')
      }

      const newMembership = await response.json();

      setMemberships([...memberships, newMembership]);
      setShowNewMembershipModal(false);
      console.log('Usuario Creado con exito');
    } catch (error) {
      console.error('Error Creating new membership', error);
      alert('No se pudo crear la membresia, intente de nuevo');
    }
  }

  if (loading) {
        return(
            <div className='d-flex flex-column justify-content-center align-items-center' style={{ minHeight: "100vh"}}>
                <Spinner animation='border' variant='primary' />
                <p className='mt-3'>Conectando con el listado de Membresias</p>
            </div>
        )
  }

  return (
    <>
      <NavBar isLoggedIn={user.loggedIn}/>
      <div style={{ minHeight: "70vh"}}>
        <div className="d-flex justify-content-between align-items-center m-5">
          <h2 className=" mt-4">Elige tu plan de suscripción</h2>
          <Button
            variant="success"
            size="sm"
            style={{height:'40px'}}
            onClick={() => setShowNewMembershipModal(true)}
          >
            + Crear Membresia
          </Button>
        </div>
        <div className="d-flex justify-content-center align-items-center gap-3">
          {memberships.map((memberships) => (
            <Card
              className="text-center"
              style={{
                width: "18rem",
                backgroundColor: memberships.color,
                border: "2px solid black",
              }}
              key={memberships.id}
            >
              {/* <Card.Img variant="top" src={memberships.imageUrl} style={{maxHeight: "38vh"}} /> */}
              <Card.Body>
                <Card.Title>{memberships.name}</Card.Title>
                <Card.Text>{memberships.price}</Card.Text>
                <Card.Text>{memberships.maxClasses}</Card.Text>
                <Button variant="primary" onClick={() => handleSuscript(memberships)}>
                  Suscribirse
                </Button>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>

      <Footer />

      <ModalBuyMembership
        show={showBuyMembershipModal}
        onHide={() => setShowBuyMembershipModal(false)}
        selectedMembership={selectedMembership}
      />

      <ModalNewMembership
        show={showNewMembershipModal}
        onHide={() => setShowNewMembershipModal(false)}
        onCreateMembership={handleCreateMembership}
      />
    </>
  );
}

export default Membership;
