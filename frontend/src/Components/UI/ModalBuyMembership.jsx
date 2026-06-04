import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Modal, Form, Row, Col, Accordion } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z
  .object({
    name: z.string().min(1, "Nombre requerido"),
    surname: z.string().min(1, "Apellido requerido"),
    documentType: z
      .string()
      .min(1, "Tipo de documento requerido")
      .regex(/^(DNI|Pasaporte|Licencia)$/, "Tipo de documento inválido"),
    documentNumber: z.string().min(1, "Número de documento requerido"),
    cardNumber: z
      .string()
      .length(16, "Número de tarjeta requerido")
      .regex(/^\d+$/, "Número de tarjeta debe ser numérico"),
    expiryDate: z
      .string()
      .length(5, "Fecha de vencimiento requerida")
      .regex(
        /^(0[1-9]|1[0-2])\/\d{2}$/,
        "Fecha de vencimiento debe ser en formato MM/YY",
      ),
    cvv: z
      .string()
      .length(3, "CVV requerido")
      .regex(/^\d+$/, "CVV debe ser numérico"),
  })
  .superRefine((data, ctx) => {
    const { documentType, documentNumber } = data;

    // Validaciones específicas según el tipo de documento
    if (documentType === "DNI") {
      if (!/^\d+$/.test(documentNumber)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["documentNumber"],
          message: "DNI debe contener solo números",
        });
      }
      if (documentNumber.length !== 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["documentNumber"],
          message: "DNI debe tener exactamente 8 dígitos",
        });
      }
    } else if (documentType === "Pasaporte") {
      if (documentNumber.length < 6 || documentNumber.length > 9) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["documentNumber"],
          message: "Pasaporte debe tener entre 6 y 9 caracteres",
        });
      }
      if (!/^[A-Z0-9]{6,9}$/.test(documentNumber.toUpperCase())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["documentNumber"],
          message: "Pasaporte solo puede contener letras y números",
        });
      }
    } else if (documentType === "Licencia") {
      if (!/^\d+$/.test(documentNumber)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["documentNumber"],
          message: "Licencia debe contener solo números",
        });
      }
      if (documentNumber.length < 7 || documentNumber.length > 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["documentNumber"],
          message: "Licencia debe tener entre 7 y 8 dígitos",
        });
      }
    }
  });

function ModalBuyMembership({ show, onHide, selectedMembership }) {
  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const documentType = watch("documentType");

  // Configuración de placeholders y ayuda según el tipo de documento
  const getDocumentConfig = () => {
    switch (documentType) {
      case "DNI":
        return {
          placeholder: "Ej: 12345678",
          help: "(8 dígitos)",
        };
      case "Pasaporte":
        return {
          placeholder: "Ej: ABC123456",
          help: "(6-9 caracteres, letras y números)",
        };
      case "Licencia":
        return {
          placeholder: "Ej: 1234567",
          help: "(7-8 dígitos)",
        };
      default:
        return {
          placeholder: "Selecciona un tipo de documento",
          help: "",
        };
    }
  };

  const { placeholder, help } = getDocumentConfig();

  const onSubmit = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      throw new Error();
      console.log(data);
    } catch (error) {
      setError("root", { message: "Error al procesar la compra" });
    }
  };

  return (
    <div
      className="modal show"
      style={{ display: "block", position: "initial" }}
    >
      <Modal
        show={show}
        onHide={onHide}
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Compra</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Accordion className="mb-3">
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <h5>{selectedMembership ? `Suscripción: ${selectedMembership.name}` : "Suscripción"}</h5>
              </Accordion.Header>
              <Accordion.Body>
                <p>Cuota: {selectedMembership ? selectedMembership.quota : "N/A"}</p>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          <form id="purchase" onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col>
                <label className="form-label">Nombre</label>
                <input
                  {...register("name")}
                  className="form-control mb-2"
                  type="text"
                  placeholder="First Name"
                />
                {errors.name && (
                  <p className="text-danger">{errors.name.message}</p>
                )}
              </Col>
              <Col>
                <label className="form-label">Apellido</label>
                <input
                  {...register("surname")}
                  className="form-control mb-2"
                  type="text"
                  placeholder="Last Name"
                />
                {errors.surname && (
                  <p className="text-danger">{errors.surname.message}</p>
                )}
              </Col>
            </Row>

            <Row>
              <Col>
                <label className="form-label">Tipo de Documento</label>
                <select
                  {...register("documentType")}
                  className="form-control mb-2"
                >
                  <option value="">Seleccionar</option>
                  <option value="DNI">DNI</option>
                  <option value="Pasaporte">Pasaporte</option>
                  <option value="Licencia">Licencia de Conducir</option>
                </select>
                {errors.documentType && (
                  <p className="text-danger">{errors.documentType.message}</p>
                )}
              </Col>

              <Col>
                <label className="form-label">Número de Documento</label>
                <input
                  {...register("documentNumber")}
                  className="form-control mb-2"
                  type="text"
                  placeholder={placeholder}
                  disabled={!documentType}
                />
                {help && (
                  <small className="text-muted d-block mb-2">{help}</small>
                )}
                {errors.documentNumber && (
                  <p className="text-danger">{errors.documentNumber.message}</p>
                )}
              </Col>
            </Row>

            <Row>
              <Col>
                <label className="form-label">Número de Tarjeta</label>
                <input
                  {...register("cardNumber")}
                  className="form-control mb-2"
                  type="text"
                  placeholder="Número de Tarjeta"
                />
                {errors.cardNumber && (
                  <p className="text-danger">{errors.cardNumber.message}</p>
                )}
              </Col>
            </Row>

            <Row>
              <Col>
                <label className="form-label">Fecha de Vencimiento</label>
                <input
                  {...register("expiryDate", {
                    onChange: (e) => {
                      const value = e.target.value;
                      if (value.length === 2 && !value.includes("/")) {
                        e.target.value = value + "/";
                      }
                    },
                  })}
                  className="form-control mb-2"
                  type="text"
                  placeholder="MM/YY"
                />
                {errors.expiryDate && (
                  <p className="text-danger">{errors.expiryDate.message}</p>
                )}
              </Col>
              <Col>
                <label className="form-label">CVV</label>
                <input
                  {...register("cvv")}
                  className="form-control mb-2"
                  type="text"
                  placeholder="CVV"
                />
                {errors.cvv && (
                  <p className="text-danger">{errors.cvv.message}</p>
                )}

                {errors.root && (
                  <p className="text-danger">{errors.root.message}</p>
                )}
              </Col>
            </Row>
          </form>
          <p className="text-center">Total a pagar: {selectedMembership ? `$${selectedMembership.price}` : "N/A"}</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="danger" onClick={onHide}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={isSubmitting}
            form="purchase"
          >
            {isSubmitting ? "Procesando..." : "Confirmar"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ModalBuyMembership;
