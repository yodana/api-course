import React, { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import CustomersAPI from "../services/customersAPI";
import {Link} from "react-router-dom";

const CustomersPage = (props) => {

    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const fetchCustomers = async () => {
        try{
            const data = await CustomersAPI.findAll()
            setCustomers(data);
          }catch(error){
              console.log(error.reponse);
          }
    }
    useEffect(() => {
        fetchCustomers();
        },[]);

    const handleSearch = ({currentTarget}) =>{
       const value  = currentTarget.value;
       setSearch(value);
       setCurrentPage(1);
    };

    const handleDelete = async id => {
    
        const originalCustomers = [...customers];
        setCustomers(customers.filter(customer => customer.id !== id));
        try {
            await CustomersAPI.delete(id)

        } catch(error) {
            setCustomers(originalCustomers);
            console.log(error.reponse);
        }
    };

    const handleChangePage = page =>{
        setCurrentPage(page);
    }
    console.log(currentPage);

    const itemsPerPage = 10;
    const filteredCustomers = customers.filter(c => 
        c.firstName.toLowerCase().includes(search.toLowerCase()) ||
        c.lastName.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        (c.company && c.company.toLowerCase().includes(search.toLowerCase())));
    
        const paginatedCustomers = Pagination.getData(
            filteredCustomers, 
            currentPage, 
            itemsPerPage);
    return <>
    <div className="d-flex justify-content-between align-items-center">
        <h1>Liste des clients</h1>
        <Link to="/customers/new" className="btn btn-primary">
            Creer un client
        </Link>
    </div>
    <div className="form-group">
        <input type="text" onChange={handleSearch} value={search} className="form-Control" placeholder="Rechercher ..."></input>
    </div>
    <table className="table table-hover">
       <thead>
           <tr>
               <th>Id</th>
               <th>Client</th>
               <th>Email</th>
               <th>Entreprise</th>
               <th className="text-center">Factures</th>
               <th className="text-center">Montant total</th>
               <th></th>
           </tr>
       </thead>
       <tbody>
           {paginatedCustomers.map(customer => <tr key={customer.id}>
               <td>{customer.id}</td>
               <td>
                   <Link to={"/customers/" + customer.id}>{customer.firstName} {customer.lastName}</Link>
               </td>
               <td>{customer.email}</td>
               <td>{customer.company}</td>
               <td className="text-center">
                   <span className="badge badge-primary">
                   {customer.invoices.length}
                   </span>
                </td>
               <td className="text-center">{customer.totalAmount.toLocaleString()}</td>
               <td> <button onClick={() => handleDelete(customer.id)}
               disabled={customer.invoices.length > 0} className="btn btn-sm btn-danger">Supprimer </button></td>
           </tr>)}
       </tbody>
    </table>
       {itemsPerPage < filteredCustomers.length 
       && 
       <Pagination currentPage={currentPage} 
        itemsPerPage={itemsPerPage} 
        length={filteredCustomers.length} 
        onPageChanged={handleChangePage}/>}
    </>;
}
 
export default CustomersPage;