import React, {useContext} from 'react';
import {Redirect, Route} from "react-router-dom";
import AuthContent from "../contents/AuthContent";
const PrivateRoute = ({ path, component }) => {
  
    const {isAuthenticated} = useContext(AuthContent);
      return isAuthenticated ? (
      <Route path={path} component={component} />
    ) : (
      <Redirect to="/login" />
    );
  };

  export default PrivateRoute;