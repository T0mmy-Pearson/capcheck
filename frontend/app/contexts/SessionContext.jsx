import { createContext, useState } from "react";

export const SessionContext = createContext({defaultValue: 1})

export const SessionProvider = (children)=>{
    const [currentUserId, setCurrentUserId] = useState(1)
    return <SessionContext.Provider value={{currentUserId, setCurrentUserId}}>
        {children}
    </SessionContext.Provider>
}
