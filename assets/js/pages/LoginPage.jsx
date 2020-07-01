import React, { useState, useContext } from "react";
import AuthAPI from "../services/authAPI";
import AuthContent from "../contents/AuthContent";
import Field from "../components/File";
import { toast } from "react-toastify";

const LoginPage = ({history}) => {

const {setIsAuthenticated} = useContext(AuthContent);
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });
  const [error, setError] = useState("");
  // GEstion des champs
  const handleChange = event => {
    const value = event.currentTarget.value;
    const name = event.currentTarget.name;

    setCredentials({ ...credentials, [name]: value });
  };
// GEstion des submits
  const handleSubmit = async event => {
    event.preventDefault();
    try {
      await AuthAPI.authenticate(credentials);
      setError("");
      setIsAuthenticated(true);
      toast.success("vous etes connecte");
      history.replace("/customers");
    } catch (error) {
      console.log(error.response);
      setError("Mauvaise connexion avec l'user");
      toast.error("Mauvaise connexion");
    }
    console.log(credentials);
  };
  return (
    <>
      <h1>Connexion à l'application</h1>
      <form onSubmit={handleSubmit}>
       <Field label="Adresse email" name="username" value={credentials.username} onChange={handleChange}
       placeholder="Adresse email de connexion" error={error}>
       </Field>
       <Field name="password" label="Mot de passe" placeholder="Mot de passe" value={credentials.password} onChange={handleChange}
       type="password" error="">

       </Field>
        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Je me connecte
          </button>
        </div>
      </form>
    </>
  );
};

export default LoginPage;
