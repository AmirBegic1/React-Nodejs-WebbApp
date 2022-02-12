
import './App.css';
import React from 'react';
import ReactDOM from "react-dom";
import {useEffect, useState} from "react";
import {BrowserRouter as Router, Route, Routes , Link } from "react-router-dom";

import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import { AuthContext } from "./helper/AuthContext";
import axios from "axios";










function App() {
  const [authState,setAuthState] = useState({username:"", id: 0, status: false,});
  
  useEffect(()=>{
    axios.get("http://localhost:3333/auth/auth", {headers: {
      accessToken: localStorage.getItem("accessToken"),
    }}).then((response)=>{

      if(response.data.error){
        setAuthState({...authState, status: false});
      }else{
        setAuthState({username: response.data.username, id: response.data.id, status: true,});
      }
    });
      
    
  }, []);

const logut = () =>{
  localStorage.removeItem("accessToken");
  setAuthState({username:"", id: 0, status: false,});
}

  return (
    <div className="App">
      <AuthContext.Provider value={{authState, setAuthState}}>
        <Router>
          <div className="navbar">
          <Link to="/createpost">Napravi novi post :)</Link>
          <Link to="/">Home Page</Link>
          { !authState.status ? (
            <>
            <Link to="/login">Login</Link>
            <Link to="/registration">Registracija</Link>
            </>
          ) : (
            <button onClick={logut}> Odjavi se</button>
          )}
            <h1>{authState.username}</h1>
          </div>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* ovdje dole dodat rute koje hocemo odnosno straniceee! nemoj zaboravittt   */}
            <Route path="/createpost" element={<CreatePost />} />
            <Route path="/post/:id" element={<Post />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/login" element={<Login />} />


          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
