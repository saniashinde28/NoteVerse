import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../../store/authSlice";
import authService from "../../../appwrite/auth";

function LogoutBtn(){
    const dispatch=useDispatch();

    const logoutHandler=()=>{
        authService.logout().then(()=>{
            dispatch(logout())
        })                //most of the appwrite functions return a promise
    }
    return(
        <button onClick={logoutHandler} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full">Logout</button>
    )
}

export default LogoutBtn;