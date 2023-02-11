import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Login from './pages/Login';
import Registration from './pages/Registration';
import Header from './Components/Header';
import Footer from "./Components/Footer";

function App() {
  return (
    <>
    <Router>
        <Header />
        <div className="justify-center flex ">
        <Routes>
          <Route path='/Login' element={<Login />} /> 
          <Route path='/Register' element={<Registration/>} />
        </Routes>
        </div>
    <Footer />
    </Router>
    </>
    );
}

export default App;
