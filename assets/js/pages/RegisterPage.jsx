import React, { useState } from "react";
import Field from "../components/File";
import { Link } from "react-router-dom";
import axios from "axios";
import userAPI from "../services/userAPI";

const RegisterPage = ({history}) => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: ""
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: ""
  });
  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setUser({ ...user, [name]: value });
  };
  const handleSubmit = async event => {
    event.preventDefault();
    const apiErrors = {};
    if(user.password !== user.passwordConfirm){
        apiErrors.passwordConfirm ="Ne correspond pas";
        setErrors(apiErrors);
        return ;
    }
    try{
        const response = await userAPI.register(user);
        setErrors({});
    history.replace('/login');
    }catch(error){
        const {violations} = error.response.data;
        if(violations)
        {
            violations.forEach(violation =>{
                apiErrors[violation.propertyPath] = violation.message
            });
            setErrors(apiErrors);
        }
    }
  };
  return (
    <>
      <h1>Inscription</h1>
      <form onSubmit={handleSubmit}>
        <Field
          name="firstName"
          label="Prenom"
          placeholder="Prenom"
          error={errors.firstName}
          value={user.firstName}
          onChange={handleChange}
        ></Field>
        <Field
          name="lastName"
          label="Nom"
          placeholder="Nom"
          error={errors.lastName}
          value={user.lastName}
          onChange={handleChange}
        ></Field>
        <Field
          name="email"
          label="Adresse Email"
          placeholder="Adresse Email"
          type="email"
          error={errors.email}
          value={user.email}
          onChange={handleChange}
        ></Field>
        <Field
          name="password"
          label="Mot de passe"
          placeholder="Mot de passe"
          type="password"
          error={errors.password}
          value={user.password}
          onChange={handleChange}
        ></Field>
        <Field
          name="passwordConfirm"
          label="Confirmation du mot de passe"
          type="password"
          placeholder="Confirmation du mot de passe"
          error={errors.passwordConfirm}
          value={user.passwordConfirm}
          onChange={handleChange}
        ></Field>
        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Confirmer
          </button>
        <Link to="/login" className="btn btn-link">
          J ai deja un compte
        </Link>
        </div>
      </form>
    </>
  );
};

export default RegisterPage;
