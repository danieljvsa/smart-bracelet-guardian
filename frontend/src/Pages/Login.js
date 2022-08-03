import {useEffect, useState} from "react";
import {Box, Button, Card, TextField, Typography} from "@mui/material";
import SignUp from "../Components/SignUp";
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import { useContext } from "react";
import Context from "../Contexts/Context";
import SNotification from "../Components/SNotification";

export default function Login(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [showSingUp, setShowSingUp] = useState(false);
    const navigate = useNavigate();
    const {isError, isSuccess, pushMessage, toggleError, message} = useContext(Context)



    useEffect(() => {
            if(localStorage.getItem("token") !== null && localStorage.getItem("token") !== undefined && localStorage.getItem("token") !== ""){
                navigate('/overview');
            }
    }, [localStorage.getItem('token')]);




    function login(){


        axios.post("https://brace-guardian.herokuapp.com/authenticate", {
            email: email, 
            password: password            
        }).then(res => {
            console.log(res.data.token)
            localStorage.setItem("token", res.data.token);
            window.dispatchEvent( new Event('storage') );
        }).catch(err => {
            pushMessage(err.response.data)
            toggleError()
        })



        //localStorage.setItem('token', 'token'); //temp
        window.dispatchEvent( new Event('storage') );
    }


    return (
        <div>
            <Card style={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}>
                <Box sx={{display: "flex", flexDirection: "column", paddingTop: "1rem", margin: "1.5rem"}}>
                    <TextField
                        style={{width: "100%", alignSelf: "center"}}
                        label="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <TextField
                        type={'password'}
                        style={{width: "100%", alignSelf: "center", marginTop: "2rem"}}
                        label="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </Box>
                <Box sx={{display: 'flex', alignItems: 'center', pl: 1, pb: 1}}>
                    
                    {/*<Typography onClick={() => toggleSingUp()} style={{paddingLeft: 10, flex: 1, textDecoration: "underline"}}>
                        Forgot your password?
                    </Typography>*/}
                    <Button style={{margin: "2rem", flex: 1}} variant={"contained"} onClick={login}>Login</Button>
                </Box>
            </Card>

            {isSuccess ? <SNotification severity={"success"} message={message} /> : null}
            {isError ? <SNotification severity={"error"} message={message} /> : null}
        </div>


    );
}