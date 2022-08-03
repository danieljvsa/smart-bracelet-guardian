import {useEffect} from "react";
import {BrowserRouter as Router, Route, Routes, useNavigate} from "react-router-dom";
import NavBar from "../Components/NavBar";
import Login from "./Login";
import OverView from "./OverView";
import NurseOverview from "./nurseOverview";
import Bracelets from "./Bracelets";
import Patient from "./Patient";
import { ContextProvider } from '../Contexts/Context'

export default function HomePage(){
    const navigate = useNavigate();


    useEffect(() => {

        function checkToken() {
            console.log("storage changed");
            if(localStorage.getItem("token") !== null && localStorage.getItem("token") !== undefined && localStorage.getItem("token") !== ""){
                navigate("/overview");
            }else {
                navigate("/");
            }
        }
        window.addEventListener('storage', checkToken);
        return () => window.removeEventListener('storage', checkToken);
    }, []);

  return (
      <div className="App">
        <ContextProvider>    
            <NavBar/>
            <Routes>
                <Route exact path="/" element={<Login />} />
                <Route path="/overview" element={<OverView />} />
                <Route path="/nurses" element={<NurseOverview/>} />
                <Route path="/bracelets" element={<Bracelets/>} />
                <Route path="/patient/:id" element={<Patient/>} />
            </Routes>
        </ContextProvider>
      </div>
  );
}