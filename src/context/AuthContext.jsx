import { createContext, useState, useContext } from "react";

const authContext = createContext(null);


export const AuthProvider = ({children})=> {
const [profile, setProfile] = useState(null);
    return <authContext.Provider value={{profile, setProfile}}>
        {children}
    </authContext.Provider>
}

export const useAuth = ()=> useContext(authContext)