import React from "react";
import { useState, useRef } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.
    object({
        email: z
            .string()
            .email("Email inválido")
            .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email debe tener formato válido"),
        password: z
            .string()
            .min(6, "La contraseña debe tener al menos 6 caracteres")
});

const Login = ({ onLogin }) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const navigate = useNavigate();
/*
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSubmit = (e) => {
      e.preventDefault();
      if (validation()) {
        console.log(email, password);
        navigate("/dashboard");
        onLogin(true);
      }
  };

  const validation = () => {
    let isValid = true;
    if (password == "") {
      passwordRef.current.focus();
      setPasswordError(true);
      isValid = false;
    }
    if (email == "") {
      emailRef.current.focus();
      setEmailError(true);
      isValid = false;
    }

    return isValid;
  };
  */
  const onSubmit = (data) => {
    console.log(data);
    navigate("/dashboard");
    onLogin(true);
  };

  return (
    <div>
      <Form onSubmit={handleSubmit(onSubmit)} className="p-5 m-5 bg-secondary">

        <Link className="d-block text-end mb-1" to="/register">
          Registrarse
        </Link>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>

          <Form.Control
            placeholder="Ingrese email"
            {...register("email")}
          />

          {errors.email && (
            <p className="text-danger mt-1">
              {errors.email.message}
            </p>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Contraseña</Form.Label>

          <Form.Control
            type="password"
            placeholder="Contraseña"
            {...register("password")}
          />

          {errors.password && (
            <p className="text-danger mt-1">
              {errors.password.message}
            </p>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label="Mantener sesión"
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Iniciar sesión
        </Button>

      </Form>
      {/* <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="ingrese email"
            ref={emailRef}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError(false);
            }}
          />
          <Form.Text className="text-danger">
            {emailError && <p>este campo no puede estar vacío </p>}
          </Form.Text>
        </Form.Group> */}

      {/* <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            placeholder="Contraseña"
            ref={passwordRef}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError(false);
            }}
          />
          <Form.Text className="text-danger">
            {passwordError && <p>este campo no puede estar vacío </p>}
          </Form.Text>
        </Form.Group> */}

      {/* <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Mantener sesión" />
        </Form.Group> */}

    </div>
  );
};

export default Login;
