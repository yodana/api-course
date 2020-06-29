import moment from "moment";
import React, { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import InvoicesAPI from "../services/invoicesAPI";
import {Link} from "react-router-dom";

const STATUS_CLASSES = {
    PAID:"success",
    SENT: "primary",
    CANCELLED : "danger"
};

const STATUS_LABELS = {
    PAID:"Payée",
    SENT:"Envoyé",
    CANCELLED: "Annulé"
};

const InvoicesPage = (props) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const [invoices, setInvoices] = useState([]);
    const fetchInvoices = async () =>{
        try{
            const data = await InvoicesAPI.findAll();
            setInvoices(data);  
    }catch(error){
        console.log(error.response);
        console.log("eeor");
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const handleDelete = async id => {
    
        const originalInvoicess = [...invoices];
        setInvoices(invoices.filter(invoice => invoice.id !== id));
        
        try {
            await InvoicesAPI.delete(id);

        } catch(error) {
            setInvoices(originalInvoicess);
            console.log(error.reponse);
        }
    };
    const handleSearch = ({currentTarget}) =>{
        const value  = currentTarget.value;
        setSearch(value);
        setCurrentPage(1);
     };
 
     const handleChangePage = page =>{
         setCurrentPage(page);
     }
     console.log(currentPage);
 
     const itemsPerPage = 10;
    const formatDate = (str) => moment(str).format('DD/MM/YYYY');
    const filteredInvoices = invoices.filter(i => i.customer.firstName.toLowerCase().includes(search.toLowerCase())
    || i.customer.lastName.toLowerCase().includes(search.toLowerCase())
    || i.amount.toString().startsWith(search.toLowerCase())
    || STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase())
    );
    const paginatedInvoices = Pagination.getData(
        filteredInvoices, 
        currentPage, 
        itemsPerPage);
    return (  
    <>
    <div className="d-flex justify-content-between align-items-center">    
    <h1> Listes des factures</h1>
    <Link className="btn btn-primary" to="invoices/new">Creer une facture</Link>
    </div>
    <div className="form-group">
        <input type="text" onChange={handleSearch} value={search} className="form-Control" placeholder="Rechercher ..."></input>
    </div>
    <table className="table table-hover">
        <thead>
            <tr>
                <th>
                    Numero
                </th>
                <th>
                    Client
                </th>
                <th className="text-center">
                   Date d'envoi
                </th>
                <th className="text-center">
                    Statut
                </th>
                <th className="text-center">
                    Montant
                </th>
                <th>
                    
                </th>
            </tr>
        </thead>
        <tbody>
            {paginatedInvoices.map(invoice => 
            <tr key={invoice.id}>
                <td>
                {invoice.chrono}
                </td>
                <td>
                   <a href="#"> {invoice.customer.firstName} {invoice.customer.lastName}</a>
                </td>
                <td className="text-center">
              {formatDate(invoice.sentAt)}
                </td>
                <td className="text-center">
                    <span className={"badge badge-" + STATUS_CLASSES[invoice.status]}>
                        {STATUS_LABELS[invoice.status]}
                    </span>
                </td>
                <td className="text-center">
                    {invoice.amount.toLocaleString()}
                </td>
                <td>
                    <Link to={"/invoices/" + invoice.id} className="btn btn-sm btn-primary mr-1">Editer</Link>
                </td>
            </tr>
            )}
        </tbody>
    </table>
    <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} onPageChanged={handleChangePage} length={filteredInvoices.length}></Pagination>
    </>
    );
}
 
export default InvoicesPage;