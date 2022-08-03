import {AppBar, Box, Button, Toolbar} from "@mui/material";
import {useLocation, useNavigate} from "react-router-dom";
import {useContext, useState} from "react";

import Context from '../Contexts/Context'

export default function NavBar(){
    const navigate = useNavigate();
    const location = useLocation();
    const {toggleSingUp} = useContext(Context)
    
    
    if(location.pathname === "/"){
        return null;
    }
    else{
        return (
            <AppBar position="static" style={{backgroundColor: "#6200ea"}}>
                <Toolbar>
                    <Box flexGrow={1}>
                        {<Button onClick={() => toggleSingUp()} color="inherit">New User</Button>}
                        <Button onClick={() => navigate("/overview")} color="inherit">Overview</Button>
                        <Button onClick={() => navigate("/nurses")} color="inherit">Nurses</Button>
                        <Button onClick={() => navigate("/bracelets")} color="inherit">Bracelets</Button>
                    </Box>
                    <Box>
                        <Button onClick={() => {
                            localStorage.removeItem("token");
                            window.dispatchEvent( new Event('storage') );
                        }} color="inherit">Logout</Button>
                    </Box>
                    
                </Toolbar>
            </AppBar>
        );
    }

}