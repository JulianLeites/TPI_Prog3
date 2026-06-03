import React from 'react'
import { Modal, Button } from 'react-bootstrap'

const ModalDeleteClass = ({show, onHide, onConfirmDelete}) => {
  return (
    <div>
        <Modal show={show} onHide={onHide} centered size="sm">
            <Modal.Header closeButton className="bg-danger text-white">
                <Modal.Title className="fs-5">¿Eliminar Clase?</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center py-4">
                <p className="mb-0 fw-semibold">¿Estás seguro de eliminar esta actividad de la grilla?</p>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-center gap-2">
                <Button variant="secondary" onClick={onHide}>
                    Cancelar
                </Button>
                <Button variant="danger" onClick={onConfirmDelete}>
                    Eliminar
                </Button>
            </Modal.Footer>
        </Modal>
    </div>
  )
}

export default ModalDeleteClass
