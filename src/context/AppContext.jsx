import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
    
export const AppContext = createContext()

export const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const currency = import.meta.env.VITE_CURRENCY || 'USD';

    const navigate = useNavigate()
    const [showLogin, setShowLogin] = useState(false)
    const [userData, setUserData] = useState(null)

    const value = {
        showLogin, setShowLogin,
        backendUrl, currency, navigate,
        userData, setUserData
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}
