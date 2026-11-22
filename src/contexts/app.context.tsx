import {createContext} from 'react'
import type {ExtendedPurchase} from "../types/purchase.type.ts";
import type {User} from "../types/user.type.ts";
import {getToken, getUserProfile} from "../utils/auth.ts";

export interface AppContextInterface {
    isAuthenticated: boolean
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
    profile: User | null
    setProfile: React.Dispatch<React.SetStateAction<User | null>>
    extendedPurchases: ExtendedPurchase[]
    setExtendedPurchases: React.Dispatch<React.SetStateAction<ExtendedPurchase[]>>
    reset: () => void
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

export const initialAppContext = getInitialAppContext()
export const AppContext = createContext<AppContextInterface>(initialAppContext)
