import {createContext, useState} from 'react'
import type {ExtendedPurchase} from "../types/purchase.type.ts";
import type {User} from "../types/user.type.ts";
import {getToken, getUserProfile} from "../utils/auth.ts";

interface AppContextInterface {
    isAuthenticated: boolean
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
    profile: User | null
    setProfile: React.Dispatch<React.SetStateAction<User | null>>
    extendedPurchases: ExtendedPurchase[]
    setExtendedPurchases: React.Dispatch<React.SetStateAction<ExtendedPurchase[]>>
    reset: () => void
}

interface Props {
    children: React.ReactNode
    defaultValue?: AppContextInterface
}

const getInitialAppContext: () => AppContextInterface = () => ({
    isAuthenticated: Boolean(getToken('access_token')),
    setIsAuthenticated: () => null,
    profile: getUserProfile(),
    setProfile: () => null,
    extendedPurchases: [],
    setExtendedPurchases: () => null,
    reset: () => null
})

const initialAppContext = getInitialAppContext()
export const AppContext = createContext<AppContextInterface>(initialAppContext)

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
