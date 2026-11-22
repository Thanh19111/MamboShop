import {useState} from "react";
import type {ExtendedPurchase} from "../types/purchase.type.ts";
import type {User} from "../types/user.type.ts";
import {AppContext, type AppContextInterface, initialAppContext} from "./app.context.tsx";

interface Props {
    children: React.ReactNode
    defaultValue?: AppContextInterface
}

export const AppProvider = ({
                                children,
                                defaultValue = initialAppContext}: Props) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(defaultValue.isAuthenticated)
    const [extendedPurchases, setExtendedPurchases] = useState<ExtendedPurchase[]>(defaultValue.extendedPurchases)
    const [profile, setProfile] = useState<User | null>(defaultValue.profile)

    const reset = () => {
        setIsAuthenticated(false)
        setExtendedPurchases([])
        setProfile(null)
    }

    return (
        <AppContext.Provider
            value={{
                isAuthenticated,
                setIsAuthenticated,
                profile,
                setProfile,
                extendedPurchases,
                setExtendedPurchases,
                reset
            }}
        >
            {children}
        </AppContext.Provider>
    )
}