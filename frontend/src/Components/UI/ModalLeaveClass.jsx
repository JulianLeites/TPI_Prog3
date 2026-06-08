import React from 'react'
import { Modal, Button } from 'react-bootstrap'

const ModalLeaveClass = ({show, onHide, onConfirmLeave, clase}) => {
  return (
    <>
      <Modal show={show} onHide={onHide} centered backdrop='static' keyboard={false} size='sm'>
            <Modal.Header closeButton className='bg-danger text-white'>
                <Modal.Title className='fs-5'>Abandonar Clase</Modal.Title>
            </Modal.Header>
            
            <Modal.Body className='text-center py-4'>
                ¿Estás seguro que quieres abandonar la clase {clase ? clase.name : ''}?
            </Modal.Body>
    
            <Modal.Footer className='d-flex justify-content-center gap-2'>
                <Button variant='secondary' onClick={onHide}>
                    Volver
                </Button>
                
                <Button variant='danger' onClick={onConfirmLeave}>
                    Abandonar Clase
                </Button>
            </Modal.Footer>
        </Modal>
    </>
  )
}

export default ModalLeaveClass
