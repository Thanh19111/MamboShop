import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useContext} from "react";
import {AppContext} from "../contexts/app.context.tsx";
import authApi from "../apis/auth.api.ts";
import {purchasesStatus} from "../constants/purchase.ts";
import {setUserProfile} from "../utils/auth.ts";
import type {User} from "../types/user.type.ts";

const useCurrentUser = () => {
    const queryClient = useQueryClient()
    const {profile, setProfile, setIsAuthenticated, setExtendedPurchases} = useContext(AppContext);

    const logoutMutation = useMutation({
        mutationFn: authApi.logout,
        onSuccess: () => {
            setIsAuthenticated(false)
            setProfile(null)
            setExtendedPurchases([])
            queryClient.removeQueries({queryKey: ['purchases', {status: purchasesStatus.inCart}]})
        }
    })

    const handleLogout = () => logoutMutation.mutate()

    const handleSetProfile = (user: User) => {
        setProfile(user)
        setUserProfile(user)
    }

    return {profile, handleSetProfile, handleLogout}
}

export default useCurrentUser;