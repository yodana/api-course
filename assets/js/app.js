/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */
import React, { useState , useContext} from "react";
import ReactDOM from "react-dom";
import Navbar from "./components/Navbar";
import AuthContext from "./contents/AuthContent";
// any CSS you import will output into a single css file (app.css in this case)
import "../css/app.css";
import HomePage from "./pages/HomePage";
import {
  HashRouter,
  Switch,
  Route,
  withRouter,
  Redirect
} from "react-router-dom";
import CustomersPage from "./pages/CustomersPage";
import CustomersPageWithPagination from "./pages/CustomersPageWithPagination";
import InvoicesPage from "./pages/InvoicesPage";
import InvoicePage from "./pages/InvoicePage";
import LoginPage from "./pages/LoginPage";
import AuthApi from "./services/authAPI";
import AuthContent from "./contents/AuthContent";
import PrivateRoute from "./components/PrivateRoute";
import CustomerPage from "./pages/CustomerPage";
import RegisterPage from "./pages/RegisterPage";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
// Need jQuery? Install it with "yarn add jquery", then uncomment to import it.
// import $ from 'jquery';

console.log("Hello Webpack Encore! Edit me in assets/js/app.js");
AuthApi.setup();

const App = () => {
  const NavbarWithRouter = withRouter(Navbar);
  const [isAuthenticated, setIsAuthenticated] = useState(
    AuthApi.isAuthenticated()
  );

  return (
    <>
    <AuthContext.Provider value={{
      isAuthenticated,
      setIsAuthenticated
  }}>
      <HashRouter>
        <NavbarWithRouter
          
        />
        <main className="container pt-5">
          <Switch>
              <Route path="/register" component={RegisterPage}></Route>
            <Route
              path="/login"
             component={LoginPage}
            ></Route>
            <PrivateRoute
              path="/invoices/:id"
              component={InvoicePage}
            />
            <PrivateRoute
              path="/invoices"
              component={InvoicesPage}
            />
            <PrivateRoute
              path="/customers/:id"
              component={CustomerPage}
            />
            <PrivateRoute
              path="/customers"
              component={CustomersPage}
            />
            <Route path="/" component={HomePage}></Route>
          </Switch>
        </main>
      </HashRouter>
      <ToastContainer position={toast.POSITION.BOTTOM_LEFT}>

      </ToastContainer>
      </AuthContext.Provider>
    </>
  );
};

const rootElement = document.querySelector("#app");
ReactDOM.render(<App />, rootElement);
