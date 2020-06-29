import React, { useState, useEffect } from "react";
import Field from "../components/File";
import Select from "../components/Select";
import { Link } from "react-router-dom";
import CustomersAPI from "../services/customersAPI";
import axios from "axios";
import InvoicesAPI from "../services/invoicesAPI";
const InvoicePage = ({history, match}) => {

   const {id = "new"} = match.params;
  const [invoice, setInvoice] = useState({
    amount: "",
    customer: "",
    status: "SENT"
  });
  const [editing, setEditing] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [errors, setErrors] = useState({
    amount: "",
    customer: "",
    status: ""
  });

  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setInvoice({ ...invoice, [name]: value });
  };
  const fetchCustomers = async () => {
    try {
      const data = await CustomersAPI.findAll();
      setCustomers(data);
      if (!invoice.customer) setInvoice({ ...invoice, customer: data[0].id });
    } catch (error) {
      console.log(error.responce);
    }
  };

  const handleSubmit = async event => {
    event.preventDefault();
    try {
        if(editing)
        {
           const response = await InvoicesAPI.update(id, invoice);
        }else{
      const response = await InvoicesAPI.create(invoice);
    }

      history.replace("/invoices");
    } catch (error) {
      if (error.response.data.violations) {
        const apiErrors = {};
        error.response.data.violations.forEach(violation => {
          apiErrors[violation.propertyPath] = violation.message;
        });
        setErrors(apiErrors);
      }
    }
  };

  const fetchInvoice = async id => {

    try{
        const data = await InvoicesAPI.find(id);
        const {amount, status, customer} = data;
        setInvoice({amount, status, customer: customer.id});
    }catch(error){
        history.replace("/invoices");
    }
  }
  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if(id !== "new"){
        setEditing(true);
        fetchInvoice(id);
    }
  }, [id]);

  return (
    <>
      {(editing && <h1> Modification dune facture </h1> )|| (<h1>Creation d'une facture </h1>)}
      <form onSubmit={handleSubmit}>
        <Field
          name="amount"
          type="number"
          placeholder="Montant de la facture"
          label="Montant"
          onChange={handleChange}
          value={invoice.amount}
          error={errors.amount}
        ></Field>
        <Select
          name="customer"
          label="Client"
          value={invoice.customer}
          onChange={handleChange}
          error={errors.customer}
        >
          {customers.map(customer => (
            <option key={customer.id} value={customer.id}>
              {customer.firstName} {customer.lastName}
            </option>
          ))}
        </Select>
        <Select
          name="status"
          label="Statut"
          value={invoice.status}
          onChange={handleChange}
          error={errors.status}
        >
          <option value="SENT">Envoyee</option>
          <option value="PAID">Payee</option>
          <option value="CANCELLED">Annulee</option>
        </Select>
        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Enregistrer
          </button>
          <Link to="/invoices" className="btn btn-link">
            {" "}
            Retour aux factures
          </Link>
        </div>
      </form>
    </>
  );
};

export default InvoicePage;
