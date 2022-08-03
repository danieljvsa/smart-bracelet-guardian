import {useEffect, useState, useContext} from "react";
import {Autocomplete, Button, Card, Grid, TextField, Typography, Alert, Snackbar} from "@mui/material";
import Context, { ContextProvider } from "../Contexts/Context";

export default function SNotification({message, severity}) {
    const [open, SetOpen] = useState(true)
    const {isSuccess, isError, toggleError, toggleSuccess} = useContext(Context)

    

    function handleClose(event, reason) {
        if (reason === 'clickaway') {
            return;
        }

        SetOpen(false)

        if(isSuccess === true){
            toggleSuccess()
        } else if(isError === true){
            toggleError()
        }
    }

    return (
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={severity}>{message}</Alert>
        </Snackbar>  
    )
}