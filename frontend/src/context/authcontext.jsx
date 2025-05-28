import { createContext, useState ,useContext} from "react";

const AuthContext = createContext();
const useAuthContext = () => {
    return useContext(AuthContext);
}
const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("chat-user")) || null);    
    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export {AuthContext,AuthContextProvider,useAuthContext};