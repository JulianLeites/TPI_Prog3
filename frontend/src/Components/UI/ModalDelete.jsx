import React from 'react'
import { Modal, Button } from 'react-bootstrap'

const ModalDelete = ({show, onHide, onConfirmDelete, message}) => {
  return (
    <div>
        <Modal show={show} onHide={onHide} centered backdrop='static' keyboard={false} size="sm">
            <Modal.Header closeButton className="bg-danger text-white">
                <Modal.Title className="fs-5">Eliminar {message}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center py-4">
                <p className="mb-0 fw-semibold">¿Estás seguro de eliminar esta {message}?</p>
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

export default ModalDelete
