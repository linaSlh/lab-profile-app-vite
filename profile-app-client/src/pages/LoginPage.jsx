import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5005";


function LoginPage(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);
  
  const navigate = useNavigate();

  const handleUsername = (e) => setUsername(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);

  //added by me to refresh the page after login
  const refreshPage = () => {
    window.location.reload();
  };

  
  //end
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const requestBody = { username, password };
 
    axios.post(`${API_URL}/auth/login`, requestBody)
    // authService.login(requestBody)
      .then((response) => {
      // Request to the server's endpoint `/auth/login` returns a response
      // with the JWT string ->  response.data.authToken
        console.log('JWT token',response.data.authToken); 
        // storeToken() // this will store the token in localStorage  , remove the (response.data.authToken )
        localStorage.setItem('authToken', response.data.authToken);
        
      
        // authenticateUser() // update the auth state variables accordingly
        navigate('/');  
        refreshPage();                            // <== ADD   
      })
      .catch((error) => {
        const errorDescription = error.response?.data?.message
        setErrorMessage(errorDescription);
      });
  };

  
  
  return (
    <div className="LoginPage">
      <h1>Login</h1>

      <form onSubmit={handleLoginSubmit}className="login-form">
      <div className="form-group">
        <label>username:</label>
        <input 
          type="string"
          name="username"
          value={username}
          onChange={handleUsername}
        />
        </div>
        <div className="form-group">
        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={handlePassword}
        />
        </div>
        <button type="submit">Login</button>
      </form>
      { errorMessage && <p className="error-message">{errorMessage}</p> }

      <p>if you do not have an account yet you can create your account here</p>
      <Link to={"/signup"}> Sign Up</Link>
    </div>
  )
}

export default LoginPage;