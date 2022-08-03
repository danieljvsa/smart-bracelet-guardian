import React, { useContext, useState } from 'react';
import {Alert, Backdrop, Box, Button, Card, IconButton, Snackbar, TextField} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import {useNavigate} from "react-router-dom";
import axios from 'axios';
import Context from '../Contexts/Context';
import SNotification from "../Components/SNotification";

export default function SignUp(props) {

    const [email, setEmail] = useState('');
    const [password, setPassword] =useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    
    

    const navigate = useNavigate();
    const {pushMessage, toggleError, toggleSuccess } = useContext(Context)

    async function signUp(){
        if(password === confirmPassword){
            await axios.post('https://brace-guardian.herokuapp.com/create', {
               name: firstName, email: email, password: password
            },{
                headers: {
                    authorization: "Bearer " + localStorage.getItem("token")
                }               
            }).then(res => {
                pushMessage("User was created.")
                toggleSuccess()
            }).catch(err => {
                pushMessage(err.response.data)
                toggleError()
            })
        }else{
            pushMessage("Password's does not match")
            toggleError()
        }
    }

    function register(){
        signUp()
        props.toggle()
    }

    return(
        <Backdrop open>
            <Card style={{margin: "1rem"}}>

                <IconButton style={{float: "right"}} onClick={() => {props.toggle()}}>
                    <CloseIcon/>
                </IconButton>

                <h1 style={{textAlign: 'center'}}>Sign Up</h1>
                <Box sx={{display: "flex", flexDirection: "column"}} style={{padding: "10px 2rem 0 2rem"}}>
                    <TextField
                        style={{width: "100%", alignSelf: "center", marginBottom: "2rem"}}
                        label="Name"
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                    />
                    <TextField
                        style={{width: "100%", alignSelf: "center"}}
                        label="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <TextField
                        type={'password'}
                        style={{width: "100%", alignSelf: "center", marginTop: 20}}
                        label="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <TextField
                        type={'password'}
                        style={{width: "100%", alignSelf: "center", marginTop: 20}}
                        label="Confirm Password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                    />
                </Box>
                <Button onClick={() => {register()}} style={{margin: "1rem"}} variant={"contained"}>Sign up</Button>
            </Card>
            
        </Backdrop>
    )
}