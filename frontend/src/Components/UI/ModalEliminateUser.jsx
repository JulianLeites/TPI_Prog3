import React from "react";

import { Modal, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { z } from "zod";

const ModalEliminateUser = ({ show, onHide, user, onConfirmElimination }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    // const confirmElimination = (data) => {
    //     if (data.confirmation === "ELIMINAR") {
    //         console.log(`Usuario con ID ${user.id} eliminado`);
    //         onHide();
    //         // Aquí iría la lógica para eliminar al usuario, como una llamada a la API
    //     }
    // };

    return (
        <div
            className="modal show"
            style={{ display: "block", position: "initial" }}
        >
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Estas Seguro de Eliminar este Usuario?</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>
            Estás a punto de eliminar al siguiente usuario: 
            <br />
            nombre: {user?.name} 
            <br />
            ID: {user?.id} 
            <br />
            Rol: {user?.role}
          </p>
          <p>Esta acción no se puede deshacer.</p>
          <p>Ingrese su ELIMINAR para confirmar:</p>
          <form id="eliminateUser" onSubmit={handleSubmit(onConfirmElimination)}>
            <input type="text" {...register("confirmation")}></input>
          </form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <Button variant="danger" type="submit" form="eliminateUser" onClick={() => {}}>
            Eliminar Usuario
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ModalEliminateUser;
