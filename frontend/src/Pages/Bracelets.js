import BraceletCard from "../Components/BraceletCard";
import {useEffect, useState, useContext} from "react";
import {Autocomplete, Button, Card, Grid, TextField, Typography, Alert, Snackbar} from "@mui/material";
import axios from "axios";
import Context from "../Contexts/Context";
import SignUp from "../Components/SignUp";
import AddBracelet from "../Components/AddBracelet";
import SNotification from "../Components/SNotification";

export default function Bracelets(){
    const [bracelets, setBracelets] = useState([]);
    const [profiles, setProfiles] = useState([]);
    
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("");

    const [open, SetOpen] = useState(true)
    const [username, setUsername] = useState("");
    const [macAddress, setMacAddress] = useState("");
    const {message, pushMessage, showSingUp, toggleSingUp, showAddBracelet, toggleAddBracelet, isSuccess, isError, toggleError, toggleSuccess} = useContext(Context)

    useEffect(() => {
        axios.get("https://brace-guardian.herokuapp.com/bracelets", {
            headers: {
                authorization: "Bearer " + localStorage.getItem("token")
            }
        }).then(res => {
                //console.log(res.data)
                setBracelets(res.data);
            })
            .catch(err => console.log(err));
        
        axios.get("https://brace-guardian.herokuapp.com/get-profiles", {
            headers: {
                authorization: "Bearer " + localStorage.getItem("token")
            }
        }).then(res => {
                //console.log(res.data)
                setProfiles(res.data);
            })
            .catch(err => console.log(err));
    }, [bracelets]);

    function handleClose(event, reason) {
        if (reason === 'clickaway') {
            return;
        }

        SetOpen(false)
    }

    async function deleteBracelet(id){
        setBracelets(bracelets.filter(n => n.id !== id));
        await axios.delete( `https://brace-guardian.herokuapp.com/bracelets/${id}`, {
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

    }

    async function updateBracelet(brace, newName, newMacAddress, newDivision){
        
        console.log(brace.id)
        if(newName != "" && newMacAddress != ""){
            await axios.put( `http://brace-guardian.herokuapp.com/bracelets/${brace.id}`, {
                username: newName,
                macAddress: newMacAddress,
                division: newDivision
            }, {
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
        }else{
            pushMessage("There are spaces empties.")
            toggleError()
        }
        
    }


    return(
        <div>
            <Typography variant="h4" style={{margin: "2rem 0"}}>Bracelets</Typography>
            <div style={{justifyContent: "space-around", alignItems: "center", display: "flex", margin: "0 2rem"}}>
            
                <Autocomplete
                    id="search"
                    value={search}
                    options={bracelets.map(option => option.name)}
                    style={{ width: "100%", paddingRight: "3rem" }}
                    onChange={(event, newValue) => {
                        if( newValue !== null ){
                            setSearch(newValue);
                        }else {
                            setSearch("");
                        }
                    }}
                    renderInput={params => (
                        <TextField
                            {...params}
                            label="Search"
                            variant="outlined"
                        />
                    )}
                />
                <Button onClick={() => {toggleAddBracelet()}}>Add Bracelet</Button>
            </div>
            <Grid style={{padding: "2rem", display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: "wrap"}} container spacing={3}>
                
                {bracelets.map(bracelet => {
                    
                    if(search === "" || bracelet.name.toLowerCase().includes(search.toLowerCase())){
                        return(
                            <BraceletCard
                                key={bracelet.id}
                                bracelet={bracelet}
                                deleteBracelet={deleteBracelet}
                                updateBracelet={updateBracelet}
                            />
                        )
                    }
                })}
            </Grid>

            
            {showSingUp ? <SignUp toggle={() => toggleSingUp()}/> : null}
            {showAddBracelet ? <AddBracelet toggle={() => toggleAddBracelet()}/> : null}
            {isSuccess ? <SNotification severity={"success"} message={message} /> : null}
            {isError ? <SNotification severity={"error"} message={message} /> : null}
        </div>

    )
}