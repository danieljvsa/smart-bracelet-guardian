import React, { useContext, useState } from 'react';
import {Alert, Backdrop, Box, Button, Card, IconButton, Snackbar, TextField, Autocomplete} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import {useNavigate} from "react-router-dom";
import Context from '../Contexts/Context';
import axios from 'axios';


export default function AddNurse(props) {

    
    
    const [number, setNumber] = useState("");
    const [username, setUsername] = useState("");
    const [division, setDivision] = useState("");
    const {pushMessage, toggleError, toggleSuccess} = useContext(Context)

    const navigate = useNavigate();
    const options = [
        { value: 'front', label: 'Front' },
        { value: 'end', label: 'Back' },
      ]

    function addNurse(nurse){
        if (nurse.nurseName !== "" && nurse.number !== "" && nurse.division != "") {
            axios.post("https://brace-guardian.herokuapp.com/add-nurse", {
                username: nurse.nurseName,
                phone: nurse.phone,
                division: (nurse.division == "Front") ? "front" : "end"
            },{
                headers: {
                    authorization: "Bearer " + localStorage.getItem("token")
                },
                
            }).then(res => {
                pushMessage(res.data)
                toggleSuccess()
            }).catch(err => {
                pushMessage(err.response.data)
                toggleError()
            })
        } else {
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
                <h1>Add Nurse</h1>
                <TextField style={{width: "100%",marginTop: "1rem", alignSelf: "center"}} label="Nurse Name" variant="outlined" value={username} onChange={(event) => setUsername(event.target.value)}/>
                <TextField style={{width: "100%",marginTop: "1rem", alignSelf: "center"}} label="Phone Number" variant="outlined" value={number} onChange={(event) => setNumber(event.target.value)}/>
                <Autocomplete
                    id="search"
                    value={division}
                    options={options}
                    onChange={(event, newValue) => {
                        if( newValue !== null ){
                            setDivision(newValue.label);
                        }else {
                            setDivision("");
                        }
                    }}
                    renderInput={params => (
                        <TextField
                            style={{width: "100%",marginTop: "1rem", alignSelf: "center"}}
                            {...params}
                            label="Division"
                            variant="outlined"
                        />
                    )}
                />
                <Button style={{margin: "1rem"}} variant="contained" color="primary" onClick={() => {
                    addNurse({nurseName: username, phone: number, division: division});
                    setUsername("");
                    setNumber("");
                    setDivision("");
                    props.toggle();
                }}>Add Nurse</Button>
            </Card>
            

        </Backdrop>
    )
}