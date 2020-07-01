import React, { useState, useEffect } from "react";
import Field from "../components/File";
import { Link } from "react-router-dom";
import CustomersAPI from "../services/customersAPI";
import { toast } from "react-toastify";

const CustomerPage = ({ match, history }) => {
  const { id = "new" } = match.params;

  const [editing, setEditing] = useState(false);

  const fetchCustomer = async id => {
    try {
      const data = await CustomersAPI.find(id);
      const { firstName, lastName, email, company } = data;
      setCustomer({ firstName, lastName, email, company });
    } catch (error) {
      console.log(error.response);
      history.replace("/customers");
    }
  };
  useEffect(() => {
    if (id !== "new") {
      setEditing(true);
      fetchCustomer(id);
    }
  }, [id]);
  const [customer, setCustomer] = useState({
    lastName: "",
    firstName: "",
    email: "",
    company: ""
  });
  const [errors, setErrors] = useState({
    lastName: "",
    firstName: "",
    email: "",
    company: ""
  });
  const handleSubmit = async event => {
    event.preventDefault();
    try {
      if (editing) {
        const response = await CustomersAPI.update(id, customer);
      } else {
        const response = await CustomersAPI.create(customer);
      }
      toast.success("Un client a bien ete rajoute");
      history.replace("/customers");
      setErrors({});
    } catch (error) {
      if (error.response.data.violations) {
        const apiErrors = {};
        error.response.data.violations.forEach(violation => {
          apiErrors[violation.propertyPath] = violation.message;
        });
        setErrors(apiErrors);
        toast.error("Erreur dans le formulaire de rajout du client");
      }
    }
  };

  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setCustomer({ ...customer, [name]: value });
  };
  return (
    <>
      {(!editing && <h1>Creation d un client</h1>) || (
        <h1>Modifier un client</h1>
      )}
      <form onSubmit={handleSubmit}>
        <Field
          name="lastName"
          label="Nom de famille"
          placeholder="Nom de famille du client"
          value={customer.lastName}
          onChange={handleChange}
          error={errors.lastName}
        ></Field>
        <Field
          name="firstName"
          label="Prenom"
          placeholder="Prenom du client"
          value={customer.firstName}
          onChange={handleChange}
          error={errors.firstName}
        ></Field>
        <Field
          name="email"
          label="Email"
          placeholder="Email du client"
          type="email"
          value={customer.email}
          onChange={handleChange}
          error={errors.email}
        ></Field>
        <Field
          name="company"
          label="Entreprise"
          placeholder="Entreprise du client"
          value={customer.company}
          onChange={handleChange}
          error={errors.company}
        ></Field>

        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Enregistrer
          </button>
          <Link to="/customers" className="btn btn-link">
            Retour a la liste
          </Link>
        </div>
      </form>
    </>
  );
};

export default CustomerPage;
