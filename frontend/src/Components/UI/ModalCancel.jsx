import React from 'react'
import { Modal, Button } from 'react-bootstrap'

const ModalCancel = ({show, onHide, onConfirmCancelMembership, onConfirmCancelClass, message}) => {
  return (
    <>
      <Modal show={show} onHide={onHide} centered backdrop='static' keyboard={false} size='sm'>
        <Modal.Header closeButton className='bg-danger text-white'>
            <Modal.Title className='fs-5'>
              {message === 'Membresia' ? (
                'Cancelar Membresia'
              ) : (
                'Abandonar Clase'
              )}
            </Modal.Title>
        </Modal.Header>
        
        <Modal.Body className='text-center py-4'>
            <p className='mb-0 fw-semibold'>
              {message === 'Membresia' ? (
                '¿Estas seguro que quieres cancelar tu mebresia?'
              ) : (
                '¿Estas seguro que quieres abandonar la clase?'
              )}
            </p>
        </Modal.Body>

        <Modal.Footer className='d-flex justify-content-center gap-2'>
            <Button variant='secondary' onClick={onHide}>
                Volver
            </Button>
            
            <Button variant='danger' onClick={message === 'Membresia' ? (onConfirmCancelMembership) : (onConfirmCancelClass)}>
                Confirmar Baja
            </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ModalCancel
