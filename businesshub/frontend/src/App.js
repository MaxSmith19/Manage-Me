import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Login from './pages/Login';
import Registration from './pages/Registration';
import Header from './Components/Header';
import Ledgers from './pages/Ledgers';
import Dashboard from './pages/dashboard'
import Legislation from './pages/legislation';
import { Navigate } from 'react-router-dom';
import Footer from "./Components/Footer";
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./animations.css";
import UserSettings from './pages/userSettings';

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  const unpackCookie = () => {
    const authCookie = document.cookie.split(';').find(cookie => cookie.trim().startsWith('token='));
    if (authCookie !== undefined) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
  };

  useEffect(() => {
    unpackCookie();
  }, []);

  const handleLogout = () => {
    setAuthenticated(false);
    console.log(authenticated)
  }

  const handleLogin = () => {
    setAuthenticated(true);
    console.log(authenticated)
  }
  const containers = document.querySelectorAll('.animationContainer li');
  containers.forEach((container) => {
    const randomDelay = Math.floor(Math.random() * 25) + 1;
    const randomLeft = Math.floor(Math.random() * 100) + 1;
    const randomHeight = Math.floor(Math.random() * 100) + 1
    const randomDuration = Math.floor(Math.random() * 30) + 1;
    container.style.animationDelay = `${randomDelay}s`;
    container.style.left = `${randomLeft}%`;
    container.style.height = `${randomHeight}px`;
    container.style.width = `${randomHeight}px`;
    container.style.animationDuration = `${randomDuration}s`;
  });
  return (
    <>
      <Router>
        {authenticated ? (
        <Header authenticated={authenticated} onLogout={handleLogout}/>
        
        ): 
        <div className="border bg-white h-20 shadow-md"></div>
        
        }
        <div className="m-12">
          <Routes>
            {authenticated ? (
              <>
                <Route path="/Ledgers" element={<Ledgers />} />
                <Route path="/Dashboard" element={<Dashboard />} />
                <Route path="/UserSettings" element={<UserSettings />} />
                <Route path="/Legislation" element={<Legislation />} />
              </>
            ) : (<Route path="/" exact element={<Navigate replace to="/Login"></Navigate>} />)}
            <Route path="/Login" element={<Login onLogin={handleLogin}/>} />
            <Route path="/Register" element={<Registration />} />
          </Routes>
        </div>
      </Router>
      <ul className="animationContainer">
        <li className=""> </li>
        <li className=""> </li>
        <li className=""> </li>
        <li className=""> </li>
        <li className=""> </li>
        <li className=""> </li>
        <li className=""> </li>
        <li className=""> </li>
        <li className=""> </li>
        <li className=""> </li>
        <li className=""> </li>
        <li className=""> </li>
        <li className=""> </li>
        <li className=""> </li>
        <li className=""> </li>
        <li className=""> </li>
        <li className=""> </li>
        <li className=""> </li>
        <li className=""> </li>
        <li className=""> </li>
        <li className=""> </li>
        <li className=""> </li>
        <li className=""> </li>
        <li className=""> </li>
        <li className=""> </li>
        <li className=""> </li>
        <li className=""> </li>
        <li className=""> </li>
        <li className=""> </li>
        <li className=""> </li>
        <li className=""> </li>
        <li className=""> </li>
        <li className=""> </li>
        <li className=""> </li>
    </ul>
    </>
  );
}


export default App;
