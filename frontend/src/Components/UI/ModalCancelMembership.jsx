import React from 'react'
import { Modal, Button } from 'react-bootstrap'

const ModalCancelMembership = ({show, onHide, onConfirmCancel}) => {
  return (
    <>
      <Modal show={show} onHide={onHide} centered backdrop='static' keyboard={false} size='sm'>
        <Modal.Header closeButton className='bg-danger text-white'>
            <Modal.Title className='fs-5'>¿Cancelar Membresia?</Modal.Title>
        </Modal.Header>
        
        <Modal.Body className='text-center py-4'>
            <p className='mb-0 fw-semibold'>Estas seguro que quieres cancelar tu suscripcion?</p>
        </Modal.Body>

        <Modal.Footer className='d-flex justify-content-center gap-2'>
            <Button variant='secondary' onClick={onHide}>
                Volver
            </Button>
            
            <Button variant='danger' onClick={onConfirmCancel}>
                Confirmar Baja
            </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ModalCancelMembership
