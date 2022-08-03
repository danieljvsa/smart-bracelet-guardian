import {Box, Button, Card, TextField, Select, Autocomplete} from "@mui/material";
import {useState} from "react";

export default function NurseCard(props) {
    const [open, setOpen] = useState(false);

    const [username, setUsername] = useState(props.nurse.nurseName);
    const [number, setNumber] = useState(props.nurse.phone);
    const [division, setDivision] = useState(props.nurse.division);
    
    const options = [
        { value: 'front', label: 'Front' },
        { value: 'end', label: 'Back' },
      ]

    if(open){
        return (
            <Card style={{padding: "10px 2rem 0 2rem", margin: "1rem"}}>
                <TextField
                    style={{width: "100%",marginTop: 20, alignSelf: "center"}}
                    label="Nurse Name"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                <TextField
                    style={{width: "100%",marginTop: 20, alignSelf: "center"}}
                    label="Phone Number"
                    value={number}
                    onChange={e => setNumber(e.target.value)}
                />
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
                            style={{width: "100%",marginTop: 20, alignSelf: "center"}}
                            {...params}
                            label="Division"
                            variant="outlined"
                        />
                    )}
                />
                <Box style={{display: "flex", flexDirection: "row",alignItems: "center", justifyContent: "center", padding: "1rem"}}>
                    <Button
                        variant={"contained"}
                        style={{flex:1, marginRight: 5}}
                        onClick={() => {
                            props.deleteNurse(props.nurse);
                            setOpen(false);
                        }}>
                        Delete
                    </Button>
                    <Button
                        variant={"contained"}
                        style={{flex:1, marginLeft: 5}}
                        onClick={() => {
                            props.updateNurse(props.nurse, username, number, division);
                            setOpen(false);
                        }}>
                        Update
                    </Button>
                </Box>

                <Button
                    variant={"contained"}
                style={{width: "100%", alignSelf: "center", marginBottom: 5}}
                onClick={() => {
                    setOpen(false);
                }}
            >
                Close
            </Button>
            </Card>
        );
    }else{
        return (
            <Card style={{padding: "10px 2rem 0 2rem", margin: "1rem"}} key={props.nurse.nurseId} onClick={() => {
                setOpen(true);
                setUsername(props.nurse.nurseName);
                setNumber(props.nurse.phone);
                setDivision(props.nurse.division == "front" ? "Front" : "Back");
            }}>
                <h1>{props.nurse.nurseName}</h1>
                <p>{props.nurse.phone}</p>
                <p>{props.nurse.division == "front" ? "Front" : "Back"}</p>
            </Card>
        );
    }

}