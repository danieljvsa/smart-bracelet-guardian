import { Functions, FunctionsTwoTone } from "@mui/icons-material";
import axios from "axios";
import { createContext, useState, useEffect } from "react";
import SignUp from "../Components/SignUp";


export const Context = createContext({profiles: [],message: '',isError: false, isSuccess: false, profileName: '',profileId: 0, showAddBracelet: false, showAddNurse: false, showAddProfile: false, showSingUp: false, showEditProfile: false, toggleSingUp: () => {}, toggleEditProfile: () => {}, passProfile: () => {}, deleteProfile: () => {}, toggleAddProfile: () => {}, toggleAddNurse: () => {}, toggleAddBracelet: () => {} , toggleSuccess: () => {}, toggleError: () => {}, pushMessage: () => {} })


export function ContextProvider ({children}) {
    const baseURL = "https://brace-guardian.herokuapp.com/"
    const [showSingUp, setShowSingUp] = useState(false);
    const [showEditProfile, setEditProfile] = useState(false);
    const [showAddProfile, setAddProfile] = useState(false);
    const [showAddNurse, setAddNurse] = useState(false);
    const [showAddBracelet, setAddBracelet] = useState(false);
    const [profileId, setProfileId] = useState(0);
    const [profileName, setProfileName] = useState(0);
    const [isSuccess, SetIsSuccess] = useState(false);
    const [message, SetMessage] = useState("")
    const [isError, SetIsError] = useState(false);
    const [profiles, setProfiles] = useState([]);

    useEffect(() => {
        axios.get("https://brace-guardian.herokuapp.com/get-profiles", {
            headers: {
                authorization: "Bearer " + localStorage.getItem("token")
            }
        }).then(res => {
                //console.log(res.data)
                setProfiles(res.data);
        })
        .catch(err => console.log(err));
    }, [])

    function toggleSingUp(){
        setShowSingUp(!showSingUp);
        console.log(showSingUp)
    }

    function toggleEditProfile(){
        setEditProfile(!showEditProfile)
        console.log(showEditProfile)
    }

    function toggleAddProfile(){
        setAddProfile(!showAddProfile)
        console.log(showAddProfile)
    }

    function toggleAddNurse(){
        setAddNurse(!showAddNurse)
        console.log(showAddNurse)
    }

    function toggleAddBracelet(){
        setAddBracelet(!showAddBracelet)
        console.log(showAddBracelet)
    }

    function toggleSuccess() {
        SetIsSuccess(!isSuccess)
    }

    function toggleError(){
        SetIsError(!isError)
    }

    function pushMessage(message){
        SetMessage(message)
    }

    function passProfile(name, id){
        setProfileId(id)
        setProfileName(name)

    }

    function deleteProfile(id){
        axios.delete(baseURL + 'profiles/' + id, {
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
    }
    
    return (
        <Context.Provider value={{profiles, message, SetMessage, isError, isSuccess, showAddBracelet, showAddNurse, showAddProfile, profileName, profileId, showSingUp, showEditProfile, setShowSingUp, toggleSingUp, toggleEditProfile, passProfile, deleteProfile, toggleAddProfile, toggleAddNurse, toggleAddBracelet, toggleError, toggleSuccess, pushMessage}}>
            {children}
        </Context.Provider>
    )
    
}

export default Context