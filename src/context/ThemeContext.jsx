import { createContext } from "react";
import { useState } from "react";
import { useContext } from "react";
import { useEffect } from "react";

const ThemeContext=createContext()

export function ThemeProvider({children}){
    const [theme,setTheme]=useState(()=>{
        const savedTheme=localStorage.getItem("theme");

        if (savedTheme) {
        return savedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";

    });

    useEffect(()=>{
        document.documentElement.classList.toggle("dark",theme=="dark");
        localStorage.setItem("theme",theme);
    },[theme]);

    return(
        <ThemeContext.Provider value={{theme,setTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}


export default function useTheme(){  //writing directly here instead of useContext in components
    return useContext(ThemeContext)    //custom hook
}