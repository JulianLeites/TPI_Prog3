import React, { useEffect } from "react";
import { Button, Card, Spinner } from "react-bootstrap";
import { useState } from "react";
import { RiEdit2Line } from "react-icons/ri";
import ModalBuyMembership from "../UI/ModalBuyMembership";
import ModalNewMembership from "../UI/ModalNewMembership";
import Footer from "../UI/Footer";
import NavBar from "../UI/NavBar";
import ModalDeleteClass from "../UI/ModalDeleteClass";
import DefaultImage from '../../assets/img/MembershipDefaultImage.jpg'


function Membership({user}) {
  const initialStateMembership = {
    name: '',
    price: null,
    duration: 30,
    max_classes: null
  }

  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [membershipEdit, setMembershipEdit] = useState([]);

  const [showBuyMembershipModal, setShowBuyMembershipModal] = useState(false);
  const [showNewMembershipModal, setShowNewMembershipModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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

  const handleOpenForm = (membership) => {
    if(membership){
      setMembershipEdit(membership);
    } else {
      setMembershipEdit(initialStateMembership)
    }
    setShowNewMembershipModal(true);
  }

  const handleSave = async (formData) => {
    let finalImageUrl = membershipEdit.imageUrl || null;
    if(formData.imageFile) {
      const cloudinaryData = new FormData();
      cloudinaryData.append('file', formData.imageFile);
      cloudinaryData.append('upload_preset', 'images_memberships')

      const cloudRes = await fetch("https://api.cloudinary.com/v1_1/dq5k1qn0e/image/upload", {
        method: "POST",
        body: cloudinaryData
      });
      const cloudJson = await cloudRes.json();
      finalImageUrl = cloudJson.secure_url;
    }

    const dataToSend = {
      name: formData.name,
      price: formData.price,
      duration: formData.duration,
      max_classes: formData.max_classes,
      imageUrl: finalImageUrl
    }

    try {
      if(membershipEdit.id){
        const response = await fetch(`http://localhost:3000/memberships/${membershipEdit.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dataToSend)
        });

        if(!response.ok){
          throw new Error('Failed to update membeship')
        }

        const editedMembeship = await response.json();

        setMemberships(memberships.map(m => m.id === membershipEdit.id ? editedMembeship : m))
      } else {
        const response = await fetch('http://localhost:3000/memberships', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dataToSend)
        });
        
        if(!response.ok) {
          throw new Error ('Failed creating membership')
        }
        
        const newMembership = await response.json();
        
        setMemberships([...memberships, newMembership]);
      }
        setShowNewMembershipModal(false);
    } catch (error) {
      console.error('An error occured', error);
      alert('Hubo un error al guardar la membresia, intente de nuevo');
    }
  }

  const handleOpenDelete = (id) => {
      setSelectedMembership(id);
      setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
        try {
            const response = await fetch(`http://localhost:3000/memberships/${selectedMembership}`, {
                method: "DELETE"
            })

            if(!response.ok) {
                throw new Error('Failed to delete membership');
            }

            const updateMembership = memberships.filter(m => m.id !== selectedMembership);
            setMemberships(updateMembership);

            setSelectedMembership(null);
        } catch(error) {
            console.error('Failure deliting membership', error)
            alert("No se pudo eliminar la membresia, intente de nuevo")
        }
        setShowDeleteModal(false);
    };

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
      <NavBar/>
      <div style={{ minHeight: "70vh"}}>
        <div className="d-flex justify-content-between align-items-center m-5">
          <h2 className=" mt-4">Elige tu plan de suscripción</h2>
          <Button
            variant="success"
            size="sm"
            style={{height:'40px'}}
            onClick={() => handleOpenForm()}
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

              <Card.Img variant="top" src={memberships.imageUrl || DefaultImage} style={{maxHeight: "38vh", objectFit:'cover'}} />
              <Card.Body>
                <Card.Title>{memberships.name}</Card.Title>
                <Card.Text>{memberships.price}</Card.Text>
                <Card.Text>{memberships.max_classes}</Card.Text>
                <Button variant="primary" onClick={() => handleSuscript(memberships)}>
                  Suscribirse
                </Button> <br/>
                <div className="mt-2 d-flex justify-content-center align-items-center gap-2">
                  <Button
                    variant="danger"
                    onClick={() => handleOpenDelete(memberships.id)}
                  >
                    Borrar
                  </Button>

                  <Button 
                    variant='success'
                    className="p-o text-dark"
                    onClick={() => handleOpenForm(memberships)}
                    >
                    <RiEdit2Line size={24}/>
                  </Button>
                </div>
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
        onSave={handleSave}
        membershipEdit={membershipEdit}
      />

      <ModalDeleteClass
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirmDelete={handleConfirmDelete}
      />
    </>
  );
}

export default Membership;
