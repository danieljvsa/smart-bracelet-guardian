import {Button, Card, Autocomplete, TextField, Box} from "@mui/material";
import {useState, useEffect} from "react";
import axios from 'axios'
import { useContext } from "react";
import Context from "../Contexts/Context";

export default function BraceletCard(props){
    const [open, setOpen] = useState(false);
    const [username, setUsername] = useState(props.bracelet.name);
    const [macAddress, setMacAddress] = useState(props.bracelet.macAddress);
    const {profiles} = useContext(Context)

   

    if(open){
        return(
            <Card style={{padding: "10px 2rem 0 2rem", margin: "1rem"}}>
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
                            style={{width: "100%",marginTop: "2rem", alignSelf: "center"}}
                            {...params}
                            label="Username"
                            variant="outlined"
                        />
                    )}
                />
                <TextField
                    style={{width: "100%",marginTop: "2rem", alignSelf: "center"}}
                    label="Mac Address"
                    value={macAddress}
                    onChange={e => setMacAddress(e.target.value)}
                />
                <Box style={{display: "flex", flexDirection: "row",alignItems: "center", justifyContent: "center", padding: "1rem"}}>
                    <Button variant={"contained"} style={{flex:1, marginLeft: 5}} onClick={() => props.deleteBracelet(props.bracelet.id)}>Delete</Button>
                    <Button
                        variant={"contained"}
                        style={{flex:1, marginLeft: 5}}
                        onClick={() => {
                            console.log(props.bracelet)
                            props.updateBracelet(props.bracelet, username, macAddress);
                            setOpen(false);
                        }}>
                        Update
                    </Button>
                </Box>
                <Button variant="contained" onClick={() => setOpen(false)}>Close</Button>
            </Card>
        )

    }else {
        return(
            <Card style={{padding: "10px 2rem 0 2rem", margin: "1rem"}} onClick={() => setOpen(true)}>
                <h1>{props.bracelet.name}</h1>
                <p>{props.bracelet.macAddress}</p>
            </Card>
        )
    }

}