import React, { useEffect } from "react";
import { Button, Card, Spinner } from "react-bootstrap";
import { useState } from "react";
import { RiEdit2Line } from "react-icons/ri";
import ModalBuyMembership from "../UI/ModalBuyMembership";
import ModalNewMembership from "../UI/ModalNewMembership";
import Footer from "../UI/Footer";
import NavBar from "../UI/NavBar";
import ModalDelete from "../UI/ModalDelete";
import DefaultImage from '../../assets/img/MembershipDefaultImage.jpg'
import { useAuth } from "../../context/AuthContext";
import notification from "../../utils/toast";

import { getMembershipsApi, updateMembershipImageApi, createMembershipApi, updateMembershipApi, deleteMembershipApi } from "../../services/membershipServices";
import { assignUserToMembershipApi } from "../../services/userMembershipService";

function Membership() {
  const { user, loading: authLoading } = useAuth()

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
        const data = await getMembershipsApi()
        setMemberships(data)
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false)
      }
    };
    fetchMemberships();
  }, []);

  const handleBuySubmit = async (data) => {
    try {
      if(!user || !user.id) {
        throw new Error('You must login to adquiere a membership')
      }

      if(!selectedMembership || !selectedMembership.id){
        throw new Error('Invalid membership selected')
      }
      
      const resData = await assignUserToMembershipApi(selectedMembership.id, data)

      notification.success('Suscripcion realizada con exito')
    } catch (error) {
      notification.error('Error al suscribirse, intente de nuevo')
      throw error
    }

    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

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
    try {
      let finalImageUrl = membershipEdit.imageUrl || null;

      if(formData.imageFile) {
        finalImageUrl = await updateMembershipImageApi(formData.imageFile)
      }

      const dataToSend = {
        name: formData.name,
        price: formData.price,
        duration: formData.duration,
        max_classes: formData.max_classes,
        imageUrl: finalImageUrl
      }

      if(membershipEdit.id){
        const editedMembeship = await updateMembershipApi(membershipEdit.id, dataToSend)

        setMemberships(memberships.map(m => m.id === membershipEdit.id ? editedMembeship : m))
        
        notification.success('Membresia Actualizada con exito')
      } else {
        const newMembership = await createMembershipApi(dataToSend)

        setMemberships(prev => [...prev, newMembership]);
        
        notification.success('Membresia creada con exito')
      }
        setShowNewMembershipModal(false);
    } catch (error) {
      console.error('An error occured', error);
      notification.error('No se pudo guardar la membresia, intente de nuevo')
    }
  }

  const handleOpenDelete = (id) => {
      setSelectedMembership(id);
      setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
      try {
        await deleteMembershipApi(selectedMembership)

        setMemberships(prev => prev.filter(m => m.id !== selectedMembership));

        notification.success('Membresia eliminada con exito')

        setSelectedMembership(null);
    } catch(error) {
        console.error('Failure deliting membership', error)
        notification.error('No se pudo eliminar la membresia, intente de nuevo')
    }
    setShowDeleteModal(false);
  };

  if (loading || authLoading) {
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
          {(user?.rol === 'admin' || user?.rol === 'superAdmin') && (
            <Button
              variant="success"
              size="sm"
              style={{height:'40px'}}
              onClick={() => handleOpenForm()}
            >
              + Crear Membresia
            </Button>
          )}
        </div>
        <div className="d-flex justify-content-center align-items-center gap-3">
          {[...memberships].sort((a, b) => a.price - b.price).map((membership) => (
            <Card
              className="text-center bg-light border rounded"
              style={{
                width: "18rem",
              }}
              key={membership.id}
            >

              <Card.Img variant="top" src={membership.imageUrl || DefaultImage} style={{maxHeight: "38vh", objectFit:'cover'}} />
              <Card.Body>
                <Card.Title className="mb-2">{membership.name}</Card.Title>
                <Card.Text><strong>${membership.price}</strong></Card.Text>
                <Card.Text> Este plan te permite inscribirte hasta <strong> {membership.max_classes} </strong> clases</Card.Text>
                <Card.Text><strong>Acceso al gimnasio</strong></Card.Text>
                <Button variant="primary" onClick={() => handleSuscript(membership)}>
                  Suscribirse
                </Button> <br/>
                {(user?.rol === 'admin' || user?.rol === 'superAdmin') && (
                  <div className="mt-2 d-flex justify-content-center align-items-center gap-2">
                    <Button
                      variant="danger"
                      onClick={() => handleOpenDelete(membership.id)}
                    >
                      Borrar
                    </Button>

                    <Button 
                      variant='success'
                      onClick={() => handleOpenForm(membership)}
                    >
                      Editar  
                    </Button>
                  </div>
                )}
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
        onBuySubmit={handleBuySubmit}
      />

      <ModalNewMembership
        show={showNewMembershipModal}
        onHide={() => setShowNewMembershipModal(false)}
        onSave={handleSave}
        membershipEdit={membershipEdit}
      />

      <ModalDelete
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirmDelete={handleConfirmDelete}
        message='Membresia'
      />
    </>
  );
}

export default Membership;
