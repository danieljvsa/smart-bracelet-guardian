import React, { useContext, useState } from 'react';
import {Alert, Backdrop, Box, Button, Card, IconButton, Snackbar, TextField, Autocomplete} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import {useNavigate} from "react-router-dom";
import Context from '../Contexts/Context';
import axios from 'axios';
import { useEffect } from 'react';


export default function AddBracelet(props) {

    
    
    const [username, setUsername] = useState("");
    const [macAddress, setMacAddress] = useState("");
    
    const navigate = useNavigate();
    const {pushMessage, toggleError, toggleSuccess, profiles} = useContext(Context)

    

    async function addBracelet(bracelet){
        if (bracelet.name !== "" && bracelet.macAddress !== "") {
            await axios.post("https://brace-guardian.herokuapp.com/add-bracelet", {
                username: bracelet.name,
                macAddress: bracelet.macAddress
            }, {                
                headers: {                   
                    authorization: "Bearer " + localStorage.getItem("token")
                }
            }).then(res => {
                pushMessage(res.data)
                toggleSuccess()
            }).catch(err => {
                pushMessage(err.response.data)
                toggleError()
            })
    
        }else {
            pushMessage("There are empty spaces!")
            toggleError()
        }
    }
    return(
        <Backdrop open>
            <Card style={{padding: "10px 2rem 0 2rem"}}>
                <IconButton style={{float: "right"}} onClick={() => {props.toggle()}}>
                    <CloseIcon/>
                </IconButton>
                <h1>Add Bracelet</h1>
                <Autocomplete
                    id="search"
                    value={username}
                    options={profiles.map(option => option.name)}
                    onChange={(event, newValue) => {
                        if( newValue !== null ){
                            setUsername(newValue);
                        }else {
                            setUsername("");
                        }
                    }}
                    renderInput={params => (
                        <TextField
                            style={{width: "100%",marginTop: "1rem", alignSelf: "center"}}
                            {...params}
                            label="Patient Name"
                            variant="outlined"
                        />
                    )}
                />
                <TextField style={{width: "90%",marginTop: "1rem", alignSelf: "center"}} label="Mac Address" variant="outlined" value={macAddress} onChange={(event) => setMacAddress(event.target.value)}/>
                <Button style={{margin: "1rem"}} variant="contained" color="primary" onClick={() => {
                    addBracelet({name: username, macAddress: macAddress});
                    setUsername("");
                    setMacAddress("");
                    props.toggle();
                }}>Add Bracelet</Button>
            </Card>
            

        </Backdrop>
    )
}