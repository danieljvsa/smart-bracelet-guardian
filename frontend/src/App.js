import logo from './logo.svg';
import './App.css';
import Login from "./Pages/Login";
import OverView from "./Pages/OverView";
import {
    BrowserRouter as Router,
    Route,
    Routes, useLocation
} from "react-router-dom";
import {AppBar, Box, Button, Toolbar, Typography} from "@mui/material";
import NavBar from "./Components/NavBar";
import NurseOverview from "./Pages/nurseOverview";
import Bracelets from "./Pages/Bracelets";
import HomePage from "./Pages/HomePage";

function App() {
    return (
        <Router>
            <HomePage/>
        </Router>
    );
}

export default App;
