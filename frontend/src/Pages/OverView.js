import {useContext, useEffect, useState} from "react";
import {
    Autocomplete, Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField, Typography
} from "@mui/material";

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import {useNavigate} from "react-router-dom";
import Context from "../Contexts/Context";
import SignUp from "../Components/SignUp";
import EditPatient from "../Components/EditPatient";
import AddPatient from "../Components/AddPatient";
import axios from "axios";
import SNotification from "../Components/SNotification";

export default function OverView(){
    const [data, setData] = useState([
        {id: 1, name: "Shea Hayden", totalFalls: 25, fallsToday: 5, fallsYesterday: 27, batteryValue: 90},
        {id: 2, name: "Lloyd Hurley", totalFalls: 20, fallsToday: 1, fallsYesterday: 12, batteryValue: 75},
        {id: 3, name: "Mildred Pennington", totalFalls: 50, fallsToday: 10, fallsYesterday: 5, batteryValue: 95},
        {id: 4, name: "Deborah Maguire", totalFalls: 26, fallsToday: 12, fallsYesterday: 7, batteryValue: 36},
        {id: 5, name: "Catrin Trujillo", totalFalls: 72, fallsToday: 13, fallsYesterday: 6, batteryValue: 12},
        {id: 6, name: "Janelle Hartley", totalFalls: 98, fallsToday: 7, fallsYesterday: 9, batteryValue: 15},
        {id: 7, name: "Blessing Cordova", totalFalls: 54, fallsToday: 8, fallsYesterday: 8, batteryValue: 83},
        {id: 8, name: "Ameena Rhodes", totalFalls: 63, fallsToday: 14, fallsYesterday: 16, batteryValue: 72},
        {id: 9, name: "Saffron Shields", totalFalls: 36, fallsToday: 17, fallsYesterday: 18, batteryValue: 5},
        {id: 10, name: "Addison Whitworth", totalFalls: 78, fallsToday: 2, fallsYesterday: 27, batteryValue: 92},
    ]);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("Name Desc");
    const { message,isError, isSuccess, showAddProfile, showSingUp, showEditProfile, toggleSingUp, toggleEditProfile, passProfile, deleteProfile, toggleAddProfile} = useContext(Context)
    const navigate = useNavigate();
   
    

    useEffect(() => {

        axios.get("https://brace-guardian.herokuapp.com/get-profiles", {
            headers: {
                authorization: "Bearer " + localStorage.getItem("token")
            }
        }).then(res=> {
            console.log(res.data)
            setData(res.data);
        }).catch(error => {
            console.log(error);
        });


    }, [data]);

    function sortBy(sortBy){
        if(sort.endsWith("Asc")){
            setSort(sortBy + " Desc");
        }else if(sort.endsWith("Desc")){
            setSort(sortBy + " Asc");
        }
    }
    return(
        
        <div>
            <Typography variant="h4" style={{margin: "2rem 0"}}>Overview</Typography>

            <div className="search-box" style={{display: "flex", justifyContent: "space-around", alignItems: 'center', margin: '0 2rem'}}>
                <Autocomplete
                    id="search"
                    value={search}
                    options={data.map(option => option.name)}
                    style={{ width: '100%' , paddingRight: "3rem"}}
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
                <Button onClick={() => {toggleAddProfile()}}>Add Patient</Button>
            </div>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">
                                <Box sx={{pl: 1, pb: 1}}>
                                <Button onClick={() => sortBy("Name")}>Name</Button>
                                    {(sort.includes("Name") && sort.endsWith("Asc")) ? <ArrowDropUpIcon/> : null}
                                    {(sort.includes("Name") && sort.endsWith("Desc")) ? <ArrowDropDownIcon/> : null}
                                </Box>
                            </TableCell>
                            <TableCell align="center">
                                <Box sx={{pl: 1, pb: 1}}>
                                <Button onClick={() => sortBy("Total Falls")}>Total Falls</Button>
                                    {(sort.includes("Total Falls") && sort.endsWith("Asc")) ? <ArrowDropUpIcon/> : null}
                                    {(sort.includes("Total Falls") && sort.endsWith("Desc")) ? <ArrowDropDownIcon/> : null}
                                </Box>
                            </TableCell>
                            <TableCell align="center">
                                <Box sx={{pl: 1, pb: 1}}>
                                <Button onClick={() => sortBy("Falls Today")}>Falls Today</Button>
                                    {(sort.includes("Falls Today") && sort.endsWith("Asc")) ? <ArrowDropUpIcon/> : null}
                                    {(sort.includes("Falls Today") && sort.endsWith("Desc")) ? <ArrowDropDownIcon/> : null}
                                </Box>
                            </TableCell>
                            <TableCell align="center">
                                <Box sx={{pl: 1, pb: 1}}>
                                <Button onClick={() => sortBy("Falls Yesterday")}>Falls Yesterday</Button>
                                    {(sort.includes("Falls Yesterday") && sort.endsWith("Asc")) ? <ArrowDropUpIcon/> : null}
                                    {(sort.includes("Falls Yesterday") && sort.endsWith("Desc")) ? <ArrowDropDownIcon/> : null}
                                </Box>
                            </TableCell>
                            <TableCell align="center">
                                <Box sx={{pl: 1, pb: 1}}>
                                <Button onClick={() => sortBy("Battery Value")}>Battery Value</Button>
                                    {(sort.includes("Battery Value") && sort.endsWith("Asc")) ? <ArrowDropUpIcon/> : null}
                                    {(sort.includes("Battery Value") && sort.endsWith("Desc")) ? <ArrowDropDownIcon/> : null}
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Box sx={{pl: 1, pb: 1}}>
                                  
                                </Box>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.filter(row => row.name.toLowerCase().includes(search.toLowerCase())).sort((a, b) => {
                            if(sort.includes("Name")){
                                if(sort.endsWith("Desc")){
                                    return a.name.localeCompare(b.name);
                                }else if(sort.endsWith("Asc")){
                                    return b.name.localeCompare(a.name);
                                }
                            }else if(sort.includes("Total Falls")){
                                if(sort.endsWith("Desc")){
                                    return b.totalFalls - a.totalFalls;
                                }else if(sort.endsWith("Asc")){
                                    return a.totalFalls - b.totalFalls;
                                }
                            }else if(sort.includes("Falls Today")){
                                if(sort.endsWith("Desc")){
                                    return b.todayFalls - a.todayFalls;
                                }else if(sort.endsWith("Asc")){
                                    return a.todayFalls - b.todayFalls;
                                }
                            }else if(sort.includes("Falls Yesterday")){
                                if(sort.endsWith("Desc")){
                                    return b.yesterdayFalls - a.yesterdayFalls;
                                }else if(sort.endsWith("Asc")){
                                    return a.yesterdayFalls - b.yesterdayFalls;
                                }
                            }else if(sort.includes("Battery Value")){
                                if(sort.endsWith("Desc")){
                                    return b.battery_level - a.battery_level;
                                }else if(sort.endsWith("Asc")){
                                    return a.battery_level - b.battery_level;
                                }
                            }
                        }).map(row => (
                            <TableRow key={row.name}>
                                <TableCell align="center">{row.name}</TableCell>
                                <TableCell align="center">{row.totalFalls}</TableCell>
                                <TableCell align="center">{row.todayFalls}</TableCell>
                                <TableCell align="center">{row.yesterdayFalls}</TableCell>
                                <TableCell align="center">{row.battery_level}</TableCell>
                                <TableCell align="center"><Button onClick={() => {passProfile(row.name, row.id); navigate(`/patient/${row.id}`)}}>Details</Button> | <Button onClick={() => {passProfile(row.name, row.id); toggleEditProfile()}} >Edit</Button> | <Button onClick={() => {deleteProfile(row.id)}}>Delete</Button></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {showSingUp ? <SignUp toggle={() => toggleSingUp()}/> : null}
            {showEditProfile ? <EditPatient toggle={() => toggleEditProfile()}/> : null}
            {showAddProfile ? <AddPatient toggle={() => toggleAddProfile()}/> : null}
            {isSuccess ? <SNotification severity={"success"} message={message} /> : null}
            {isError ? <SNotification severity={"error"} message={message} /> : null}
        </div>
        
        
    );
}