import {useEffect, useState, useContext} from "react";
import NurseCard from "../Components/NurseCard";
import {Autocomplete, Box, Button, Card, Grid, Select, TextField, Typography} from "@mui/material";
import Context from "../Contexts/Context";
import SignUp from "../Components/SignUp";
import axios from "axios";
import AddNurse from '../Components/AddNurse'
import SNotification from "../Components/SNotification";

export default function NurseOverview(){
    const [nurses, setNurses] = useState([]);

    const options = [
        { value: 'front', label: 'Front' },
        { value: 'end', label: 'Back' },
      ]

    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("");
    const {message,pushMessage, toggleError, toggleSuccess, isError, isSuccess, showSingUp, showEditProfile, toggleSingUp, toggleAddNurse, showAddNurse} = useContext(Context)
    const [number, setNumber] = useState("");
    const [username, setUsername] = useState("");
    const [division, setDivision] = useState("");


    function deleteNurse(nurse){
        setNurses(nurses.filter(n => n.nurseId !== nurse.nurseId));
        axios.delete( `https://brace-guardian.herokuapp.com/nurses/${nurse.nurseId}`, {
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
        console.log(nurse);
    }

    function updateNurse(nurse, newName, newNumber, newDivision){
        setNurses(nurses.map(n => n.nurseId === nurse.nurseId ? {...n, nurseName: newName, number: newNumber, division: newDivision} : n));
        console.log(nurse)
        axios.put( `https://brace-guardian.herokuapp.com/nurses/${nurse.nurseId}`, {
            username: newName,
            phone: newNumber,
            division: (newDivision == "Front") ? "front" : "end"
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
    }

    useEffect(() => {
        axios.get("https://brace-guardian.herokuapp.com/get-nurses", {
            headers: {               
                authorization: "Bearer " + localStorage.getItem("token")
            }
        }).then(res => {
                setNurses(res.data);
        })
        .catch(err => console.log(err));
    }, [nurses]);

    return(
        <div>
        <div>
        
            <Typography variant="h4" style={{margin: "2rem 0"}}>Nurses</Typography>
            <div className="search-box" style={{justifyContent: "space-around", alignItems: "center", display: "flex", margin: '0 2rem'}}>
            
                <Autocomplete
                    id="search"
                    value={search}
                    options={nurses.map(option => option.nurseName)}
                    style={{ width: "100%", paddingRight: "3rem"}}
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
                <Button onClick={() => {toggleAddNurse()}}>Add Nurse</Button>
            </div>

            <Grid style={{padding: "2rem", display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: "wrap"}} container spacing={3}>
                {nurses.map(nurse => {
                    if(search === "" || nurse.nurseName.toLowerCase().includes(search.toLowerCase())){
                        return(
                            <NurseCard nurse={nurse} updateNurse={updateNurse} deleteNurse={deleteNurse} style={{margin: "1rem 2rem"}}/>
                        )
                    }
                })}

            </Grid>

            
        </div>
        <div>
            {showSingUp ? <SignUp toggle={() => toggleSingUp()}/> : null}
            {showAddNurse ? <AddNurse toggle={() => {toggleAddNurse()}}/> : null}
            {isSuccess ? <SNotification severity={"success"} message={message} /> : null}
            {isError ? <SNotification severity={"error"} message={message} /> : null}
        </div>
        </div>
    );
}

