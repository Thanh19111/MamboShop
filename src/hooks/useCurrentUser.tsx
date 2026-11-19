import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useContext} from "react";
import {AppContext} from "../contexts/app.context.tsx";
import authApi from "../apis/auth.api.ts";
import {purchasesStatus} from "../constants/purchase.ts";
import {setProfileToLS} from "../utils/auth.ts";
import type {User} from "../types/user.type.ts";

const useCurrentUser = () => {
    const queryClient = useQueryClient()
    const {profile, setProfile, setIsAuthenticated} = useContext(AppContext);

    const logoutMutation = useMutation({
        mutationFn: authApi.logout,
        onSuccess: () => {
            setIsAuthenticated(false)
            setProfile(null)
            queryClient.removeQueries({queryKey: ['purchases', {status: purchasesStatus.inCart}]})
        }
    })

    const handleSetProfile = (user: User) => {
        setProfile(user)
        setProfileToLS(user)
    }

    const handleLogout = () => {
        logoutMutation.mutate()
    }

    return {profile, handleSetProfile, handleLogout}
}

export default useCurrentUser;